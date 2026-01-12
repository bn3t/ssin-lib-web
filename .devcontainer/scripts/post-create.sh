#!/bin/bash
set -e

echo "=== Running post-create setup ==="

# Apply chezmoi dotfiles if DOTFILES_REPO is set
if [ -n "$DOTFILES_REPO" ]; then
    echo "Applying chezmoi dotfiles from $DOTFILES_REPO..."
    chezmoi init --apply "$DOTFILES_REPO" || echo "Warning: chezmoi setup failed, continuing..."
elif command -v chezmoi &> /dev/null; then
    echo "DOTFILES_REPO not set. To apply dotfiles, set it in your environment:"
    echo "  export DOTFILES_REPO=https://github.com/yourusername/dotfiles.git"
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Verify Claude Code installation
if command -v claude &> /dev/null; then
    echo "Claude Code CLI is installed: $(claude --version 2>/dev/null || echo 'version check unavailable')"
else
    echo "Installing Claude Code CLI..."
    npm install -g @anthropic-ai/claude-code
fi

echo "=== Post-create setup complete ==="
