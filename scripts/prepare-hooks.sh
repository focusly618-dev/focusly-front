#!/usr/bin/env sh
# Setup husky git hooks
husky || true

# Setup fallback bridge in .git/hooks/pre-commit for legacy git versions (< 2.9)
HOOK_FILE=".git/hooks/pre-commit"
if [ -d ".git/hooks" ]; then
  cat << 'EOF' > "$HOOK_FILE"
#!/usr/bin/env sh
if [ "$(uname -m)" = "x86_64" ] && [ "$(sysctl -n sysctl.proc_translated 2>/dev/null)" = "1" ]; then
  exec arch -arm64 /bin/sh "$0" "$@"
fi

export PATH="/opt/homebrew/bin:/usr/bin:$PATH:/usr/local/bin"

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
if [ -f "$repo_root/.husky/pre-commit" ]; then
  exec sh "$repo_root/.husky/pre-commit" "$@"
fi
EOF
  chmod +x "$HOOK_FILE"
fi
