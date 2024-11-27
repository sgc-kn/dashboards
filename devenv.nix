{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.DEVENV = "sgc-kn/dashboards";

  # https://devenv.sh/packages/
  packages = [ pkgs.git ];

  # https://devenv.sh/languages/
  languages.javascript.enable = true;
  languages.javascript.npm.enable = true;
  languages.python.enable = true;
  languages.python.venv.enable = true;

  # https://devenv.sh/processes/
  # processes.cargo-watch.exec = "cargo-watch";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  scripts.update.exec = ''
    # install dependencies as defined in the lock files

    echo install javascript dependencies from package-lock.json
    npm clean-install

    echo install python dependencies from requirements.txt
    pip install -r requirements.txt
  '';

  scripts.upgrade.exec = ''
    # update lock files with newest versions

    echo update devenv.lock
    devenv update

    echo update package-lock.json
    npm install --package-lock-only

    echo update requirements.txt
    pip-compile --upgrade --strip-extras --quiet
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
  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
