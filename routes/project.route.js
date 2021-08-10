const Router = require('express').Router;
const { validateInputs: validate, pool: db } = require('../database');

require('dotenv').config();
const router = new Router();

router.post('/createProject', async (req, res) => {
    const { title, desc, shortDesc, username, pfp, github, allFeedback, allReviews, allThreads } = req.body;
    const { repoRepo = "", repoUsername = "" } = github;

    if (validate([ title, desc, shortDesc, username, pfp, github.repo, github.username, allFeedback, allReviews, allThreads ])) {
        const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ title, username ]);

        if (exists.rows.length > 0)
            res.status(409).json({ message: "Project already exists. Use a different name" });
        else {
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
                threads
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`, [
                title,
                desc,
                shortDesc,
                (repoRepo == "" || repoUsername == "") ? 'FALSE' : 'TRUE',
                username,
                pfp,
                repoUsername,
                repoRepo,
                allFeedback,
                allReviews,
                allThreads,
                '[]',
                '[]',
                '[]'
            ]);
            res.status(201).json({ message: "Successfully created project" });
        }
    } else res.status(400).json({ message: "Invalid Fields" });
});

module.exports = router;