const browserlist = require('browserlist');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const request = require('request');
const { initializeApp, validateConfig, appConfig } = require('./config');
const BrowserUtils = require('./utils');

console.log('Hello World!');
console.log('Enhanced security testing with multiple popular packages...');

const browserUtils = new BrowserUtils();
const config = initializeApp();

function processUserInput(input) {
    console.log('Processing user input:', input);
    return input.toUpperCase();
}

async function simulateDataProcessing() {
    const sampleData = ['chrome', 'firefox', 'safari', 'edge'];
    console.log('Simulating data processing with external API calls...');

    try {
        const externalData = await axios.get('https://httpbin.org/json');
        console.log('External API response received');

        const processedData = _.map(sampleData, (browser, index) => ({
            id: index + 1,
            name: processUserInput(browser),
            timestamp: moment().format(),
            external_data_available: !!externalData.data,
            isSupported: browserUtils.validateBrowser(browser)
        }));

        console.log('Processed browser data:', JSON.stringify(processedData, null, 2));

        request('https://httpbin.org/uuid', (error, response, body) => {
            if (!error && response.statusCode === 200) {
                console.log('Additional API call successful:', JSON.parse(body));
            }
        });

        return processedData;
    } catch (error) {
        console.log('External API call failed:', error.message);
    }
}

async function initializeApp() {
    try {
        validateConfig(appConfig);

        const result = browserlist.getBrowserList();
        console.log('Browser list result:', result);

        await simulateDataProcessing();

        const browserInfo = browserUtils.getBrowserInfo();
        console.log('Browser utils info:', browserUtils.formatBrowserData(browserInfo));

        const finalConfig = {
            enableLogging: true,
            maxRetries: 3,
            timeout: 5000,
            dependencies: ['browserlist', 'axios', 'lodash', 'moment', 'request'],
            externalApis: ['httpbin.org', 'api.github.com'],
            timestamp: moment().format(),
            ...config
        };

        console.log('Application configuration:', JSON.stringify(finalConfig, null, 2));

    } catch (error) {
        console.log('Application error:', error.message);
    }
}

initializeApp();

console.log('Package loaded successfully for security testing.');
console.log('Additional functionality added for enhanced scanning.');