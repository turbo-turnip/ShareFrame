const Router = require('express').Router;
const { pool: db } = require('../database');

require('dotenv').config();
const router = new Router();

router.post('/getUser', async (req, res) => {
    const { username } = req.body;

    const exists = await db.query('SELECT * FROM users WHERE user_name = $1', [ username ]);

    if (exists.rows.length > 0) {
        res.status(200).json({ user: exists.rows[0] });
    } else res.status(404).json({ message: "User not found" });
});

router.post('/getProjects', async (req, res) => {
    const { username } = req.body;

    const exists = await db.query('SELECT * FROM users WHERE user_name = $1', [ username ]);

    if (exists.rows.length > 0) {
        const projects = await db.query('SELECT * FROM projects');
        let contributing = [];

        projects.rows.forEach(project =>
            project.members.forEach(member => member.user_name === username && contributing.push(project)));
        
        res.status(200).json({ contributing });
    } else res.status(404).json({ message: "User not found" });
});

module.exports = router;