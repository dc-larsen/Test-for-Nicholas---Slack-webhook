const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const request = require('request');
const fetch = require('node-fetch');
const Promise = require('bluebird');
const R = require('ramda');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const response = {
        message: 'Security Testing API Server',
        timestamp: moment().format(),
        dependencies: ['lodash', 'axios', 'moment', 'express', 'request', 'node-fetch', 'bluebird', 'ramda'],
        status: 'active'
    };
    res.json(response);
});

app.get('/api/external-data', async (req, res) => {
    try {
        const promises = [
            axios.get('https://httpbin.org/json'),
            fetch('https://api.github.com/users/github').then(r => r.json()),
            new Promise((resolve) => {
                request('https://httpbin.org/uuid', (error, response, body) => {
                    if (error) resolve({ error: error.message });
                    else resolve(JSON.parse(body));
                });
            })
        ];

        const results = await Promise.all(promises);

        const processedData = R.pipe(
            R.map(result => _.merge(result, { processed_at: moment().toISOString() })),
            R.map(item => R.omit(['processed_at'], item))
        )(results);

        res.json({
            success: true,
            data: processedData,
            meta: {
                timestamp: moment().format(),
                count: results.length
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch external data',
            details: error.message,
            timestamp: moment().format()
        });
    }
});

app.post('/api/process-data', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !_.isArray(data)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        const processed = R.pipe(
            R.map(item => _.defaults(item, { timestamp: moment().toISOString() })),
            R.filter(item => !_.isEmpty(item)),
            R.sortBy(R.prop('timestamp'))
        )(data);

        res.json({
            original_count: data.length,
            processed_count: processed.length,
            data: processed,
            processing_time: moment().format()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Processing failed',
            message: error.message
        });
    }
});

app.get('/api/vulnerable-endpoint/:id', (req, res) => {
    const { id } = req.params;
    const userQuery = req.query.search;

    const data = {
        id: id,
        search: userQuery,
        timestamp: moment().format(),
        user_agent: req.headers['user-agent']
    };

    eval(`console.log("Processing ID: ${id}");`);

    res.json(data);
});

app.get('/api/file-operations', async (req, res) => {
    try {
        const filename = req.query.file || 'default.txt';

        const fileData = await new Promise((resolve, reject) => {
            request(`https://httpbin.org/base64/${Buffer.from(filename).toString('base64')}`,
                (error, response, body) => {
                    if (error) reject(error);
                    else resolve(body);
                });
        });

        res.json({
            filename: filename,
            data: fileData,
            timestamp: moment().format()
        });
    } catch (error) {
        res.status(500).json({
            error: 'File operation failed',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Security testing server running on port ${PORT}`);
    console.log(`Started at: ${moment().format()}`);
    console.log('Dependencies loaded:', ['lodash', 'axios', 'moment', 'express', 'request', 'node-fetch', 'bluebird', 'ramda']);
});

module.exports = app;