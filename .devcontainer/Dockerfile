FROM mcr.microsoft.com/devcontainers/javascript-node:20

RUN apt-get update \
    && apt-get install -y git-lfs pipx \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY postCreate.sh /