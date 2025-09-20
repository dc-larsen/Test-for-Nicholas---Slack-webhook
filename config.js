const browserlist = require('browserlist');

const appConfig = {
    name: 'Security Testing App',
    version: '1.1.0',
    environment: process.env.NODE_ENV || 'development',
    features: {
        browserDetection: true,
        logging: true,
        analytics: false
    },
    security: {
        enableCors: true,
        maxRequestSize: '10mb',
        timeout: 30000
    }
};

function initializeApp() {
    console.log(`Initializing ${appConfig.name} v${appConfig.version}`);

    if (appConfig.features.browserDetection) {
        try {
            const browsers = browserlist.getBrowserList();
            console.log('Browser detection enabled:', browsers ? 'Success' : 'Failed');
        } catch (error) {
            console.error('Browser detection failed:', error.message);
        }
    }

    return appConfig;
}

function validateConfig(config) {
    const required = ['name', 'version', 'environment'];
    const missing = required.filter(key => !config[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required config: ${missing.join(', ')}`);
    }

    return true;
}

module.exports = {
    appConfig,
    initializeApp,
    validateConfig
};