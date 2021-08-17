const Router = require('express').Router;
// validateInputs just sanitizes an array of strings and returns false if SQLi or XSS is detected
const { validateInputs: validate, pool: db } = require('../database');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const router = new Router();

router.post('/createProject', async (req, res) => {
    const { title, desc, shortDesc, username, pfp, github, allFeedback, allReviews, allThreads, password } = req.body;

    if (validate([ title, desc, shortDesc, username, pfp, github.repo, github.username, allFeedback, allReviews, allThreads ])) {
        const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ title, username ]);
        const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ username, pfp ]);

        if (exists.rows.length > 0)
            res.status(409).json({ message: "Project already exists. Use a different name" });
        else if (userExists.rows.length < 1)
            res.status(403).json({ message: "Invalid user" });
        else {
            const user = userExists.rows[0];
            const passwordCorrect = await bcrypt.compare(password, user.user_pass);

            if (passwordCorrect) {
                await db.query(`INSERT INTO projects (
                    project_title,
                    project_desc,
                    project_desc_short,
                    version_control,
                    user_name,
                    user_pfp,
                    repo_username,
                    repo_title,
                    allow_feedback,
                    allow_reviews,
                    allow_threads,
                    feedback,
                    reviews,
                    threads,
                    supporters,
                    members,
                    user_pass,
                    announcements
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`, [
                    title,
                    desc,
                    shortDesc,
                    (github.repo == "" || github.username == "") ? 'FALSE' : 'TRUE',
                    username,
                    pfp,
                    github.username,
                    github.repo,
                    allFeedback,
                    allReviews,
                    allThreads,
                    '[]',
                    '[]',
                    '[]',
                    '[]',
                    `[{"user_name":"${username}","pfp":"${pfp}"}]`,
                    user.user_pass,
                    '[]'
                ]);
                res.status(201).json({ message: "Successfully created project" });
            } else res.status(403).json({ message: "Invalid password" });
        }
    } else res.status(400).json({ message: "Invalid Fields" });
});

router.post('/getProject', async (req, res) => {
    const { user, name } = req.body;

    if (validate([ user, name ])) {
        const exists = await db.query("SELECT * FROM projects WHERE project_title = $1 AND user_name = $2", [ name, user ]);

        if (exists.rows.length > 0) {
            res.status(200).json({ project: exists.rows[0] });
        } else res.status(404).json({ message: "Project not found" });
    } else res.status(400).json({ message: "Invalid fields" });
});

router.post('/createAnnouncement', async (req, res) => {
    const { user, name, version, type, title, content, pfp, allowThreads } = req.body;

    const exists = await db.query('SELECT * FROM projects WHERE project_title = $1', [ name ]);
    let object = {};

    if (exists.rows.length > 0) {
        exists.rows.forEach(project => {
            let found = false;
            project.members.forEach(member => member.user_name === user && member.pfp === pfp ? found = true : null);
            if (found) 
                object = project;
        });

        if (object === {})
            res.status(404).json({ message: "Project not found" });
        else {
            const validVersion = /([0-9])*\.([0-9])*(\.([0-9])*)?/gmi.test(version);

            if (validVersion) {
                object.announcements.push({
                    pfp, user_name: user, version, title, type, desc: content, allow_threads: allowThreads
                });

                await db.query(`UPDATE projects SET announcements = '${JSON.stringify(object.announcements)}' WHERE project_title = $1 AND user_name = $2`, [
                    object.project_title, object.user_name
                ]);

                res.status(201).json({ message: "Successfully created announcement" });
            } else res.status(406).json({ message: "Invalid version number" });
        }
    } else res.status(404).json({ message: "Project not found" });
});

module.exports = router;