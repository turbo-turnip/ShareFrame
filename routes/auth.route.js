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

router.post('/refresh', async (req, res) => {
    const { token } = req.body;

    const exists = await db.query('SELECT * FROM rt_banishlist WHERE rt = $1', [ token ]);
    if (exists.rows.length > 0) {
        res.status(403).json({ message: "Invalid Refresh Token" });
        return;
    }

    try {
        const valid = await jwt.verify(token, process.env.RT_SECRET);
        if (!valid) throw 'Invalid Refresh Token';

        if (valid.hasOwnProperty('id') && valid.hasOwnProperty('password')) {
            if (validate([ valid['id'], valid['password'] ])) {
                const rows = await db.query('SELECT * FROM users WHERE user_id = $1', [ valid['id'] ]);

                if (rows.rows.length > 0) {
                    const validPass = await bcrypt.compare(valid['password'], rows.rows[0].user_pass);

                    if (validPass) {
                        const at = await jwt.sign({ username: rows.rows[0].user_name, email: rows.rows[0].user_email, password: valid['password'] }, process.env.AT_SECRET, { expiresIn: 60 * 15 });
                        const rt = await jwt.sign({ id: valid['id'], password: valid['password'] }, process.env.RT_SECRET, { expiresIn: 60 * 60 * 24 * 30 });
                        await db.query('INSERT INTO rt_banishlist (rt) VALUES ($1)', [ token ]);

                        res.status(200).json({ at, rt, account: rows.rows[0] });
                    } else res.status(403).json({ message: "Invalid Password" });
                } else throw 'Invalid Refresh Token';
            } else throw 'Invalid Fields';
        } else throw 'Invalid Refresh Token';
    } catch (err) {
        res.status(400).json({ message: "Invalid request", err });
    }
});

module.exports = router;