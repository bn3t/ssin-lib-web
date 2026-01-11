FROM mcr.microsoft.com/devcontainers/javascript-node:22

# Install essential system packages
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    vim \
    jq \
    unzip \
    tree \
    zsh \
    && rm -rf /var/lib/apt/lists/*

# Install neovim from apt (stable version)
RUN apt-get update && apt-get install -y neovim && rm -rf /var/lib/apt/lists/*

# Install chezmoi
RUN sh -c "$(curl -fsLS get.chezmoi.io)" -- -b /usr/local/bin

# Install monitoring and disk tools
RUN apt-get update && apt-get install -y \
    btop \
    htop \
    duf \
    ncdu \
    iotop \
    sysbench \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code CLI globally
RUN npm install -g @anthropic-ai/claude-code

# Set zsh as default shell for the node user
RUN chsh -s $(which zsh) node

# Set the default user
USER node
