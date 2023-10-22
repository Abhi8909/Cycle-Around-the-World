// routes/spot.js
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET;

// Define a POST raoute for user authentication
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({
        where: { username: username, password: password },
    });

    if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token });
});



module.exports = router;
