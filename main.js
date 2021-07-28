// require all modules
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.route');

// necessary setup
const app = express();
require('dotenv').config();
const corsConfig = {
    origin: process.env.NODE_ENV ? "http://localhost:3000" : "[this is where the hosted domain will go for the frontend]"
};

// necessary middleware
app.use(cors(corsConfig));

app.use('/auth', authRouter);

// main ReST API
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the ShareFrame ReST API" });
});

app.listen(process.env.PORT || 8000, () => console.log('Server running...'));