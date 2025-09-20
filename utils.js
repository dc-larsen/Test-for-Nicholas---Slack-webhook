// const browserlist = require('browserlist'); // Temporarily removed

class BrowserUtils {
    constructor() {
        this.supportedBrowsers = ['chrome', 'firefox', 'safari', 'edge'];
    }

    validateBrowser(browserName) {
        return this.supportedBrowsers.includes(browserName.toLowerCase());
    }

    getBrowserInfo() {
        console.log('Browser info temporarily unavailable - browserlist removed');
        return { message: 'browserlist package temporarily removed' };
    }

    formatBrowserData(data) {
        if (!data) return 'No data available';
        return JSON.stringify(data, null, 2);
    }
}

module.exports = BrowserUtils;