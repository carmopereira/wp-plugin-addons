# @carmopereira/wp-plugin-addons

Addons to speed up WordPress plugin development for both traditional PHP plugins and Gutenberg block plugins.

## Installation

Or run directly with `npx` avoiding local cache:

```bash
npx @carmopereira/wp-plugin-addons@latest
```

## Usage

### 1. Scaffold your plugin

You can start from a Gutenberg block plugin or a traditional PHP plugin:

**Gutenberg block plugin (create-block)**
```bash
npx @wordpress/create-block@latest my-plugin --variant=dynamic
cd my-plugin
```

**PHP plugin scaffold**
```bash
npx @carmopereira/wp-php-template
cd my-plugin
```

### 2. Apply the custom setup

Open a terminal at the plugin folder

```bash
npx @carmopereira/wp-plugin-addons@latest
```

## What gets added

The `create-block-carmo-addon` setup adds:

### Scripts to `package.json`

- **`prebuild`**: Automatically updates the version before build (patch version)
- **`updateGIT`**: Interactive script to run git add, commit, and push
- **`symlink`**: Script to create a plugin symlink in the WordPress directory
- **`plugin-zip`**: Builds a distributable plugin `.zip` via `wp-scripts plugin-zip` — only added if the project doesn't already define it

### Scripts in the `scripts/` folder

- **`sync-version.js`**: Syncs the version between `package.json`, the main PHP file, and `block.json`
- **`create-symlink.js`**: Creates the plugin symlink in `wp-content/plugins`
- **`update-git.js`**: Simplifies the commit and push process

### `.gitignore` updates

Adds standard entries for build artifacts, logs, etc.

## Available scripts

After applying the setup, you can run:

```bash
# Create plugin symlink
npm run symlink

# Commit and push
npm run updateGIT

# Build (automatically updates version)
npm run build

# Build a distributable plugin zip
npm run plugin-zip
```

## Repository structure

```
carmo-wp-plugin-addons/
├── setups/
│   └── create-block-carmo-addon/
│       ├── setup/
│       │   ├── create-symlink.js
│       │   ├── sync-version.js
│       │   └── update-git.js
│       ├── .gitignore
│       └── package-scripts.json
├── setup.js
├── package.json
├── .npmignore
└── README.md
```

## License

GPL-2.0-or-later
