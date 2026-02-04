const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Mock Mode Support
        if (req.app.locals.useMock) {
            const { mockUsers } = require('../mockData');
            let user = mockUsers.find(u => u.email === email);
            if (user) return res.status(400).json({ message: 'User already exists' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = { id: Date.now().toString(), username, email, password: hashedPassword };
            mockUsers.push(user);

            const payload = { userId: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

            return res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create Token
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Mock Mode Support
        let user;
        if (req.app.locals.useMock) {
            const { mockUsers } = require('../mockData');
            user = mockUsers.find(u => u.email === email);
        } else {
            user = await User.findOne({ email });
        }

        // Check user
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        // Create Token
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
