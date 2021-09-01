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

router.post('/follow', async (req, res) => {
    const { username, pfp, followUser } = req.body;

    const exists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ username, pfp ]);

    if (exists.rows.length > 0) {
        const userExists = await db.query('SELECT * FROM users WHERE user_name = $1', [ followUser ]);

        if (userExists.rows.length > 0) {
            let user = userExists.rows[0];

            if (user.followers) {
                user.followers.unshift({ user: username, pfp });
            } else {
                user.followers = [ { user: username, pfp } ];
            }

            const followers = await db.query(`UPDATE users SET followers = '${JSON.stringify(user.followers)}' WHERE user_name = $1 AND user_id = $2 RETURNING followers`, [ followUser, userExists.rows[0].user_id ]);
            res.status(200).json({ followers: followers.rows[0].followers });
        } else res.status(404).json({ message: "User not found" });
    } else res.status(404).json({ message: "User not found" });
});

router.post('/unfollow', async (req, res) => {
    const { username, pfp, followUser } = req.body;

    const exists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ username, pfp ]);

    if (exists.rows.length > 0) {
        const userExists = await db.query('SELECT * FROM users WHERE user_name = $1', [ followUser ]);

        if (userExists.rows.length > 0) {
            let user = userExists.rows[0];

            user.followers.forEach((follower, i) => follower.user === username && user.followers.splice(i, 1));

            const followers = await db.query(`UPDATE users SET followers = '${JSON.stringify(user.followers)}' WHERE user_name = $1 AND user_id = $2 RETURNING followers`, [ followUser, userExists.rows[0].user_id ]);
            res.status(200).json({ followers: followers.rows[0].followers });
        } else res.status(404).json({ message: "User not found" });
    } else res.status(404).json({ message: "User not found" });
});

module.exports = router;