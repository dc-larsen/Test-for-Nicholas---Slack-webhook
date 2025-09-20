require('dotenv').config();
const browserlist = require('browserlist');
const chalk = require('chalk');
const { v4: uuidv4 } = require('uuid');
const SecurityManager = require('./security');

console.log(chalk.green.bold('Hello World!'));
console.log(chalk.cyan('Enhanced security testing application with comprehensive dependencies...'));

const securityManager = new SecurityManager();

function processUserInput(input) {
    console.log('Processing user input:', input);
    return input.toUpperCase();
}

async function simulateDataProcessing() {
    const sampleData = ['chrome', 'firefox', 'safari', 'edge'];
    console.log(chalk.yellow('Simulating enhanced data processing with security validation...'));

    const sessionId = uuidv4();
    console.log(chalk.magenta(`Session ID: ${sessionId}`));

    for (const browser of sampleData) {
        const isValid = securityManager.validateInput(browser, 'alphanumeric');
        if (isValid) {
            console.log(chalk.green(`✓ ${processUserInput(browser)} - valid input`));
        } else {
            console.log(chalk.red(`✗ ${processUserInput(browser)} - invalid input`));
        }
    }

    await securityManager.logSecurityEvent('DATA_PROCESSING', null, {
        sessionId,
        itemsProcessed: sampleData.length,
        timestamp: new Date().toISOString()
    });
}

async function initializeSecureApp() {
    try {
        console.log(chalk.blue('Initializing secure application...'));

        const result = browserlist.getBrowserList();
        console.log(chalk.cyan('Browser list result:', result));

        await simulateDataProcessing();

        const testUser = await securityManager.createUser('security@test.com', 'SecurePass123!');
        console.log(chalk.green('Demo user created for security testing'));

        const auth = await securityManager.authenticateUser('security@test.com', 'SecurePass123!');
        console.log(chalk.green('User authenticated successfully'));

        const config = {
            enableLogging: true,
            maxRetries: 3,
            timeout: 5000,
            security: {
                jwtEnabled: true,
                passwordHashing: true,
                inputValidation: true,
                sessionManagement: true
            },
            environment: process.env.NODE_ENV || 'development'
        };

        console.log(chalk.blue('Secure application configuration:'), JSON.stringify(config, null, 2));

    } catch (error) {
        console.log(chalk.red('Application error:', error.message));
    }
}

initializeSecureApp();

console.log('Package loaded successfully for security testing.');
console.log('Additional functionality added for enhanced scanning.');