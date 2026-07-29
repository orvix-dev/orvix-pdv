// js/modules/authFlow.js
// Orquestra login (Google ou Email/Senha), cadastro, e resolução de tenant.

import { AuthAPI } from '../api/auth.js';
import { state } from './state.js';
import {
  showScreen,
  renderTenantSelector,
  renderOnboarding,
  bindLoginScreenEvents,
} from './ui/authScreens.js';
import { bootApp } from './appBoot.js';

export async function initAuthFlow() {
  // Liga os botões/formulários da tela de login/cadastro uma única vez.
  bindLoginScreenEvents({
    onGoogleClick: () => AuthAPI.signInWithGoogle().catch(showAuthError),
    onLoginSubmit: async (email, password) => {
      try {
        await AuthAPI.signInWithEmail(email, password);
      } catch (err) {
        showAuthError(err);
      }
    },
    onSignupSubmit: async (email, password) => {
      try {
        await AuthAPI.signUpWithEmail(email, password);
        alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta (se a confirmação estiver habilitada) e faça login.');
        showScreen('login-section');
      } catch (err) {
        showAuthError(err);
      }
    },
    onForgotPassword: async (email) => {
      try {
        await AuthAPI.resetPassword(email);
        alert('Enviamos um link de redefinição de senha para o seu e-mail.');
      } catch (err) {
        showAuthError(err);
      }
    },
  });

  // Logout disponível na tela de onboarding
  document.getElementById('onboarding-logout-link')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await AuthAPI.signOut();
    localStorage.removeItem('ultimoEstabelecimentoId');
    window.location.reload();
  });

  AuthAPI.onAuthStateChange(async (session) => {
    state.session = session;

    if (!session) {
      showScreen('login-section');
      return;
    }

    state.currentUser = session.user;

    let vinculos = [];
    try {
      vinculos = await AuthAPI.getVinculos(session.user.id);
    } catch (err) {
      showAuthError(err);
      return;
    }
    state.vinculos = vinculos;

    if (vinculos.length === 0) {
      renderOnboarding({ onCreated: (estabelecimento) => selecionarEstabelecimento(estabelecimento, 'dono') });
      return;
    }

    if (vinculos.length === 1) {
      selecionarEstabelecimento(vinculos[0].estabelecimentos, vinculos[0].role);
      return;
    }

    const ultimoId = localStorage.getItem('ultimoEstabelecimentoId');
    const lembrado = vinculos.find(v => v.estabelecimento_id === ultimoId);

    if (lembrado) {
      selecionarEstabelecimento(lembrado.estabelecimentos, lembrado.role);
    } else {
      renderTenantSelector(vinculos, (vinculo) => {
        selecionarEstabelecimento(vinculo.estabelecimentos, vinculo.role);
      });
    }
  });
}

function selecionarEstabelecimento(estabelecimento, role) {
  state.estabelecimento = estabelecimento;
  state.currentRole = role;
  localStorage.setItem('ultimoEstabelecimentoId', estabelecimento.id);
  showScreen('app-shell');
  bootApp();
}

function showAuthError(err) {
  console.error(err);
  alert('Erro: ' + (err?.message || 'Falha ao autenticar. Tente novamente.'));
}

export function trocarEstabelecimento() {
  localStorage.removeItem('ultimoEstabelecimentoId');
  window.location.reload();
}
