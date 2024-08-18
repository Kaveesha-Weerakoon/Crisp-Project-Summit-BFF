const express = require('express');
const axios = require('axios'); // Make sure to require axios
const router = express.Router();
const API_URL = 'http://localhost:8080/api/v1/'

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}public/category`);
        res.json(response.data);

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${API_URL}public/category/${id}`);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching category with id ${id}:`, error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

router.post('/', async (req, res) => {
    try {
        const category = req.body;
        const response = await axios.post(`${API_URL}public/category`, category);
        res.json(response.data);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

module.exports = router;
