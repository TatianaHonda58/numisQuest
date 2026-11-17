// Funções compartilhadas pelas páginas do site
const TOKEN_KEY = 'ecommerce_token';
const USER_KEY = 'ecommerce_user';

const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* ignora */ }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch { /* ignora */ }
  }
};

const session = {
  get token() { return storage.get(TOKEN_KEY); },
  get user() {
    try { return JSON.parse(storage.get(USER_KEY)); } catch { return null; }
  },
  save(token, user) {
    if (token) storage.set(TOKEN_KEY, token);
    if (user) storage.set(USER_KEY, JSON.stringify(user));
  },
  clear() {
    storage.remove(TOKEN_KEY);
    storage.remove(USER_KEY);
  }
};

async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (session.token) headers.Authorization = `Bearer ${session.token}`;

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && session.token) {
    session.clear();
    window.location.href = '/login?expirado=1';
    throw new Error('Sessão expirada.');
  }
  if (!response.ok) {
    throw new Error(data.error || 'Não foi possível concluir a operação.');
  }
  return data;
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const money = (value) => brl.format(value);

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text ?? '');
  return div.innerHTML;
}

function showAlert(element, message, type = 'error') {
  element.textContent = message;
  element.className = `alert ${type}`;
}

function hideAlert(element) {
  element.className = 'alert hidden';
}

function requireLogin() {
  if (!session.token) {
    window.location.href = `/login?voltar=${encodeURIComponent(window.location.pathname)}`;
    return false;
  }
  return true;
}

async function refreshUser() {
  if (!session.token) return null;
  const { user } = await api('/users/me');
  session.save(null, user);
  renderHeader();
  return user;
}

function renderHeader() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const user = session.user;

  if (user) {
    nav.innerHTML = `
      <a href="/">Produtos</a>
      <a href="/carrinho">Carrinho</a>
      <span class="user">Olá, ${escapeHtml(user.name.split(' ')[0])}
        ${user.isVip ? '<span class="badge vip">VIP</span>' : ''}</span>
      <a href="#" id="logout">Sair</a>`;
    document.getElementById('logout').addEventListener('click', (event) => {
      event.preventDefault();
      session.clear();
      window.location.href = '/';
    });
  } else {
    nav.innerHTML = `
      <a href="/">Produtos</a>
      <a href="/login">Entrar</a>
      <a href="/cadastro">Cadastrar</a>`;
  }
}

document.addEventListener('DOMContentLoaded', renderHeader);
