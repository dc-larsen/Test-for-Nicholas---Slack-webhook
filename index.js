require('dotenv').config();
const browserlist = require('browserlist');
const chalk = require('chalk');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const fs = require('fs-extra');
const AuthService = require('./auth');

console.log(chalk.green.bold('Hello World!'));
console.log(chalk.cyan('Enhanced security testing application with multiple dependencies...'));

const authService = new AuthService();

function processUserInput(input) {
    console.log('Processing user input:', input);
    return input.toUpperCase();
}

async function simulateDataProcessing() {
    const sampleData = ['chrome', 'firefox', 'safari', 'edge'];
    console.log(chalk.yellow('Simulating enhanced data processing...'));

    const sessionId = uuidv4();
    console.log(chalk.magenta(`Session ID: ${sessionId}`));

    for (let i = 0; i < sampleData.length; i++) {
        const browser = sampleData[i];
        const processedName = processUserInput(browser);

        if (validator.isAlpha(browser)) {
            console.log(chalk.green(`✓ Browser ${i + 1}: ${processedName} (valid)`));
        } else {
            console.log(chalk.red(`✗ Browser ${i + 1}: ${processedName} (invalid)`));
        }
    }

    const logData = {
        sessionId,
        timestamp: new Date().toISOString(),
        browsers: sampleData,
        processed: true
    };

    try {
        await fs.writeJson('./logs/session.json', logData, { spaces: 2 });
        console.log(chalk.blue('Session data logged successfully'));
    } catch (error) {
        console.log(chalk.red('Failed to write session log:', error.message));
    }
}

async function initializeApp() {
    try {
        await fs.ensureDir('./logs');

        const result = browserlist.getBrowserList();
        console.log(chalk.cyan('Browser list result (restored):', result));

        await simulateDataProcessing();

        const testUser = await authService.createUser('test@example.com', 'password123');
        const token = authService.generateToken(testUser.id);
        console.log(chalk.green('Demo user created and token generated'));

        const config = {
            enableLogging: true,
            maxRetries: 3,
            timeout: 5000,
            browserDetection: true,
            authentication: true,
            securityLevel: process.env.SECURITY_LEVEL || 'medium'
        };

        console.log(chalk.blue('Application configuration:'), JSON.stringify(config, null, 2));

    } catch (error) {
        console.log(chalk.red('Application error:', error.message));
    }
}

initializeApp();

console.log('Package loaded successfully for security testing.');
console.log('Additional functionality added for enhanced scanning.');