{ pkgs, lib, config, inputs, ... }:

let
  unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in

{
  devcontainer.enable = true;

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
