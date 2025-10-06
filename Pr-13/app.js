const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('form', { error: null, values: { income1: '', income2: '' }, total: null });
});

app.post('/calculate', (req, res) => {
    const { income1, income2 } = req.body;
    let error = null;
    let total = null;

    // Validation
    if (!income1 || !income2 || isNaN(income1) || isNaN(income2) || Number(income1) < 0 || Number(income2) < 0) {
        error = 'Please enter valid non-negative numbers for both income sources.';
    } else {
        total = Number(income1) + Number(income2);
    }

    res.render('form', { error, values: { income1, income2 }, total });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});