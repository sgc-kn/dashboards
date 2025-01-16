{ pkgs, lib, config, inputs, ... }:

let
  unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in

{
  packages = [
    pkgs.git
    pkgs.git-lfs
  ];

  languages.javascript.enable = true;
  languages.javascript.npm.enable = true;
  languages.javascript.npm.install.enable = true;

  languages.python.enable = true;
  languages.python.uv.enable = true;
  languages.python.uv.package = unstable.uv;
  languages.python.uv.sync.enable = true;

  enterShell = ''
    uv run pre-commit install
  '';

  processes.preview = {
    exec = "npm run dev";
    process-compose =  {
      availability = {
        backoff_seconds = 5;
        restart = "on_failure";
      };
    };
  };
}
