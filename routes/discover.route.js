const Router = require('express').Router;
const { pool: db } = require('../database');

require('dotenv').config();
const router = new Router();

router.get('/trending', async (req, res) => {
    const projects = await db.query('SELECT * FROM projects');

    const average = 
        projects.rows.map(project => project.supporters.length)
        .reduce((acc, supporters) => acc + supporters, 0) 
        / projects.rows.length;

    const trending = projects.rows.filter(project => project.supporters.length > average).splice(0, 15);

    res.status(200).json({ trending });
});

router.get('/projects/:amount/:last', async (req, res) => {
    const { amount, last } = req.params;
    const projects = await db.query('SELECT * FROM projects');

    const selected = projects.rows.splice(0, amount);

    if (selected.length != last)
        res.status(200).json({ projects: selected });
    else res.status(429).json({ message: "Cannot load any more projects" });
});

module.exports = router;