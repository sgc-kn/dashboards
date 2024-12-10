{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/integrations/codespaces-devcontainer/
  devcontainer.enable = true;

  # https://devenv.sh/basics/
  env.DEVENV = "sgc-kn/dashboards";

  # https://devenv.sh/packages/
  packages = [ pkgs.git ];

  # https://devenv.sh/languages/
  languages.javascript.enable = true;
  languages.javascript.npm.enable = true;
  languages.python.enable = true;
  languages.python.venv.enable = true;
  languages.python.venv.requirements = "pip-tools";

  # https://devenv.sh/processes/
  processes.preview = {
    exec = "npm run dev";
    process-compose =  {
      availability = {
        backoff_seconds = 5;
        restart = "on_failure";
      };
    };
  };

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  scripts.update.exec = ''
    # install dependencies as defined in the lock files

    echo install javascript dependencies from package-lock.json
    npm clean-install

    echo install python dependencies from requirements.txt
    pip-sync
  '';

  scripts.upgrade.exec = ''
    # update lock files with newest versions & install

    echo update npm packages and package-lock.json
    npm update

    echo update requirements.txt
    pip-compile --upgrade --strip-extras --quiet

    echo install python dependencies from requirements.txt
    pip-sync
  '';

  enterShell = ''
    update
  '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  # enterTest = ''
  #   echo "Running tests"
  #   git --version | grep --color=auto "${pkgs.git.version}"
  # '';

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
