const express = require('express');

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/welcome', (req, res) => res.send('Welcome to the dev connector!'));

app.listen(PORT, () => console.log(`App started on port: ${PORT}`));
