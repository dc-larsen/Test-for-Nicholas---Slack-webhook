const browserlist = require('browserlist');

console.log('Hello World!');
console.log('Using browserlist package for security analysis...');

try {
    const result = browserlist.getBrowserList();
    console.log('Browser list result:', result);
} catch (error) {
    console.log('Browserlist error:', error.message);
}

console.log('Package loaded successfully for security testing.');