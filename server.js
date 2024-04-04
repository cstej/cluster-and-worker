const express  = require('express');

function delay(ms) {
    var start = Date.now();
    while (Date.now() - start < ms) {}
}
const app = express();
app.get('/', async (req, res) => {
    await delay(4000);
    res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});