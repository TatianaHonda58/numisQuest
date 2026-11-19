const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const apiRoutes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

const swaggerPath = path.join(__dirname, '..', 'docs', 'swagger.yaml');
const swaggerRaw = fs.readFileSync(swaggerPath, 'utf8');
const swaggerDoc = YAML.parse(swaggerRaw);

app.get('/api-docs/swagger.yaml', (_req, res) => {
  res.type('text/yaml').send(swaggerRaw);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get(['/login', '/cadastro', '/identificador', '/desafios'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', `${req.path.slice(1)}.html`));
});

app.use(errorHandler);

module.exports = app;