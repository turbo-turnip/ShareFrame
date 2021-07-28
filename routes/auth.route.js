const Router = require('express').Router;

// initialize auth router
const router = new Router();

// Auth Router ReST API
router.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the ShareFrame Auth ReST API" });
});

module.exports = router;