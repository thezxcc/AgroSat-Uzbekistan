# Start AgroSat in minutes

AgroSat Uzbekistan is a self-contained NASA-data demonstration. The **NASA climate files are included**, so reviewers do not need accounts, API keys or a live NASA service.

## Step 1 — Download

From a terminal:

```bash
git clone https://github.com/thezxcc/AgroSat-Uzbekistan.git
cd AgroSat-Uzbekistan
```

Or select **Code → Download ZIP** on GitHub, extract it, then open the extracted folder.

## Step 2 — Choose ONE launch method

### Option A — Docker (the same command on Windows, macOS and Linux)

**Requires:** Docker Desktop or Docker Engine with Compose v2 running.

```bash
docker compose up --build
```

**Open:** <http://localhost:8080>

This builds and starts both services automatically:
- a Python 3.13 FastAPI API containing the archived NASA source datasets;
- a production React website served by Nginx, which forwards `/api/*` requests internally.

**Stop:** Ctrl+C followed by `docker compose down` (if needed).

**No public port for the API**, and no additional database or .env credentials required.

If port 8080 is occupied, change only the mapping `127.0.0.1:8080:80` in `compose.yaml` to `127.0.0.1:8081:80` and visit <http://localhost:8081>.

### Option B — Windows without Docker

**Requires:** [Python 3.12+](https://www.python.org/downloads/) and [Node.js 22.12+ or 24+ LTS](https://nodejs.org/) installed and available on PATH.

1. Double-click **`START_HERE.bat`** from the extracted project folder.
2. On the first run, the script creates `backend/.venv` and installs Python and JavaScript dependencies from the internet.
3. The site and API start, and the browser opens automatically at **http://127.0.0.1:5173/**.

Or run `py -3 run.py` from a terminal. Leave the terminal open while using AgroSat.

**Stop:** Ctrl+C in the terminal window.

### Option C — macOS / Linux without Docker

**Requires:** Python 3.12+, Node.js 22.12+ or 24+, and an internet connection for the first install.

```bash
python3 run.py
```

**Open:** <http://127.0.0.1:5173/>

The script checks prerequisites, creates a Python virtual environment, installs dependencies, starts FastAPI and Vite, waits for both to respond, and opens the browser.

**Stop:** Ctrl+C.

## Quick self-check

With the project running, open or test:

| URL | Expected result |
|---|---|
| `http://localhost:8080/` (Docker) or `http://127.0.0.1:5173/` (native) | AgroSat website and crop rotation helper |
| `http://localhost:8080/api/health` (Docker) or `http://127.0.0.1:8000/api/health` (native) | JSON with `"status":"ok"` and `"records":9497` |
| `/api/climate/2025` | JSON with original NASA-derived annual climate metrics |
| Crop comparison | Select water/soil/priority and compare A, B, C |

On a machine with Git and Docker installed, this is enough to reproduce the project from scratch.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `docker` not found | Install/start Docker Desktop, or use the Python+Node native launch instead |
| Docker cannot bind port 8080 | Change the left-hand host port in `compose.yaml` to 8081 |
| `python` or `node` not found | Install the versions above, reopen terminal and retry |
| `npm ci` fails | Check the internet connection or proxy; try again |
| Windows opens Microsoft Store instead of Python | Install Python from python.org and select **Add Python to PATH** during installation |
| Port 8000 or 5173 is already used | Close the other service or set distinct `AGROSAT_API_PORT` / `AGROSAT_WEB_PORT` environment values before running `run.py` |
| Windows PowerShell execution policy | Launch via `START_HERE.bat`, which does not require running a PowerShell script |
| The UI loads but no analysis appears | Check the API health URL above; both services must be running |
| Docker build does not work behind a proxy | The first build needs access to Python packages, npm packages and Docker images |

## Verify the code

After launching in development mode on Windows:

```powershell
.\check_all.ps1
```

For cross-platform static and Python verification:

```bash
python -m pytest -q backend/tests
cd frontend
npm ci
npm run lint
npm run test:i18n
npm run build
```

Set `PYTHONPATH=backend` for standalone Python tests from the repository root, or run tests after installing from `backend/requirements.txt`. The GitHub Actions pipeline executes test and Docker smoke jobs automatically.

## Local development details

- Backend FastAPI: `http://127.0.0.1:8000`
- Frontend Vite: `http://127.0.0.1:5173`
- Python source: `backend/app/`; NASA source JSON: `backend/data/`
- React source: `frontend/src/`; illustrative image assets: `frontend/public/`
- Docker: Nginx forwards `/api/` requests to the internal FastAPI container, so no cross-origin configuration is necessary.

See [README.md](README.md), [data sources](docs/DATA_SOURCES_AND_CREDITS.md) and the [scientific limitations](docs/SOURCE_TRACEABILITY.md).

**Note:** the project is an evidence-limited educational prototype; it does not predict farm-specific yield, profit or water savings.
