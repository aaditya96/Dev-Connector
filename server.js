const express = require('express');
const connectDB = require('./db/connection');

const PORT = process.env.PORT || 5000;

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.get('/welcome', (req, res) => res.send('Welcome to the dev connector!'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

app.listen(PORT, () => console.log(`App started on port: ${PORT}`));
