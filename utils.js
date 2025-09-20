const browserlist = require('browserlist');

class BrowserUtils {
    constructor() {
        this.supportedBrowsers = ['chrome', 'firefox', 'safari', 'edge'];
    }

    validateBrowser(browserName) {
        return this.supportedBrowsers.includes(browserName.toLowerCase());
    }

    getBrowserInfo() {
        try {
            return browserlist.getBrowserList();
        } catch (error) {
            console.error('Failed to get browser info:', error);
            return null;
        }
    }

    formatBrowserData(data) {
        if (!data) return 'No data available';
        return JSON.stringify(data, null, 2);
    }
}

module.exports = BrowserUtils;