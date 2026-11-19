function errorHandler(err, req, res, _next) {
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador inválido.' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Registro duplicado (e-mail ou usuário já cadastrado).' });
  }
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Erro interno do servidor.' });
}

module.exports = { errorHandler };
