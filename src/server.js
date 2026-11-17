const config = require('./config');
const { connect, disconnect } = require('./database/connection');
const { seed } = require('./database/seed');
const app = require('./app');

async function start() {
  console.log('Iniciando banco de dados em memória (MongoDB)...');
  await connect();
  const counts = await seed();
  console.log(`Dados de teste carregados: ${counts.products} produtos e ${counts.users} usuários.`);

  const server = app.listen(config.port, () => {
    const base = `http://localhost:${config.port}`;
    console.log(`\nE-commerce rodando!`);
    console.log(`  Site Web:      ${base}`);
    console.log(`  API REST:      ${base}/api`);
    console.log(`  Swagger UI:    ${base}/api-docs`);
    console.log(`  Swagger YAML:  ${base}/api-docs/swagger.yaml\n`);
  });

  const shutdown = async () => {
    server.close();
    await disconnect();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  console.error('Falha ao iniciar a aplicação:', err);
  process.exit(1);
});
