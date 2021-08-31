const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateInputs: validate, pool: db } = require('../database');
const { email: emailer } = require('../email');

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

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!validate([ username, email, password ])) {
        res.status(400).json({ status: "Invalid fields" });
        return;
    }

    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 OR user_email = $2', [ username, email ]);
    if (!userExists.rows.length > 0) {
        try {
            const hashed = await bcrypt.hash(password, 10);
            const emailValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
            if (!emailValid) {
                res.status(406).json({ message: "Invalid email" });
                return;
            }

            await db.query('INSERT INTO users (user_name, user_email, user_pass, pfp, verified) VALUES ($1, $2, $3, $4, $5)', [
                username,
                email,
                hashed,
                '/media/pfp-default.svg',
                'FALSE'
            ]);

            res.status(201).json({ message: "Successfully registered " + username });
        } catch (err) {
            res.status(500).json({ err });
        }
    } else res.status(409).json({ message: "User already exists" });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!validate([ username, password ])) {
        res.status(400).json({ status: "Invalid fields" });
        return;
    }

    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1', [ username ]);
    if (userExists.rows.length > 0) {
        try {
            const passCorrect = await bcrypt.compare(password, userExists.rows[0].user_pass);

            if (passCorrect) {
                const at = jwt.sign({
                    username, email: userExists.rows[0].user_email, password
                }, process.env.AT_SECRET, { expiresIn: 60 * 15 });
                const rt = jwt.sign({
                    id: userExists.rows[0].user_id, password
                }, process.env.RT_SECRET, { expiresIn: 60 * 60 * 24 * 30 });

                res.status(200).json({ message: "Successfully logged in " + username, at, rt });
            } else res.status(403).json({ message: "Invalid password" });
        } catch (err) {
            res.status(500).json({ err });
        }
    } else res.status(409).json({ message: "Invalid username" });
});

router.post('/verificationEmail', (req, res) => {
    const { username, email } = req.body;

    const verifyPath = 
        "http://localhost:3000/verify/" 
        + new Buffer.from(username, 'utf8').toString('hex') 
        + "/" 
        + new Buffer.from(email, 'utf8').toString('hex');

    emailer({
        from: process.env.BOT_EMAIL,
        to: email,
        subject: 'Verify your ShareFrame email',
        html: `
            <h1>Hi ${username},</h1>
            <h3>To get the full potential of your ShareFrame account, you have to verify your email! (${email})</h3>
            <a href="${verifyPath}">
                <img width="500px" src="cid:verification-image@shareframe.backend" alt="Verify your email!" />
            </a>
        `,
        attachments: [{
            filename: 'verify.png',
            path: __dirname + '/verify.png',
            cid: 'verification-image@shareframe.backend'
        }]
    })
        .then(res => {
            console.log(res);
        });

    res.status(200).json({});
});

router.post('/verify', async (req, res) => {
    const { encryptedUsername, encryptedEmail, password } = req.body;

    const [ username, email ] = 
        [ encryptedUsername, encryptedEmail ].map((value) => new Buffer.from(value, 'hex').toString('utf8'));

    if (validate([ username, email ])) {
        const rows = await db.query('SELECT * FROM users WHERE user_name = $1 AND user_email = $2 AND verified = $3', [ username, email, 'FALSE' ]);

        if (rows.rows.length > 0) {
            const at = await jwt.sign({
                username: rows.rows[0].user_name,
                email: rows.rows[0].user_email,
                password
            }, process.env.AT_SECRET, { expiresIn: 60 * 15 });
            const rt = await jwt.sign({
                id: rows.rows[0].user_id,
                password
            }, process.env.RT_SECRET, { expiresIn: 60 * 60 * 24 * 30 });

            await db.query('UPDATE users SET verified = $1 WHERE user_name = $2 AND user_email = $3', [ 'TRUE', username, email ]);
            res.status(200).json({ at, rt });
        } else res.status(400).json({ message: "User doesn't exist" });
    } else res.status(400).json({ message: "Invalid fields" });
});

module.exports = router;