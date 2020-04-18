/* eslint-disable */
const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('dist'));

app.all('*', (req, res) => {
    return fs.readFileSync('./dist/index.html', 'utf-8');
});

app.listen(9000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:9000');
});
