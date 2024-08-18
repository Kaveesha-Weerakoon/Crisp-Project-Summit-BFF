const express = require('express');
const axios = require('axios');
const router = express.Router();

const CART_API_URL = 'http://localhost:8080/api/v1/public/user/cart';
const CART_PRODUCT_API_URL = 'http://localhost:8080/api/v1/public/user/cartproduct';

async function createCart(userId) {
    try {
        const response = await axios.post(CART_API_URL, { userId });
        console.log('Cart created:', response.data);

        if (response.data && response.data.id) {
            return response.data.id;
        } else {
            throw new Error('Cart ID not found in response');
        }
    } catch (error) {
        console.error('Error creating cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getCartsByUserId(userId) {
    try {
        const response = await axios.get(`${CART_API_URL}/user/${userId}`);
        console.log('Carts fetched for user:', response.data);

        if (response.data && Array.isArray(response.data)) {
            return response.data; // Assuming response.data is an array of carts
        } else {
            throw new Error('Carts not found or invalid format in response');
        }
    } catch (error) {
        console.error('Error fetching carts:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function addProductToCart(cartId, product) {
    console.log(product)
    const payload = {
        "id": "2",
        "productId": product.productId,
        "cartId": product.cartId,
        "quantity": product.quantity

    }

    console.log("Request Payload:", payload);

    try {
        // Sending POST request to the backend
        const response = await axios.post(CART_PRODUCT_API_URL, payload);

        console.log('Product added to cart:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding product to cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}


async function deleteCartById(userId) {
    try {

        const response = await axios.delete(`${CART_API_URL}/${userId}`, { userId });


        if (response.data && response.data.id) {
            return response.data.id;
        } else {
            throw new Error('Cart ID not found in response');
        }
    } catch (error) {
        console.error('Error creating cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function deleteCartProductById(cartProductId) {
    try {

        const response = await axios.delete(`${CART_PRODUCT_API_URL}/${cartProductId}`, { cartProductId });


        if (response.data && response.data.id) {
            return response.data.id;
        } else {
            throw new Error('Cart ID not found in response');
        }
    } catch (error) {
        console.error('Error creating cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getCartById(cartId) {
    try {
        const response = await axios.get(`${CART_API_URL}/${cartId}`);
        console.log('Cart fetched:', response.data);

        if (response.data) {
            return response.data; // Return the specific cart
        } else {
            throw new Error('Cart not found');
        }
    } catch (error) {
        console.error('Error fetching cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Define the addToCart function


router.post('/add-product', async (req, res) => {

    const { userId, productId, name, price, photoUrl, cartId, quantity } = req.body;

    try {
        const product = { productId, name, price, photoUrl, cartId, quantity };
        console.log(product)
        const result = await addProductToCart(userId, product);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
});

router.get('/getcarts', async (req, res) => {
    const { userId } = req.query;
    console.log('User Id' + userId);
    // Assuming userId is passed as a query parameter

    if (!userId) {
        return res.status(400).json({ error: 'Missing user information' });
    }

    try {
        // Retrieve carts for the user
        const carts = await getCartsByUserId(userId);
        res.status(200).json({ carts });
    } catch (error) {
        console.error('Error retrieving carts:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to retrieve carts' });
    }
});

// Add a route to create a cart directly
router.post('/create-cart', async (req, res) => {
    const { userId } = req.body; // Access userId from the request body

    if (!userId) {
        return res.status(400).json({ error: 'Missing user information' });
    }

    try {
        const cartId = await createCart(userId);
        res.status(200).json({ cartId });
    } catch (error) {
        console.error('Error creating cart:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to create cart' });
    }
});


router.delete('/delete-cart/:cartId', async (req, res) => {
    const { cartId } = req.params;

    if (!cartId) {
        return res.status(400).json({ error: 'Missing cart ID' });
    }

    try {
        await deleteCartById(cartId); // Call the function to delete the cart by ID
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart:', error.message);
        res.status(500).json({ error: 'Failed to delete cart' });
    }
});

router.delete('/delete-cartproduct/:cartProductId', async (req, res) => {
    const { cartProductId } = req.params;

    if (!cartProductId) {
        return res.status(400).json({ error: 'Missing cart ID' });
    }

    try {
        console.log(cartProductId);
        await deleteCartProductById(cartProductId); // Call the function to delete the cart by ID
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart:', error.message);
        res.status(500).json({ error: 'Failed to delete cart' });
    }
});


router.get('/getcart/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Missing cart ID' });
    }

    try {
        // Retrieve the specific cart by its ID
        const cart = await getCartById(id);
        res.status(200).json({ cart });
    } catch (error) {
        console.error('Error retrieving cart:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to retrieve cart' });
    }
});

module.exports = router;
