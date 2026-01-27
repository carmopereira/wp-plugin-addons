# Instructions for Publishing to npm

This document explains how to publish this repository as an npm package to use as an addon for WordPress plugin projects (PHP or Gutenberg blocks).

## 📋 Prerequisites

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com/signup)
2. **Node.js**: Version 14.0.0 or higher
3. **Git**: Repository configured and synced with GitHub

## 🔧 Initial Setup

### 1. Check `package.json`

The `package.json` is already configured with:
- Package name: `@carmopereira/wp-plugin-addons`
- Version: `1.0.0`
- Binary: `carmo-wp-plugin-addons`
- Included files: `setup.js` and `setups/`

### 2. Log in to npm

```bash
npm login
```

Enter your credentials:
- Username
- Password
- Email
- OTP (if you have 2FA enabled)

### 3. Verify you are logged in

```bash
npm whoami
```

It should show your npm username.

## 📦 Publish to npm

### Option 1: Normal publish

```bash
npm publish --access public
```

> **Note**: `--access public` is required because the package uses a scope (`@carmopereira/`). Scoped packages are private by default.

### Option 2: Publish with verification

Before publishing, you can verify what will be included:

```bash
# See what will be published
npm pack --dry-run

# Create a local tarball for testing
npm pack
```

This creates a `.tgz` file you can inspect.

## 🔄 Update Version

When you make changes and want to publish a new version:

### Method 1: Update manually

1. Edit `package.json` and bump the version:
   - Patch: `1.0.0` → `1.0.1` (fixes)
   - Minor: `1.0.0` → `1.1.0` (new features)
   - Major: `1.0.0` → `2.0.0` (breaking changes)

2. Publish:
```bash
npm publish --access public
```

### Method 2: Use npm version (recommended)

```bash
# Patch version (1.0.0 → 1.0.1)
npm version patch

# Minor version (1.0.0 → 1.1.0)
npm version minor

# Major version (1.0.0 → 2.0.0)
npm version major
```

This automatically:
- Updates `package.json`
- Creates a git commit with a tag
- You can then run `npm publish --access public`

## ✅ Verify publication

After publishing, verify it is available:

1. **In the browser**: https://www.npmjs.com/package/@carmopereira/wp-plugin-addons
2. **Via CLI**:
```bash
npm view @carmopereira/wp-plugin-addons
```

## 🚀 Use the published package

Once published, other developers can use:

### Global installation

```bash
npm install -g @carmopereira/wp-plugin-addons
```

Then run:
```bash
carmo-wp-plugin-addons
```

### Use with npx (no install)

```bash
npx @carmopereira/wp-plugin-addons
```

### Local installation in a project

```bash
npm install --save-dev @carmopereira/wp-plugin-addons
```

Then add to the project `package.json`:
```json
{
  "scripts": {
    "setup": "carmo-wp-plugin-addons"
  }
}
```

## 🧪 Test locally before publishing

### Using npm link

1. In this project directory:
```bash
npm link
```

2. In another project where you want to test:
```bash
npm link @carmopereira/wp-plugin-addons
```

3. Test:
```bash
npx @carmopereira/wp-plugin-addons
```

4. When finished, unlink:
```bash
npm unlink @carmopereira/wp-plugin-addons
```

## 📝 Checklist before publishing

- [ ] Version updated in `package.json`
- [ ] README.md updated and complete
- [ ] Code tested locally
- [ ] `.npmignore` configured correctly
- [ ] Unnecessary files excluded
- [ ] Logged in to npm (`npm whoami`)
- [ ] Git repository synced

## 🔍 Published package structure

When published, npm will include only:
- `setup.js` (main file)
- `setups/` (setup directory)
- `package.json` (metadata)

Excluded files (via `.npmignore`):
- `README.md` (npm shows the repository README)
- `.git/`
- Development files

## ⚠️ Common issues

### Error: "You do not have permission to publish"

- Make sure you are logged in: `npm whoami`
- Confirm the package name is correct
- If the package already exists, only the owner can publish updates

### Error: "Package name too similar to existing package"

- The name `@carmopereira/wp-plugin-addons` is already reserved for you
- If you want to change it, edit `package.json` before publishing

### Error: "You cannot publish over the previously published versions"

- The version already exists on npm
- Bump the version in `package.json`

## 📚 Additional resources

- [Official npm documentation](https://docs.npmjs.com/)
- [Publishing packages guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
