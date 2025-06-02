#!/usr/bin/env bash
set -e

# configure git lfs
git lfs pull # get large files
git lfs install # automate git lfs pull in the future
git config --global diff.lfs.textconv cat # diff large files like usual files

# install uv (used for Python package management)
pipx install rust-just uv

# create Python virtual environment .venv with all Python dependencies (used as default Python interpreter)
uv sync

# install Javascript dependencies
npm clean-install

# setup pre-commit hooks
uv run pre-commit install