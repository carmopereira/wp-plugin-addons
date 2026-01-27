#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(query) {
	return new Promise((resolve) => rl.question(query, resolve));
}

// Get npm package directory (where this file lives)
const packageDir = __dirname;
const setupsDir = path.join(packageDir, 'setups');

// List available setups
function getAvailableSetups() {
	if (!fs.existsSync(setupsDir)) {
		return [];
	}
	return fs
		.readdirSync(setupsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);
}

// Get current project directory (where setup will be applied)
const projectDir = process.cwd();
const projectPackageJson = path.join(projectDir, 'package.json');

// Check if we are in a valid project
if (!fs.existsSync(projectPackageJson)) {
	console.error('❌ package.json not found!');
	console.error('   Make sure you are in the project directory.');
	process.exit(1);
}

// Read project package.json
let projectPackage;
try {
	projectPackage = JSON.parse(fs.readFileSync(projectPackageJson, 'utf8'));
} catch (error) {
	console.error('❌ Error reading package.json:', error.message);
	process.exit(1);
}

const pluginName = projectPackage.name;

async function main() {
	console.log('\n🚀 Carmo WP Plugin Addons\n');
	console.log(`Plugin: ${pluginName}`);
	console.log(`Directory: ${projectDir}\n`);

	// Get setup to apply
	const availableSetups = getAvailableSetups();
	if (availableSetups.length === 0) {
		console.error('❌ No setup found in setups/');
		process.exit(1);
	}

	let setupName = process.argv[2];

	// If no argument was provided, ask interactively
	if (!setupName || !availableSetups.includes(setupName)) {
		if (availableSetups.length === 1) {
			setupName = availableSetups[0];
			console.log(`📦 Using setup: ${setupName}\n`);
		} else {
			console.log('Available setups:');
			availableSetups.forEach((setup, index) => {
				console.log(`  ${index + 1}. ${setup}`);
			});
			const answer = await question('\nChoose a setup (number or name): ');
			const num = parseInt(answer, 10);
			if (!isNaN(num) && num > 0 && num <= availableSetups.length) {
				setupName = availableSetups[num - 1];
			} else if (availableSetups.includes(answer.trim())) {
				setupName = answer.trim();
			} else {
				console.error('❌ Invalid setup!');
				rl.close();
				process.exit(1);
			}
		}
	}

	const setupDir = path.join(setupsDir, setupName);
	if (!fs.existsSync(setupDir)) {
		console.error(`❌ Setup "${setupName}" not found!`);
		rl.close();
		process.exit(1);
	}

	console.log(`📦 Applying setup: ${setupName}\n`);

	// 1. Add scripts to package.json
	const packageScriptsPath = path.join(setupDir, 'package-scripts.json');
	if (fs.existsSync(packageScriptsPath)) {
		const packageScripts = JSON.parse(
			fs.readFileSync(packageScriptsPath, 'utf8')
		);
		if (!projectPackage.scripts) {
			projectPackage.scripts = {};
		}
		Object.assign(projectPackage.scripts, packageScripts);
		fs.writeFileSync(
			projectPackageJson,
			JSON.stringify(projectPackage, null, '\t') + '\n',
			'utf8'
		);
		console.log('✅ Scripts added to package.json');
	}

	// 2. Copy scripts
	const setupScriptsDir = path.join(setupDir, 'setup');
	const projectScriptsDir = path.join(projectDir, 'scripts');

	if (fs.existsSync(setupScriptsDir)) {
		// Create scripts folder if it does not exist
		if (!fs.existsSync(projectScriptsDir)) {
			fs.mkdirSync(projectScriptsDir, { recursive: true });
		}

		const scripts = fs.readdirSync(setupScriptsDir);
		for (const script of scripts) {
			const srcPath = path.join(setupScriptsDir, script);
			const destPath = path.join(projectScriptsDir, script);
			fs.copyFileSync(srcPath, destPath);
			// Make executable if it is .js
			if (script.endsWith('.js')) {
				fs.chmodSync(destPath, '755');
			}
			console.log(`✅ Script copied: ${script}`);
		}
	}

	// 3. Update .gitignore
	const setupGitignorePath = path.join(setupDir, '.gitignore');
	const projectGitignorePath = path.join(projectDir, '.gitignore');

	if (fs.existsSync(setupGitignorePath)) {
		const setupGitignore = fs.readFileSync(setupGitignorePath, 'utf8');
		let projectGitignore = '';

		if (fs.existsSync(projectGitignorePath)) {
			projectGitignore = fs.readFileSync(projectGitignorePath, 'utf8');
		}

		// Add setup entries that do not exist in the project
		const setupLines = setupGitignore
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line && !line.startsWith('#'));

		const projectLines = projectGitignore.split('\n').map((line) => line.trim());

		let added = false;
		for (const line of setupLines) {
			if (!projectLines.includes(line)) {
				if (!added) {
					projectGitignore += '\n# Added by @carmopereira/wp-plugin-addons\n';
					added = true;
				}
				projectGitignore += line + '\n';
			}
		}

		if (added) {
			fs.writeFileSync(projectGitignorePath, projectGitignore, 'utf8');
			console.log('✅ .gitignore updated');
		}
	}

	console.log('\n✅ Setup applied successfully!\n');
	console.log('Next steps:');
	console.log('  - Run "npm install" if needed');
	console.log('  - Use "npm run symlink" to create the plugin symlink');
	console.log('  - Use "npm run updateGIT" to commit/push\n');

	rl.close();
}

main().catch((error) => {
	console.error('\n❌ Error:', error.message);
	rl.close();
	process.exit(1);
});
