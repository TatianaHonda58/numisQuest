const Item = require('../models/Item');

function normalize(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

async function identifyItems(criteria = {}) {
  const { pais, tipo, anoEmissao, valorFacial, material, formato, caracteristicaVisual } = criteria;

  const hasAnyFilter = [pais, tipo, anoEmissao, valorFacial, material, formato, caracteristicaVisual]
    .some((val) => val !== undefined && val !== null && String(val).trim() !== '');

  if (!hasAnyFilter) {
    const err = new Error('Informe ao menos uma característica (país, tipo, ano, valor facial, material, formato ou detalhe visual).');
    err.status = 400;
    throw err;
  }

  const allItems = await Item.find().lean();
  const results = [];

  for (const item of allItems) {
    let criteriosAvaliados = 0;
    let criteriosAtendidos = 0;
    const detalhesMatch = [];

    if (pais && String(pais).trim()) {
      criteriosAvaliados++;
      if (normalize(item.pais).includes(normalize(pais))) {
        criteriosAtendidos++;
        detalhesMatch.push('País');
      }
    }

    if (tipo && String(tipo).trim()) {
      criteriosAvaliados++;
      if (normalize(item.tipo) === normalize(tipo)) {
        criteriosAtendidos++;
        detalhesMatch.push('Tipo');
      }
    }

    if (anoEmissao !== undefined && anoEmissao !== null && String(anoEmissao).trim() !== '') {
      criteriosAvaliados++;
      const anoNum = Number(anoEmissao);
      if (!Number.isNaN(anoNum) && Math.abs(item.anoEmissao - anoNum) <= 5) {
        criteriosAtendidos++;
        detalhesMatch.push(item.anoEmissao === anoNum ? 'Ano exato' : 'Período aproximado');
      }
    }

    if (valorFacial && String(valorFacial).trim()) {
      criteriosAvaliados++;
      if (normalize(item.valorFacial).includes(normalize(valorFacial))) {
        criteriosAtendidos++;
        detalhesMatch.push('Valor facial');
      }
    }

    if (material && String(material).trim()) {
      criteriosAvaliados++;
      if (normalize(item.material).includes(normalize(material))) {
        criteriosAtendidos++;
        detalhesMatch.push('Material');
      }
    }

    if (formato && String(formato).trim()) {
      criteriosAvaliados++;
      if (normalize(item.formato).includes(normalize(formato))) {
        criteriosAtendidos++;
        detalhesMatch.push('Formato');
      }
    }

    if (caracteristicaVisual && String(caracteristicaVisual).trim()) {
      criteriosAvaliados++;
      const termo = normalize(caracteristicaVisual);
      const visuais = (item.caracteristicasVisuais || []).map(normalize).join(' ');
      const textoCompleto = `${visuais} ${normalize(item.titulo)} ${normalize(item.historico)}`;
      if (textoCompleto.includes(termo)) {
        criteriosAtendidos++;
        detalhesMatch.push('Característica visual');
      }
    }

    if (criteriosAtendidos > 0) {
      const compatibilidade = Math.round((criteriosAtendidos / criteriosAvaliados) * 100);
      results.push({
        item,
        compatibilidade,
        criteriosAtendidos,
        criteriosAvaliados,
        detalhesMatch
      });
    }
  }

  return results.sort((a, b) => b.compatibilidade - a.compatibilidade || b.criteriosAtendidos - a.criteriosAtendidos);
}

module.exports = { identifyItems };