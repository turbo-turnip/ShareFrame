const Router = require('express').Router;
const { pool: db } = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const router = new Router();

router.post('/updateUsername', async (req, res) => {
    const { username, password, newUsername } = req.body;

    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1', [ username ]);
    const alreadyExists = await db.query('SELECT * FROM users WHERE user_name = $1', [ newUsername ]);

    if (!alreadyExists.rows.length > 0) {
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
                                project.reviews.forEach(async (review, i) => {
                                    if (review.user === username) {
                                        let reviews = project.reviews;
                                        reviews[i].user = newUsername;
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

                        const at = await jwt.sign({ username: newUsername, email: user.user_email, password: user.user_pass }, process.env.AT_SECRET, { expiresIn: 60 * 15 });
                        const rt = await jwt.sign({ id: user.user_id, password: user.user_pass }, process.env.RT_SECRET, { expiresIn: 60 * 60 * 24 * 30 });

                        res.status(200).json({ message: "Updated username", at, rt });
                    } catch (err) {
                        res.status(500).json({ message: err.message });
                        console.log(err);
                    }
                } else if (iteration === userExists.rows.length - 1 && !res.headersSent) {
                    res.status(403).json({ message: "Invalid password" });
                }
            });
        } else res.status(404).json({ message: "User doesn't exist" });
    } else res.status(409).json({ message: "Username already exists" });
});

router.post('/updatePfp', async (req, res) => {
    const { username, password, newPfp } = req.body;

    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1', [ username ]);

    if (userExists.rows.length > 0) {
        userExists.rows.forEach(async (user, iteration) => {
            const passwordCorrect = await bcrypt.compare(password, user.user_pass);

            if (passwordCorrect && !res.headersSent) {
                try {
                    await db.query('UPDATE users SET pfp = $1 WHERE user_name = $2 AND user_email = $3 AND user_id = $4', [ newPfp, username, user.user_email, user.user_id ]);
                    let projects = await db.query('SELECT * FROM projects');
                    projects = projects.rows;
                    projects.forEach(async project => {
                        if (project.user_name === username)
                            await db.query('UPDATE projects SET user_pfp = $1 WHERE project_title = $2 AND user_name = $3', [ newPfp, project.project_title, project.user_name ]);

                        project.members.forEach(async (member, i) => {
                            if (member.user_name === username) {
                                let members = project.members;
                                members[i].pfp = newPfp;
                                await db.query(`UPDATE projects SET members = '${JSON.stringify(members)}' WHERE project_title = $1 AND user_name = $2`, [ project.project_title, username ]);
                            }
                        });

                        project.announcements.forEach(async (announcement, i) => {
                            let announcements = project.announcements;
                            if (announcement.user_name === username) {
                                announcements[i].pfp = newPfp;
                                await db.query(`UPDATE projects SET announcements = '${JSON.stringify(announcements)}' WHERE project_title = $1 AND user_name = $2`, [ project.project_title, username ]);
                            }

                            if (announcement.comments) {
                                announcement.comments.forEach(async (comment, index) => {
                                    if (comment.user === username)
                                        announcements[i].comments[index].pfp = newPfp;

                                    if (comment.upvotes) {
                                        comment.upvotes.forEach((vote, voteIndex) => {
                                            if (vote.user === username) {
                                                announcements[i].comments[index].upvotes[voteIndex].pfp = newPfp;
                                            }
                                        });
                                    }

                                    if (comment.downvotes) {
                                        comment.downvotes.forEach((vote, voteIndex) => {
                                            if (vote.user === username) {
                                                announcements[i].comments[index].downvotes[voteIndex].pfp = newPfp;
                                            }
                                        });
                                    }

                                    await db.query(`UPDATE projects SET announcements = '${JSON.stringify(announcements)}' WHERE project_title = $1 AND user_name = $2`, [ project.project_title, username ]);
                                });
                            }
                        });

                        if (project.feedback) {
                            project.feedback.forEach(async (entry, i) => {
                                if (entry.user === username) {
                                    let feedback = project.feedback;
                                    feedback[i].pfp = newPfp;
                                    await db.query(`UPDATE projects SET feedback = '${JSON.stringify(feedback)}' WHERE project_title = $1 AND user_name = $2`, [ project.project_title, username ]);
                                }
                            });
                        }

                        if (project.threads) {
                            let threads = project.threads;
                            project.threads.forEach((thread, i) => {
                                thread.messages.forEach((message, messageIndex) => {
                                    if (message.user === username) {
                                        threads[i].messages[messageIndex].pfp = newPfp;
                                    }
                                });
                            });

                            await db.query(`UPDATE projects SET threads = '${JSON.stringify(threads)}' WHERE project_title = $1 AND user_name = $2`, [ project.project_title, username ]);
                        }

                        if (project.reviews) {
                            project.reviews.forEach(async (review, i) => {
                                if (review.user === username) {
                                    let reviews = project.reviews;
                                    reviews[i].pfp = newPfp;
                                    await db.query(`UPDATE projects SET reviews = '${JSON.stringify(reviews)}' WHERE project_title = $1 AND user_name = $2`, [ project.project_title, username ]);
                                }
                            });
                        }

                        if (project.bugs) {
                            project.bugs.forEach(async (bug, i) => {
                                if (bug.user === username) {
                                    project.bugs[i].pfp = newPfp;
                                    await db.query(`UPDATE projects SET bugs = '${JSON.stringify(project.bugs)}' WHERE project_title = $1 AND user_name = $2`, [ project.project_title, username ]);
                                }
                            });
                        }

                        if (project.polls) {
                            let polls = project.polls;
                            project.polls.forEach((poll, i) => {
                                if (poll.creator === username) {
                                    polls[i].pfp = newPfp;
                                }

                                JSON.parse(poll.responses).forEach((response, responseIndex) => {
                                    if (response.user === username) {
                                        let responses = JSON.parse(poll.responses);
                                        responses[responseIndex].pfp = newPfp;
                                        polls[i].responses = JSON.stringify(responses);
                                    }
                                });
                            });

                            await db.query(`UPDATE projects SET polls = '${JSON.stringify(polls)}' WHERE project_title = $1 AND user_name = $2`, [ project.project_title, username ]);
                        }
                    });

                    const at = await jwt.sign({ username: user.user_name, email: user.user_email, password: user.user_pass }, process.env.AT_SECRET, { expiresIn: 60 * 15 });
                    const rt = await jwt.sign({ id: user.user_id, password: user.user_pass }, process.env.RT_SECRET, { expiresIn: 60 * 60 * 24 * 30 });

                    res.status(200).json({ message: "Updated profile picture", at, rt });
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

router.post('/updatePassword', async (req, res) => {
    const { username, password, newPassword } = req.body;

    const userExists = await db.query('SELECT * FROM users WHERE user_name = $1', [ username ]);
    const hashed = await bcrypt.hash(newPassword, 10);

    if (userExists.rows.length > 0) {
        userExists.rows.forEach(async (user, iteration) => {
            const passwordCorrect = await bcrypt.compare(password, user.user_pass);

            if (passwordCorrect && !res.headersSent) {
                await db.query('UPDATE users SET user_pass = $1 WHERE user_name = $2 AND user_email = $3 AND user_id = $4', [ hashed, username, user.user_email, user.user_id ]);
                

                const at = await jwt.sign({ username: user.user_name, email: user.user_email, password: hashed }, process.env.AT_SECRET, { expiresIn: 60 * 15 });
                const rt = await jwt.sign({ id: user.user_id, password: hashed }, process.env.RT_SECRET, { expiresIn: 60 * 60 * 24 * 30 });

                res.status(200).json({ message: "Updated password" });
            } else if (iteration === userExists.rows.length - 1 && !res.headersSent) {
                res.status(403).json({ message: "Invalid password" });
            }
        });
    } else res.status(404).json({ message: "User doesn't exist" });
});

module.exports = router;