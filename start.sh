#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  exec python3 run.py "$@"
fi
echo "Python 3.12+ required; install from python.org" >&2
exit 1
