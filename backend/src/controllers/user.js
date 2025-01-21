// controllers/userController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'your_jwt_secret';

// Register User
exports.register = async (req, res) => {
    console.log(req.body, "testing req.body");
    const { dob, username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const user = await User.create({ dob, username, email, password });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, username: user.username, dob: user.dob, email: user.email },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
