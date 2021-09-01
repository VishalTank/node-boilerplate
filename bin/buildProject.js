/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const util = require('util');

// Validate arguments
if (process.argv.length < 3) {
    console.log('Please enter the project directory name.');
    console.log('Something like:');
    console.log('    npx create-nodejs-app my-app');
    console.log('    OR');
    console.log('    npm init nodejs-app my-app');
    process.exit(1);
}

// Check if project directory is already present
const projectDirName = process.argv[2];
const projectPath = path.join(process.cwd(), projectDirName);

try {
    fs.mkdirSync(projectPath);
} catch (err) {
    if (err.code === 'EEXIST') {
        console.log('Directory already exists. Please choose another name for the project.');
    } else {
        console.log(err);
    }
    process.exit(1);
}

// Initialize project setup
const repoURL = 'https://github.com/VishalTank/node-boilerplate';
const exec = util.promisify(childProcess.exec);

async function executeCommand(command) {
    try {
        const { stdout, stderr } = await exec(command);
        console.log(stdout);
        console.log(stderr);
    }
    catch (err) {
        console.log(err);
    }
}

async function init() {
    try {
        // Clone the repository
        console.log(`Cloning repo: ${repoURL}`);
        await executeCommand(`git clone ${repoURL} ${projectDirName}`);
        console.log('Cloned successfully.\n');

        // Change directory
        process.chdir(projectPath);

        // Install dependencies
        console.log('Installing dependencies...');
        await executeCommand(`npm install`);
        console.log('Dependencies installed successfully.\n');

        // Delete .git folder
        fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });

        // Delete binaries
        fs.rmSync(path.join(projectPath, 'bin'), { recursive: true, force: true });

        console.log('Installation complete!\n');
        console.log('Check README.md to get started with the project.');
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

init();
