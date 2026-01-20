# @carmopereira/wp-block-setup

Tool to add custom scripts and configuration to WordPress projects created with `@wordpress/create-block`.

## Installation

```bash
npm install -g @carmopereira/wp-block-setup
```

Or run directly with `npx`:

```bash
npx @carmopereira/wp-block-setup
```

## Usage

### 1. Create a new WordPress block

```bash
npx @wordpress/create-block@latest my-plugin --variant=dynamic
cd my-plugin
```

### 2. Apply the custom setup

```bash
npx @carmopereira/wp-block-setup create-block-carmo-addon
```

Or run without arguments to choose interactively:

```bash
npx @carmopereira/wp-block-setup
```

## What gets added

The `create-block-carmo-addon` setup adds:

### Scripts to `package.json`

- **`prebuild`**: Automatically updates the version before build (patch version)
- **`updateGIT`**: Interactive script to run git add, commit, and push
- **`symlink`**: Script to create a plugin symlink in the WordPress directory

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
```

## Repository structure

```
carmo-wp-block-template/
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

## Development

To test locally:

```bash
npm link
cd /path/to/wordpress-project
npx @carmopereira/wp-block-setup
```

## Publish to npm

```bash
npm login
npm publish --access public
```

## License

GPL-2.0-or-later
