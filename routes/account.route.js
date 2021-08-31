const Router = require('express').Router;
const { pool: db } = require('../database');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const router = new Router();

router.post('/updateUsername', async (req, res) => {
    const { username, password, newUsername } = req.body;

    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1', [ username ]);

    if (userExists.rows.length > 0) {
        userExists.rows.forEach(async (user, iteration) => {
            const passwordCorrect = await bcrypt.compare(password, user.user_pass);

            if (passwordCorrect && !res.headersSent) {
                try {
                    await db.query('UPDATE users SET user_name = $1 WHERE user_name = $2 AND user_email = $3 AND user_id = $4', [ newUsername, username, user.user_email, user.user_id ]);
                    let projects = await db.query('SELECT * FROM projects');
                    projects = projects.rows;
                    projects.forEach(async project => {
                        if (project.user_name === username)
                            await db.query('UPDATE projects SET user_name = $1 WHERE project_title = $2 AND user_name = $3', [ newUsername, project.project_title, project.user_name ]);

                        project.members.forEach(async (member, i) => {
                            if (member.user_name === username) {
                                let members = project.members;
                                members[i].user_name = newUsername;
                                await db.query(`UPDATE projects SET members = '${JSON.stringify(members)}' WHERE project_title = $1 AND (user_name = $2 OR user_name = $3)`, [ project.project_title, username, newUsername ]);
                            }
                        });

                        project.announcements.forEach(async (announcement, i) => {
                            let announcements = project.announcements;
                            if (announcement.user_name === username) {
                                announcements[i].user_name = newUsername;
                                await db.query(`UPDATE projects SET announcements = '${JSON.stringify(announcements)}' WHERE project_title = $1 AND (user_name = $2 OR user_name = $3)`, [ project.project_title, username, newUsername ]);
                            }

                            if (announcement.comments) {
                                announcement.comments.forEach(async (comment, index) => {
                                    if (comment.user === username)
                                        announcements[i].comments[index].user = newUsername;

                                    if (comment.upvotes) {
                                        comment.upvotes.forEach((vote, voteIndex) => {
                                            if (vote.user === username) {
                                                announcements[i].comments[index].upvotes[voteIndex].user = newUsername;
                                            }
                                        });
                                    }

                                    if (comment.downvotes) {
                                        comment.downvotes.forEach((vote, voteIndex) => {
                                            if (vote.user === username) {
                                                announcements[i].comments[index].downvotes[voteIndex].user = newUsername;
                                            }
                                        });
                                    }

                                    await db.query(`UPDATE projects SET announcements = '${JSON.stringify(announcements)}' WHERE project_title = $1 AND (user_name = $2 OR user_name = $3)`, [ project.project_title, username, newUsername ]);
                                });
                            }
                        });

                        if (project.feedback) {
                            project.feedback.forEach(async (entry, i) => {
                                if (entry.user === username) {
                                    let feedback = project.feedback;
                                    feedback[i].user = newUsername;
                                    await db.query(`UPDATE projects SET feedback = '${JSON.stringify(feedback)}' WHERE project_title = $1 AND (user_name = $2 OR user_name = $3)`, [ project.project_title, username, newUsername ]);
                                }
                            });
                        }

                        if (project.threads) {
                            let threads = project.threads;
                            project.threads.forEach((thread, i) => {
                                if (thread.user === username) {
                                    threads[i].user = newUsername;
                                }

                                thread.messages.forEach((message, messageIndex) => {
                                    if (message.user === username) {
                                        threads[i].messages[messageIndex].user = newUsername;
                                    }
                                });
                            });

                            await db.query(`UPDATE projects SET threads = '${JSON.stringify(threads)}' WHERE project_title = $1 AND (user_name = $2 OR user_name = $3)`, [ project.project_title, username, newUsername ]);
                        }

                        if (project.reviews) {
                            console.log('reviews');
                            project.reviews.forEach(async (review, i) => {
                                if (review.user === username) {
                                    console.log('review updating!');
                                    let reviews = project.reviews;
                                    reviews[i].user = newUsername;
                                    console.log(reviews);
                                    await db.query(`UPDATE projects SET reviews = '${JSON.stringify(reviews)}' WHERE project_title = $1 AND (user_name = $2 OR user_name = $3)`, [ project.project_title, username, newUsername ]);
                                }
                            });
                        }

                        if (project.bugs) {
                            project.bugs.forEach(async (bug, i) => {
                                if (bug.user === username) {
                                    project.bugs[i].user = newUsername;
                                    await db.query(`UPDATE projects SET bugs = '${JSON.stringify(project.bugs)}' WHERE project_title = $1 AND (user_name = $2 OR user_name = $3)`, [ project.project_title, username, newUsername ]);
                                }
                            });
                        }

                        if (project.polls) {
                            let polls = project.polls;
                            project.polls.forEach((poll, i) => {
                                if (poll.creator === username) {
                                    polls[i].creator = newUsername;
                                }

                                JSON.parse(poll.responses).forEach((response, responseIndex) => {
                                    if (response.user === username) {
                                        let responses = JSON.parse(poll.responses);
                                        responses[responseIndex].user = newUsername;
                                        polls[i].responses = JSON.stringify(responses);
                                    }
                                });
                            });

                            await db.query(`UPDATE projects SET polls = '${JSON.stringify(polls)}' WHERE project_title = $1 AND (user_name = $2 OR user_name = $3)`, [ project.project_title, username, newUsername ]);
                        }
                    });

                    res.status(200).json({ message: "Updated username" });
                } catch (err) {
                    res.status(500).json({ message: err.message });
                    console.log(err);
                }
            } else if (iteration === userExists.rows.length - 1 && !res.headersSent) {
                res.status(403).json({ message: "Invalid password" });
            }
        });
    } else res.status(404).json({ message: "User doesn't exist" });
});

module.exports = router;