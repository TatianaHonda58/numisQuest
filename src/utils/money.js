// Arredonda valores monetários para 2 casas decimais
const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

module.exports = { round };
