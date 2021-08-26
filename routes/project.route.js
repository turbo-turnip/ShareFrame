const Router = require('express').Router;
const { validateInputs: validate, pool: db } = require('../database');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const router = new Router();

router.post('/createProject', async (req, res) => {
    const { title, desc, shortDesc, username, pfp, github, allFeedback, allReviews, allThreads, password } = req.body;

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
                object.announcements.unshift({
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

router.post('/deleteAnnouncement', async (req, res) => {
    const { user, announcementName, title, projectCreator, announcementContent, password } = req.body;

    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1', [ user ]);

    if (userExists.rows.length > 0) {
        const validPass = await bcrypt.compare(password, userExists.rows[0].user_pass);

        if (validPass) {
            const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ title, projectCreator ]);
            let object = {};

            if (exists.rows.length > 0) {
                exists.rows.forEach(project => {
                    let found = false;
                    project.members.forEach(member => member.user_name === user ? found = true : null);
                    if (found) 
                        object = project;
                });

                if (object === {})
                    res.status(404).json({ message: "Project not found" });
                else {
                    let index = -1;
                    object.announcements.forEach((announcement, i) => {
                        if (announcement.title === announcementName && announcement.desc === announcementContent) {
                            index = i;
                        }
                    });

                    if (index > -1) {
                        object.announcements.splice(index, 1);

                        await db.query('UPDATE projects SET announcements = $1 WHERE project_title = $2 AND user_name = $3', [ JSON.stringify(object.announcements), title, projectCreator ]);

                        res.status(200).json({ message: "Successfully deleted announcement" });
                    } else res.status(404).json({ message: "Announcement not found" });
                }
            } else res.status(404).json({ message: "Project not found" });
        } else res.status(403).json({ message: "Invalid password" });
    } else res.status(403).json({ message: "Invalid user" });
});

router.post('/createComment', async (req, res) => {
    const { comment, user, pfp, announcementName, title, projectCreator, announcementContent } = req.body;

    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ user, pfp ]);

    if (userExists.rows.length > 0) {
        const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ title, projectCreator ]);

        if (exists.rows.length > 0) {
            const project = exists.rows[0];

            let index = -1;
            project.announcements.forEach((announcement, i) => {
                if (announcement.title === announcementName && announcement.desc === announcementContent) {
                    index = i;
                }
            });

            if (index > -1) {
                if (comment !== "") {
                    const newComment = {
                        comment, user, pfp
                    };

                    if (!project.announcements[index].comments)
                        project.announcements[index].comments = [ newComment ];
                    else 
                        project.announcements[index].comments.unshift(newComment);

                    await db.query(`UPDATE projects SET announcements = '${JSON.stringify(project.announcements)}' WHERE project_title = $1 AND user_name = $2`, [ title, projectCreator ]);

                    res.status(201).json({ message: "Successfully created comment" });
                } else res.status(406).json({ message: "Comment must have content" });
            } else res.status(404).json({ message: "Announcement not found" });
        } else res.status(404).json({ message: "Project not found" });
    } else res.status(403).json({ message: "Invalid user" });
});

router.post('/upvoteComment', async (req, res) => {
    const { comment, commentCreator, user, pfp, commentUserPfp, announcementName, title, projectCreator, announcementContent } = req.body;

    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ user, pfp ]);

    if (userExists.rows.length > 0) {
        const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ title, projectCreator ]);

        if (exists.rows.length > 0) {
            const project = exists.rows[0];

            let announcementIndex = -1;
            project.announcements.forEach((announcement, i) => {
                if (announcement.title === announcementName && announcement.desc === announcementContent) {
                    announcementIndex = i;
                }
            });

            if (announcementIndex > -1) {
                let commentIndex = -1;
                project.announcements[announcementIndex].comments.forEach((userComment, i) => {
                    if (userComment.comment === comment && userComment.user === commentCreator && userComment.pfp === commentUserPfp) {
                        commentIndex = i;
                    }
                });

                if (commentIndex > -1) {
                    if (!project.announcements[announcementIndex].comments[commentIndex].upvotes) {
                        project.announcements[announcementIndex].comments[commentIndex].upvotes = [ { user, pfp } ];

                        await db.query(`UPDATE projects SET announcements = '${JSON.stringify(project.announcements)}' WHERE project_title = $1 AND user_name = $2`, [ title, projectCreator ]);

                        res.status(200).json({ message: "Success", upvotes: project.announcements[announcementIndex].comments[commentIndex].upvotes, status: "UPVOTED" });
                    } else {
                        let alreadyUpvoted = -1;
                        project.announcements[announcementIndex].comments[commentIndex].upvotes.forEach((vote, i) => 
                            vote.user === user && vote.pfp === pfp ? alreadyUpvoted = i : null);

                        let status = 0;

                        if (alreadyUpvoted < 0) {
                            project.announcements[announcementIndex].comments[commentIndex].upvotes.push({ user, pfp });
                            status = "UPVOTED";
                        } else {
                            project.announcements[announcementIndex].comments[commentIndex].upvotes.splice(alreadyUpvoted, 1);
                            status = "REMOVED";
                        }

                        await db.query(`UPDATE projects SET announcements = '${JSON.stringify(project.announcements)}' WHERE project_title = $1 AND user_name = $2`, [ title, projectCreator ]);

                        res.status(200).json({ message: "Success", upvotes: project.announcements[announcementIndex].comments[commentIndex].upvotes, status });
                    }
                } else res.status(404).json({ message: "Comment not found" });
            } else res.status(404).json({ message: "Announcement not found" });
        } else res.status(404).json({ message: "Project not found" });
    } else res.status(403).json({ message: "Invalid user" });
});

router.post('/downvoteComment', async (req, res) => {
    const { comment, commentCreator, user, pfp, commentUserPfp, announcementName, title, projectCreator, announcementContent } = req.body;

    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ user, pfp ]);

    if (userExists.rows.length > 0) {
        const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ title, projectCreator ]);

        if (exists.rows.length > 0) {
            const project = exists.rows[0];

            let announcementIndex = -1;
            project.announcements.forEach((announcement, i) => {
                if (announcement.title === announcementName && announcement.desc === announcementContent) {
                    announcementIndex = i;
                }
            });

            if (announcementIndex > -1) {
                let commentIndex = -1;
                project.announcements[announcementIndex].comments.forEach((userComment, i) => {
                    if (userComment.comment === comment && userComment.user === commentCreator && userComment.pfp === commentUserPfp) {
                        commentIndex = i;
                    }
                });

                if (commentIndex > -1) {
                    if (!project.announcements[announcementIndex].comments[commentIndex].downvotes) {
                        project.announcements[announcementIndex].comments[commentIndex].downvotes = [ { user, pfp } ];

                        await db.query(`UPDATE projects SET announcements = '${JSON.stringify(project.announcements)}' WHERE project_title = $1 AND user_name = $2`, [ title, projectCreator ]);

                        res.status(200).json({ message: "Success", downvotes: project.announcements[announcementIndex].comments[commentIndex].downvotes, status: "DOWNVOTED" });
                    } else {
                        let alreadyDownvoted = -1;
                        project.announcements[announcementIndex].comments[commentIndex].downvotes.forEach((vote, i) => 
                            vote.user === user && vote.pfp === pfp ? alreadyDownvoted = i : null);

                        let status = 0;

                        if (alreadyDownvoted < 0) {
                            project.announcements[announcementIndex].comments[commentIndex].downvotes.push({ user, pfp });
                            status = "DOWNVOTED";
                        } else {
                            project.announcements[announcementIndex].comments[commentIndex].downvotes.splice(alreadyDownvoted, 1);
                            status = "REMOVED";
                        }

                        await db.query(`UPDATE projects SET announcements = '${JSON.stringify(project.announcements)}' WHERE project_title = $1 AND user_name = $2`, [ title, projectCreator ]);

                        res.status(200).json({ message: "Success", downvotes: project.announcements[announcementIndex].comments[commentIndex].downvotes, status });
                    }
                } else res.status(404).json({ message: "Comment not found" });
            } else res.status(404).json({ message: "Announcement not found" });
        } else res.status(404).json({ message: "Project not found" });
    } else res.status(403).json({ message: "Invalid user" });
});

router.post('/createFeedback', async (req, res) => {
    const { user, pfp, title, projectCreator, password, feedbackTitle, feedback } = req.body;

    const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ title, projectCreator ]);
    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ user, pfp ]);

    if (userExists.rows.length > 0) {
        const passwordCorrect = await bcrypt.compare(password, userExists.rows[0].user_pass);

        if (passwordCorrect) {
            if (exists.rows.length > 0) {
                const userFeedback = {
                    title: feedbackTitle,
                    feedback,
                    user,
                    pfp
                };

                const project = exists.rows[0];

                if (!project.feedback) {
                    project.feedback = [ userFeedback ];
                } else {
                    project.feedback.unshift(userFeedback);
                }

                const newFeedback = await db.query(`UPDATE projects SET feedback = '${JSON.stringify(project.feedback)}' WHERE project_title = $1 AND user_name = $2 RETURNING feedback`, [ title, projectCreator ]);

                res.status(201).json({ message: "Successfully created feedback", feedback: newFeedback.rows[0].feedback });
            } else res.status(404).json({ message: "Project not found" });
        } else res.status(403).json({ message: "Invalid password" });
    } else res.status(403).json({ message: "Invalid user" });
});

router.post('/createThread', async (req, res) => {
    const { subject, desc, username, pfp, projectCreator, password, title } = req.body;

    const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ title, projectCreator ]);
    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ username, pfp ]);

    if (userExists.rows.length > 0) {
        const passwordCorrect = await bcrypt.compare(password, userExists.rows[0].user_pass);
        const dateCreated = `${new Date().getMonth()}/${new Date().getDate()}/${new Date().getFullYear()}`;

        if (passwordCorrect) {
            if (exists.rows.length > 0) {
                const thread = {
                    subject, desc, 
                    user: username, pfp,
                    date_created: dateCreated,
                    members: 1,
                    messages: []
                };

                const project = exists.rows[0];

                if (!project.threads) {
                    project.threads = [ thread ];
                } else {
                    project.threads.unshift(thread);
                }

                const threads = await db.query(`UPDATE projects SET threads = '${JSON.stringify(project.threads)}' WHERE project_title = $1 AND user_name = $2 RETURNING threads`, [ title, projectCreator ]);

                res.status(201).json({ message: "Successfully created thread", threads: threads.rows[0].threads });
            } else res.status(404).json({ message: "Project not found" });
        } else res.status(403).json({ message: "Invalid password" });
    } else res.status(403).json({ message: "Invalid user" });
});

router.post('/createReview', async (req, res) => {
    const { username, pfp, title, projectCreator, password, reviewTitle, review, reviewRating } = req.body;

    const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ title, projectCreator ]);
    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ username, pfp ]);

    if (userExists.rows.length > 0) {
        const passwordCorrect = await bcrypt.compare(password, userExists.rows[0].user_pass);

        if (passwordCorrect) {
            if (exists.rows.length > 0) {
                const dateCreated = `${new Date().getMonth()}/${new Date().getDate()}/${new Date().getFullYear()}`;


                const userReview = {
                    title: reviewTitle.replace("'", "''"),
                    review: review.replace("'", "''"),
                    review_rating: reviewRating,
                    user: username,
                    pfp,
                    date_created: dateCreated
                };

                const project = exists.rows[0];

                if (!project.reviews) {
                    project.reviews = [ userReview ];
                } else {
                    project.reviews.unshift(userReview);
                }

                await db.query(`UPDATE projects SET reviews = '${JSON.stringify(project.reviews)}' WHERE project_title = $1 AND user_name = $2`, [ title, projectCreator ]);
                const newReviews = await db.query('SELECT reviews FROM projects WHERE project_title = $1 AND user_name = $2', [ title, projectCreator ]);

                res.status(201).json({ message: "Successfully created feedback", reviews: newReviews.rows[0].reviews });
            } else res.status(404).json({ message: "Project not found" });
        } else res.status(403).json({ message: "Invalid password" });
    } else res.status(403).json({ message: "Invalid user" });
});

router.post('/reportBug', async (req, res) => { 
    const { username, pfp, projectCreator, password, projectTitle, title, summary, version, screenshots } = req.body;

    const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ projectTitle, projectCreator ]);
    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ username, pfp ]);

    if (userExists.rows.length > 0) {
        const passwordCorrect = await bcrypt.compare(password, userExists.rows[0].user_pass);

        if (passwordCorrect) {
            if (exists.rows.length > 0) {
                const dateCreated = `${new Date().getMonth()}/${new Date().getDate()}/${new Date().getFullYear()}`;

                const bug = {
                    title: title.replace("'", "''"),
                    summary: summary.replace("'", "''"),
                    version,
                    screenshots: JSON.stringify(screenshots),
                    user: username,
                    pfp,
                    date_created: dateCreated
                };

                const project = exists.rows[0];

                if (!project.bugs) {
                    project.bugs = [ bug ];
                } else {
                    project.bugs.unshift(bug);
                }

                const validVersion = /([0-9])*\.([0-9])*(\.([0-9])*)?/gmi.test(version);

                if (validVersion) {
                    await db.query(`UPDATE projects SET bugs = '${JSON.stringify(project.bugs)}' WHERE project_title = $1 AND user_name = $2`, [ projectTitle, projectCreator ]);
                    const newBugs = await db.query('SELECT bugs FROM projects WHERE project_title = $1 AND user_name = $2', [ projectTitle, projectCreator ]);

                    res.status(201).json({ message: "Successfully created feedback", bugs: newBugs.rows[0].reviews });
                } else res.status(406).json({ message: "Invalid version" });
            } else res.status(404).json({ message: "Project not found" });
        } else res.status(403).json({ message: "Invalid password" });
    } else res.status(403).json({ message: "Invalid user" });
});

router.post('/createPoll', async (req, res) => {
    const { username, pfp, projectCreator, password, projectTitle, title, desc, questions } = req.body;

    const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ projectTitle, projectCreator ]);
    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ username, pfp ]);

    if (userExists.rows.length > 0) {
        const passwordCorrect = await bcrypt.compare(password, userExists.rows[0].user_pass);

        if (passwordCorrect) {
            if (exists.rows.length > 0) {
                const project = exists.rows[0];
                let isMember = false;

                project.members.forEach(member => member.user_name === username && member.pfp === pfp ? isMember = true : null);
                if (isMember) {
                    const poll = {
                        creator: username.replace("'", "''"),
                        pfp,
                        title: title.replace("'", "''"), 
                        description: desc.replace("'", "''"),
                        questions: JSON.stringify(questions).replace("'", "''"),
                        responses: '[]'
                    };

                    if (!project.polls) 
                        project.polls = [ poll ];
                    else 
                        project.polls.unshift(poll);

                    await db.query(`UPDATE projects SET polls = '${JSON.stringify(project.polls)}' WHERE project_title = $1 AND user_name = $2`, [ projectTitle, projectCreator ]);

                    res.status(201).json({ message: "Successfully created poll" });
                } else res.status(403).json({ message: "You aren't a member of this project" });
            } else res.status(404).json({ message: "Project not found" });
        } else res.status(403).json({ message: "Invalid password" });
    } else res.status(403).json({ message: "Invalid user" });
});

router.post('/submitPollAnswer', async (req, res) => {
    const { username, pfp, projectCreator, password, projectTitle, title, desc, answers } = req.body;

    const exists = await db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ projectTitle, projectCreator ]);
    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1 AND pfp = $2', [ username, pfp ]);

    if (userExists.rows.length > 0) {
        const passwordCorrect = await bcrypt.compare(password, userExists.rows[0].user_pass);

        if (passwordCorrect) {
            if (exists.rows.length > 0) {
                const project = exists.rows[0];
                let pollIndex = -1;

                project.polls.forEach((poll, i) => {
                    if (poll.title === title && poll.description === desc) {
                        pollIndex = i;
                    }
                });

                if (pollIndex > -1) {
                    let responses = JSON.parse(project.polls[pollIndex].responses);
                    responses.unshift({
                        user: username,
                        pfp,
                        answers: JSON.stringify(answers)
                    });

                    project.polls[pollIndex].responses = JSON.stringify(responses).replace(/\\\\/gm, '').replace(/\'/gm, "^");
                    await db.query(`UPDATE projects SET polls = '${JSON.stringify(project.polls).replace(/\\\\/gm, '').replace(/\'/gm, "^")}' WHERE project_title = $1 AND user_name = $2`, [ projectTitle, projectCreator ]);

                    res.status(201).json({ message: "Successfully submitted response" });
                } else res.status(404).json({ message: "Poll not found" });
            } else res.status(404).json({ message: "Project not found" });
        } else res.status(403).json({ message: "Invalid password" });
    } else res.status(403).json({ message: "Invalid user" });
});

module.exports = router;