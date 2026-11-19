#!/usr/bin/env bash
# Download the private trajectories dataset from Hugging Face into ./data/trajectories.
# Requires HF_TOKEN (read-only, fine-grained, scoped to this dataset) in the environment.
set -euo pipefail

# Load HF_TOKEN from a gitignored .env if present (cloud envs can set it directly).
ROOT="$(git rev-parse --show-toplevel)"
# Main checkout's .env (shared across worktrees) first, then this worktree's.
MAIN="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
for f in "$MAIN/.env" "$ROOT/.env"; do
  if [ -f "$f" ]; then set -a; . "$f"; set +a; fi
done

REPO="${HF_REPO:-gideonite/frontier-rsi-bench-trajectories}"
DEST="${DATA_DIR:-$(git rev-parse --show-toplevel)/data/trajectories}"

if [ -z "${HF_TOKEN:-}" ]; then
  echo "HF_TOKEN is not set; cannot access private dataset $REPO" >&2
  exit 1
fi

if ! command -v hf >/dev/null 2>&1; then
  python3 -m pip install -q --user huggingface_hub
  export PATH="$HOME/.local/bin:$PATH"
fi

mkdir -p "$DEST"
# Re-running only fetches missing/changed files.
hf download "$REPO" --repo-type dataset --local-dir "$DEST"
echo "Trajectories in $DEST"
