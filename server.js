const express = require('express');
const cors = require('cors');
const productsRoute = require('./routes/products');
const categoriesRoute = require('./routes/categories');
const authRoute = require('./routes/auth');
const cartRoute = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth', authRoute);
app.use('/api/products', productsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/cart', cartRoute);

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
