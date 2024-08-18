const express = require('express');
const axios = require('axios');
const router = express.Router();
const API_URL = 'http://localhost:8080/api/v1/';

async function getProducts(page = 0, size = 10) {
    return await axios.get(`${API_URL}public/products?page=${page}&size=${size}`);
}

async function getProductsByName(page = 0, size = 10, name) {
    return await axios.get(`${API_URL}public/products/name/${name}?page=${page}&size=${size}`);
}


async function getProductsByCategory(id, page = 0, size = 10) {
    return await axios.get(`${API_URL}public/products/category/${id}?page=${page}&size=${size}`);
}

router.get('/', async (req, res) => {
    const { page = 0, size = 10 } = req.query;
    try {
        console.log("sd")
        const response = await getProducts(page, size);
        console.log('API response data:', response.data); // Log response data
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

router.get('/search', async (req, res) => {
    const { page = 0, size = 10, name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Name query parameter is required' });
    }
    try {
        const response = await getProductsByName(page, size, name);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching products by name:', error);
        res.status(500).json({ error: 'Failed to fetch products by name' });
    }
});

router.get('/category/:id', async (req, res) => {
    const { page = 0, size = 10 } = req.query;
    const { id } = req.params;
    try {
        const response = await getProductsByCategory(id, page, size);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
});

module.exports = router;
