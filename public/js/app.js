const SESSION_KEY = 'numisquest_session';

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function saveSession(session) {
  setSession(session);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

async function apiFetch(url, options = {}) {
  const session = getSession();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Erro HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

async function refreshUser() {
  const session = getSession();
  if (!session?.token) return null;
  try {
    const { user } = await apiFetch('/api/users/me');
    setSession({ ...session, user });
    return user;
  } catch {
    clearSession();
    return null;
  }
}

function renderHeader() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const session = getSession();

  if (session?.user) {
    const pontos = session.user.pontos ?? 0;
    const nivel = session.user.nivel || 'Explorador Iniciante';
    nav.innerHTML = `
      <a href="/">Catálogo</a>
      <a href="/identificador">Identificador</a>
      <a href="/desafios">Desafios & Conquistas</a>
      <span class="badge" title="Nível e Experiência">${nivel} • ${pontos} XP</span>
      <button class="btn btn--ghost" onclick="logout()">Sair (${session.user.username})</button>
    `;
  } else {
    nav.innerHTML = `
      <a href="/">Catálogo</a>
      <a href="/identificador">Identificador</a>
      <a href="/desafios">Desafios & Conquistas</a>
      <a href="/login">Login</a>
      <a class="btn" href="/cadastro">Cadastro</a>
    `;
  }
}

function logout() {
  clearSession();
  window.location.href = '/';
}

function requireAuth() {
  if (!getSession()) {
    const redirect = encodeURIComponent(window.location.pathname);
    window.location.href = `/login?redirect=${redirect}`;
    return false;
  }
  return true;
}

function showAlert(el, message, type = 'error') {
  el.hidden = false;
  el.className = `alert alert--${type}`;
  el.textContent = message;
}

function clearAlert(el) {
  el.hidden = true;
  el.textContent = '';
}

document.addEventListener('DOMContentLoaded', renderHeader);