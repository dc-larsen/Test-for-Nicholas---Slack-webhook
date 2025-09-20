const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const browserlist = require('browserlist');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    res.json({
        message: 'Hello World Server',
        timestamp: timestamp,
        dependencies: ['browserlist', 'lodash', 'axios', 'moment', 'express']
    });
});

app.get('/api/browsers', async (req, res) => {
    try {
        const browsers = browserlist.getBrowserList();
        const processedData = _.map(browsers, (browser, index) => ({
            id: index + 1,
            name: browser,
            timestamp: moment().toISOString()
        }));

        res.json({
            success: true,
            data: processedData,
            count: _.size(processedData)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: moment().toISOString()
        });
    }
});

app.get('/api/external', async (req, res) => {
    try {
        const response = await axios.get('https://httpbin.org/json');
        const enrichedData = _.merge(response.data, {
            processed_at: moment().toISOString(),
            server_info: 'Security testing server'
        });

        res.json(enrichedData);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch external data',
            details: error.message
        });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Started at: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
    });
}

module.exports = app;