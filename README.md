# PDV Multi-Loja — Correção de Login + Cadastro (Supabase)

## O que estava causando o bug

O login aparecia "no canto superior direito sem formatação" porque:

1. O CSS das telas de autenticação (`.login-card`, `.auth-screen`) dependia de
   variáveis (`var(--bg)`, `var(--surface-2)`, etc.) definidas no `style.css`
   original, que provavelmente não tinham essas variáveis — por isso a tela
   ficava sem cor de fundo, sem centralização, "flutuando" no canto.
2. O botão do Google não tinha o `type="button"` nem preventDefault,
   então o clique podia disparar submit de formulário sem ação real.
3. Não existia handler algum para login/cadastro por e-mail e senha.

## O que foi corrigido nesta versão

- Criado `auth-styles.css` **autossuficiente** (não depende de nenhuma
  variável do seu style.css atual) — garante fundo, centralização e
  cartão estilizado mesmo que o style.css tenha conflitos.
- `position: fixed; inset: 0; z-index: 1000;` nas telas de auth, para
  garantir que fiquem sempre cobrindo a tela inteira, independente do
  layout do restante do app.
- Botão do Google agora tem `type="button"` e `e.preventDefault()`, evitando
  comportamento de submit indesejado.
- Adicionado formulário de **login por e-mail/senha** (`#login-form`).
- Adicionada aba de **cadastro** completa (`#signup-section`), com
  confirmação de senha e link para voltar ao login.
- Adicionado link "Esqueci minha senha" (`resetPasswordForEmail`).
- Toda a lógica de troca de tela agora passa por uma única função
  `showScreen(id)`, eliminando bugs de telas sobrepostas.

## Estrutura de arquivos (atualizada)

```
public/
├── index.html            <- reescrito, com login + cadastro + onboarding + seletor
├── style.css              <- seu CSS original do PDV (mantido)
├── auth-styles.css        <- NOVO: estilos das telas de autenticação (autossuficiente)
├── js/
│   ├── main.js
│   ├── api/
│   │   ├── supabaseClient.js   <- ATENÇÃO: preencha SUPABASE_URL e SUPABASE_ANON_KEY
│   │   ├── auth.js             <- agora com signInWithEmail, signUpWithEmail, resetPassword
│   │   ├── sales.js
│   │   ├── products.js
│   │   ├── expenses.js
│   │   └── openOrders.js
│   └── modules/
│       ├── state.js
│       ├── authFlow.js         <- reescrito: liga eventos de login/cadastro
│       ├── appBoot.js
│       ├── cart.js
│       ├── sales.js
│       ├── realtime.js
│       ├── events.js
│       └── ui/
│           ├── authScreens.js  <- reescrito: showScreen() + bindLoginScreenEvents()
│           ├── render.js
│           ├── notifications.js
│           └── receipt.js
```

## Passo a passo para testar localmente

1. Preencha `js/api/supabaseClient.js` com a URL e a anon key do seu projeto Supabase.
2. No painel Supabase, habilite:
   - Authentication > Providers > Email (para login por e-mail/senha) — já vem
     habilitado por padrão.
   - Authentication > Providers > Google (para login social) — configure o
     Client ID/Secret do Google Cloud Console.
3. Sirva a pasta `public/` com um servidor local (necessário por causa dos módulos ES):
   ```
   npx serve public
   ```
   ou
   ```
   python -m http.server --directory public 5500
   ```
4. Abra no navegador — a tela de login já deve aparecer centralizada, estilizada,
   com botão Google funcional e formulário de e-mail/senha abaixo.

## Importante sobre confirmação de e-mail

Por padrão, o Supabase exige confirmação de e-mail antes do primeiro login
funcionar. Se quiser testar rapidamente sem esse passo, desative em:
Authentication > Providers > Email > "Confirm email" (desmarcar), apenas
em ambiente de desenvolvimento.
