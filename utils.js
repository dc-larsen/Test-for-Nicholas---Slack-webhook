const browserlist = require('browserlist'); // Restored for enhanced functionality

class BrowserUtils {
    constructor() {
        this.supportedBrowsers = ['chrome', 'firefox', 'safari', 'edge'];
    }

    validateBrowser(browserName) {
        return this.supportedBrowsers.includes(browserName.toLowerCase());
    }

    getBrowserInfo() {
        try {
            const result = browserlist.getBrowserList();
            console.log('Browser info successfully restored via browserlist');
            return result;
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