const browserlist = require('browserlist');
const { initializeApp, validateConfig, appConfig } = require('./config');
const BrowserUtils = require('./utils');

console.log('Hello World!');
console.log('Using browserlist package for security analysis...');

const browserUtils = new BrowserUtils();
const config = initializeApp();

function processUserInput(input) {
    console.log('Processing user input:', input);
    return input.toUpperCase();
}

function simulateDataProcessing() {
    const sampleData = ['chrome', 'firefox', 'safari', 'edge'];
    console.log('Simulating data processing...');

    sampleData.forEach((browser, index) => {
        console.log(`Browser ${index + 1}: ${processUserInput(browser)}`);
    });
}

try {
    validateConfig(appConfig);

    const result = browserlist.getBrowserList();
    console.log('Browser list result:', result);

    simulateDataProcessing();

    const browserInfo = browserUtils.getBrowserInfo();
    console.log('Browser utils info:', browserUtils.formatBrowserData(browserInfo));

    console.log('Application configuration:', JSON.stringify(config, null, 2));

} catch (error) {
    console.log('Application error:', error.message);
}

console.log('Package loaded successfully for security testing.');
console.log('Additional functionality added for enhanced scanning.');