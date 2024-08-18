// routes/auth.js
const express = require('express');
const { authenticateUser, registerUser } = require('../auth/cognito');
const API_URL = 'http://localhost:8080/api/v1/'
const axios = require('axios');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const token = await authenticateUser(username, password);
        res.json({ token });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
});

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = await registerUser(email, password, name);
        const backendPayload = {
            email,
            password,
            name,
            id: user.getUsername() // or any other AWS Cognito user info you want to send
        };

        // Send data to your backend
        const response = await axios.post(`${API_URL}auth/signup`, backendPayload);

        res.json({
            message: 'Registration successful',
            user,
            backendResponse: response.data
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
module.exports = router;
