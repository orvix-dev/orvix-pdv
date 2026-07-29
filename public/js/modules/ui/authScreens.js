// js/modules/ui/authScreens.js
// Toda a manipulação de DOM das telas de autenticação: login, cadastro,
// esqueci senha, onboarding e seletor de estabelecimento.

const SCREENS = ['login-section', 'signup-section', 'onboarding-section', 'tenant-selector-section', 'app-shell'];

/** Mostra apenas a tela pedida, escondendo as demais. */
export function showScreen(screenId) {
  SCREENS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = (id === screenId) ? (id === 'app-shell' ? 'flex' : 'flex') : 'none';
  });
}

/**
 * Liga os eventos fixos da tela de login/cadastro (botão Google,
 * formulários de login e cadastro, links de troca de tela).
 * Deve ser chamado uma única vez, na inicialização.
 */
export function bindLoginScreenEvents({ onGoogleClick, onLoginSubmit, onSignupSubmit, onForgotPassword }) {
  document.getElementById('google-signin-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    onGoogleClick();
  });

  document.getElementById('google-signup-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    onGoogleClick();
  });

  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email || !password) return alert('Preencha e-mail e senha.');
    onLoginSubmit(email, password);
  });

  document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;
    if (!email || !password) return alert('Preencha e-mail e senha.');
    if (password.length < 6) return alert('A senha deve ter ao menos 6 caracteres.');
    if (password !== passwordConfirm) return alert('As senhas não coincidem.');
    onSignupSubmit(email, password);
  });

  document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    if (!email) return alert('Digite seu e-mail no campo acima antes de clicar em "Esqueci minha senha".');
    onForgotPassword(email);
  });

  // Links para trocar entre tela de login e cadastro
  document.getElementById('go-to-signup-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('signup-section');
  });

  document.getElementById('go-to-login-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('login-section');
  });
}

export function renderOnboarding({ onCreated }) {
  showScreen('onboarding-section');

  const form = document.getElementById('onboarding-form');
  // Remove listener antigo antes de religar (evita duplicar submits)
  const novoForm = form.cloneNode(true);
  form.parentNode.replaceChild(novoForm, form);

  novoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('onboarding-nome').value.trim();
    const cidade = document.getElementById('onboarding-cidade').value.trim();
    const logoFile = document.getElementById('onboarding-logo').files[0];

    if (!nome) return alert('Informe o nome do estabelecimento.');

    const btn = document.getElementById('onboarding-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Criando...';

    try {
      const { supabase } = await import('../../api/supabaseClient.js');
      const { data: { session } } = await supabase.auth.getSession();
      const { AuthAPI } = await import('../../api/auth.js');
      const estabelecimento = await AuthAPI.criarEstabelecimento({
        nome, cidade, logoFile, userId: session.user.id,
      });
      onCreated(estabelecimento);
    } catch (err) {
      alert('Erro ao criar estabelecimento: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Criar estabelecimento';
    }
  });
}

export function renderTenantSelector(vinculos, onSelect) {
  showScreen('tenant-selector-section');
  const grid = document.getElementById('tenant-selector-grid');

  grid.innerHTML = vinculos.map((v, i) => `
    <button class="tenant-card" data-index="${i}" type="button">
      <img src="${v.estabelecimentos.logo_url || './image/default-logo.png'}" alt="${v.estabelecimentos.nome}" />
      <span class="tenant-card-name">${v.estabelecimentos.nome}</span>
      <span class="tenant-card-city">${v.estabelecimentos.cidade || ''}</span>
      <span class="tenant-card-role">${v.role}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.tenant-card').forEach(btn => {
    btn.addEventListener('click', () => onSelect(vinculos[Number(btn.dataset.index)]));
  });
}
