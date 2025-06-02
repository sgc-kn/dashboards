# run live preview server
preview:
    npm run dev

# test local build
test: clean build

# clear cached files (Observable Framework FileLoaders)
clean:
    npm run clean

# build website (into ./dist folder)
build:
    npm run build

# upgrade dev tooling to the latest version 
upgrade:
    # update js package versions in package.json
    npx npm-check-updates -u
    # install js packages as defined in package.json
    npm install
    # update python packages in uv.lock
    uv lock --upgrade
    # install python packages as defined in uv.lock
    uv sync