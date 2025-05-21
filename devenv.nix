{ pkgs, lib, config, inputs, ... }:

let
  unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in

{
  packages = [
    pkgs.git
    pkgs.git-lfs
    unstable.uv
  ];

  languages.javascript.enable = true;
  languages.javascript.npm.enable = true;
  languages.javascript.npm.install.enable = true;

  enterShell = ''
    uv run pre-commit install
  '';

  enterTest = ''
    uv run ruff check
    uv run ruff format --check
  '';
}
