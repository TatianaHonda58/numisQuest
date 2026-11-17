const path = require('path');
const fs = require('fs');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const errorHandler = require('./middleware/errorHandler');

const SWAGGER_PATH = path.join(__dirname, '..', 'docs', 'swagger.yaml');
const swaggerYaml = fs.readFileSync(SWAGGER_PATH, 'utf8');
const swaggerDocument = YAML.parse(swaggerYaml);

const app = express();
app.use(express.json());

// Documentação da API (Swagger)
app.get('/api-docs/swagger.yaml', (req, res) => {
  res.type('application/yaml').send(swaggerYaml);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'E-commerce API - Swagger'
}));

// API REST
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

// Site Web
app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));

app.use(errorHandler);

module.exports = app;
