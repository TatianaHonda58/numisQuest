const app = require('./app');
const { PORT } = require('./config/env');
const { connectDatabase } = require('./database/connection');
const { seedDatabase } = require('./database/seed');

async function bootstrap() {
  await connectDatabase();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Catálogo Numismático rodando em http://localhost:${PORT}`);
    console.log(`Swagger UI disponível em     http://localhost:${PORT}/api-docs`);
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar a aplicação:', err);
  process.exit(1);
}); 