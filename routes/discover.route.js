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

    const trending = projects.rows.filter(project => project.supporters.length > average);

    res.status(200).json({ trending });
});

module.exports = router;