"""AgroSat quick start: install missing dependencies and run API + Vite locally."""
from __future__ import annotations

import argparse
import hashlib
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
import webbrowser

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"
IS_WINDOWS = os.name == "nt"
VENV_PYTHON = BACKEND / ".venv" / ("Scripts/python.exe" if IS_WINDOWS else "bin/python")


def die(message: str) -> None:
    raise SystemExit(f"\nAgroSat startup: {message}\n")


def command_output(*command: str) -> str:
    return subprocess.check_output(command, text=True, stderr=subprocess.STDOUT).strip()


def check_requirements() -> str:
    if sys.version_info < (3, 12):
        die("Python 3.12 or newer is required. Install it from https://www.python.org/downloads/")
    node = shutil.which("node")
    npm = shutil.which("npm.cmd" if IS_WINDOWS else "npm")
    if not node or not npm:
        die("Node.js 22.12+ or 24+ is required. Install the LTS version from https://nodejs.org/")
    version = command_output(node, "--version").lstrip("v").split(".")
    if (int(version[0]), int(version[1])) < (22, 12):
        die(f"Node.js {'.'.join(version)} is too old. Install the current LTS from https://nodejs.org/")
    for f in ("NASA_IMERG_Urgench_2000_2025_DAILY_SOURCE.json",
              "NASA_POWER_TEMPERATURE_Urgench_2000_2025_DAILY_SOURCE.json"):
        if not (BACKEND / "data" / f).is_file():
            die(f"Required archived NASA source is missing: backend/data/{f}")
    print(f"Prerequisites OK: Python {sys.version.split()[0]}, Node {command_output(node, '--version')}")
    return npm


def install_dependencies(npm: str) -> None:
    if not VENV_PYTHON.is_file():
        print("\n[1/3] Creating isolated Python environment...")
        subprocess.run([sys.executable, "-m", "venv", str(BACKEND / ".venv")], check=True)
    requirements = BACKEND / "requirements.txt"
    pip_marker = BACKEND / ".venv" / ".agrosat-requirements-hash"
    digest = hashlib.sha256(requirements.read_bytes()).hexdigest()
    if not pip_marker.is_file() or pip_marker.read_text() != digest:
        print("\n[1/3] Installing Python dependencies...")
        subprocess.run([str(VENV_PYTHON), "-m", "pip", "install", "--disable-pip-version-check",
                        "-r", str(requirements)], check=True)
        pip_marker.write_text(digest)

    package_lock = FRONTEND / "package-lock.json"
    npm_marker = FRONTEND / "node_modules" / ".agrosat-lock-hash"
    digest = hashlib.sha256(package_lock.read_bytes()).hexdigest()
    if not npm_marker.is_file() or npm_marker.read_text() != digest:
        print("\n[2/3] Installing JavaScript dependencies (npm ci)...")
        subprocess.run([npm, "ci", "--no-audit", "--no-fund"], cwd=FRONTEND, check=True)
        npm_marker.write_text(digest)
    print("Dependencies are ready.")


def port_free(port: int) -> bool:
    with socket.socket() as s:
        return s.connect_ex(("127.0.0.1", port)) != 0


def wait_for(url: str, process: subprocess.Popen, seconds: float = 35) -> None:
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        if process.poll() is not None:
            die(f"A service exited unexpectedly with code {process.returncode}; review its output above.")
        try:
            with urllib.request.urlopen(url, timeout=1.0) as response:
                if response.status == 200:
                    return
        except (OSError, urllib.error.URLError):
            pass
        time.sleep(0.35)
    die(f"Service failed to become ready at {url}. Review the messages above.")


def serve(npm: str, open_browser: bool) -> None:
    try:
        api_port = int(os.environ.get("AGROSAT_API_PORT", "8000"))
        web_port = int(os.environ.get("AGROSAT_WEB_PORT", "5173"))
        if not 1024 <= api_port <= 65535 or not 1024 <= web_port <= 65535 or api_port == web_port:
            die("Choose two different unprivileged ports (1024–65535).")
    except ValueError:
        die("AGROSAT_API_PORT and AGROSAT_WEB_PORT must be port numbers.")
    for label, port in (("API", api_port), ("website", web_port)):
        if not port_free(port):
            die(f"Port {port} is in use ({label}). Close the other service or change AGROSAT_{'API' if label == 'API' else 'WEB'}_PORT.")

    env = os.environ.copy()
    env["AGROSAT_API_PORT"] = str(api_port)
    env["AGROSAT_WEB_PORT"] = str(web_port)
    env.pop("VITE_API_URL", None)  # Native local mode always uses Vite's /api proxy.
    processes: list[subprocess.Popen] = []
    try:
        print("\n[3/3] Starting AgroSat...")
        api = subprocess.Popen([str(VENV_PYTHON), "-m", "uvicorn", "app.main:app",
                                "--host", "127.0.0.1", "--port", str(api_port)],
                               cwd=BACKEND, env=env)
        processes.append(api)
        wait_for(f"http://127.0.0.1:{api_port}/api/health", api)
        web = subprocess.Popen([npm, "run", "dev", "--", "--host", "127.0.0.1",
                                "--port", str(web_port), "--strictPort"],
                               cwd=FRONTEND, env=env)
        processes.append(web)
        url = f"http://127.0.0.1:{web_port}/"
        wait_for(url, web)
        print(f"\nAgroSat is ready: {url}")
        print("API health: http://127.0.0.1:%d/api/health" % api_port)
        print("Press Ctrl+C to stop both services.")
        if open_browser:
            webbrowser.open(url)
        while True:
            for process in processes:
                if process.poll() is not None:
                    die(f"A service stopped with code {process.returncode}.")
            time.sleep(0.5)
    except KeyboardInterrupt:
        print("\nStopping AgroSat...")
    finally:
        for process in reversed(processes):
            if process.poll() is None:
                process.terminate()
        for process in reversed(processes):
            try:
                process.wait(timeout=4)
            except subprocess.TimeoutExpired:
                process.kill()


def main() -> None:
    parser = argparse.ArgumentParser(description="Quick start for AgroSat Uzbekistan")
    parser.add_argument("--check", action="store_true", help="Only check Python, Node and NASA inputs")
    parser.add_argument("--no-browser", action="store_true", help="Do not open the browser automatically")
    args = parser.parse_args()
    npm = check_requirements()
    if not args.check:
        try:
            install_dependencies(npm)
            serve(npm, not args.no_browser)
        except subprocess.CalledProcessError as exc:
            die(f"Dependency installation failed (exit {exc.returncode}). Check your internet connection.")


if __name__ == "__main__":
    main()
