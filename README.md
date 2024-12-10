Preview of `main` branch (latest succesful CI build): https://sgc-kn.github.io/dashboards/

# SGC Dashboards

This is an [Observable Framework](https://observablehq.com/framework) project.

Observable Framework is a static website generator designed for data
intensive websites. It supports loading and preparing data during the
build phase using various programming languages (Python, R, etc).

Our data loaders are written in Python. To build this site you'll need:
- Observable framework in the right version (see `package-lock.json`)
- Python 3 and a couple of Python dependencies (see `requirements.txt`)

We maintain a development environment that provides all dependencies in
the right versions without cluttering your system. We recommend [using
this tool](https://devenv.sh/getting-started/) together with [automatic
shell activation](https://devenv.sh/automatic-shell-activation/).

Within this environment you can start a local preview server by running:

```
npm run dev
```

Then visit <http://localhost:3000> to preview your project.

**Alternatively**, we also support [Github Codespaces](https://github.com/features/codespaces).


## Project structure

A typical Framework project looks like this:


```ini
.
├─ src
│  ├─ components
│  │  └─ timeline.js           # an importable module
│  ├─ data
│  │  ├─ launches.csv.js       # a data loader
│  │  └─ events.json           # a static data file
│  ├─ example-dashboard.md     # a page
│  ├─ example-report.md        # another page
│  └─ index.md                 # the home page
├─ .gitignore
├─ observablehq.config.js      # the project config file
├─ package.json
└─ README.md
```

**`src`** - This is the “source root” — where your source files live. Pages go here. Each page is a Markdown file. Observable Framework uses [file-based routing](https://observablehq.com/framework/routing), which means that the name of the file controls where the page is served. You can create as many pages as you like. Use folders to organize your pages.

**`src/index.md`** - This is the home page for your site. You can have as many additional pages as you’d like, but you should always have a home page, too.

**`src/data`** - You can put [data loaders](https://observablehq.com/framework/loaders) or static data files anywhere in your source root, but we recommend putting them here.

**`src/components`** - You can put shared [JavaScript modules](https://observablehq.com/framework/javascript/imports) anywhere in your source root, but we recommend putting them here. This helps you pull code out of Markdown files and into JavaScript modules, making it easier to reuse code across pages, write tests and run linters, and even share code with vanilla web applications.

**`observablehq.config.js`** - This is the [project configuration](https://observablehq.com/framework/config) file, such as the pages and sections in the sidebar navigation, and the project’s title.

## Observable Framework command reference

| Command              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `npm clean-install`  | Install or reinstall dependencies                        |
| `npm run dev`        | Start local preview server                               |
| `npm run build`      | Build your static site, generating `./dist`              |
| `npm run clean`      | Clear the local data loader cache                        |
| `npm run observable` | Run commands like `observable help`                      |

## More Info

For more information, see <https://observablehq.com/framework/getting-started>.
