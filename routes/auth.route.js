const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateInputs: validate, pool: db } = require('../database');

require('dotenv').config();
// initialize auth router
const router = new Router();

// Auth Router ReST API
router.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the ShareFrame Auth ReST API" });
});

router.post('/validateToken', async (req, res) => {
    const { token } = req.body;

    try {
        const valid = await jwt.verify(token, process.env.AT_SECRET);
        if (!valid) throw 'Invalid Access Token';

        if (valid.hasOwnProperty('username') && valid.hasOwnProperty('email') && valid.hasOwnProperty('password')) {
            if (validate([ valid['username'], valid['email'], valid['password'] ])) {
                const rows = await db.query('SELECT * FROM users WHERE user_name = $1 AND user_email = $2', [ valid['username'], valid['email'] ]);

                if (rows.rows.length > 0) {
                    const validPass = await bcrypt.compare(valid['password'], rows.rows[0].user_pass);

                    if (validPass) res.status(200).json({ account: rows.rows[0] });
                    else res.status(403).json({ message: "Invalid password" });
                } else throw 'Invalid Access Token';
            } else throw 'Invalid Fields';
        } else throw 'Invalid Access Token';
    } catch (err) {
        res.status(400).json({ message: "Invalid request", err });
    }
});

module.exports = router;