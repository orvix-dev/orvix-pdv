# PDV Multi-Loja

## Como foi desenvolvido

Este projeto foi desenvolvido como um sistema de Ponto de Venda (PDV) focado em atender múltiplas lojas simultaneamente, proporcionando uma gestão centralizada.

A arquitetura do projeto foi construída utilizando as seguintes tecnologias e conceitos:

- **Frontend:** Desenvolvido com HTML5, CSS3 e JavaScript puro (ES6 Modules - Vanilla JS), sem a utilização de frameworks pesados, garantindo alta performance, flexibilidade e um carregamento rápido.
- **Backend e Banco de Dados:** A infraestrutura de backend foi construída sobre o **Supabase** (Backend-as-a-Service). O Supabase é responsável por gerenciar a autenticação dos usuários (suportando login por e-mail/senha e Google OAuth), além de fornecer o banco de dados PostgreSQL para armazenar informações de vendas, produtos, despesas e configurações das lojas, tudo com suporte a atualizações em tempo real.
- **Estrutura Modular:** O código JavaScript foi arquitetado em módulos distintos, dividindo claramente as responsabilidades (ex: chamadas de API, controle de estado, renderização de UI, fluxos de autenticação). Isso facilita a manutenção, isolamento de escopo e futuras expansões do código.
- **Interface e UX:** Foram aplicadas práticas modernas de CSS para garantir que elementos críticos, como a tela de autenticação, fossem independentes e autossuficientes, evitando conflitos de estilos com o restante da aplicação.

## Planos Futuros

Para as próximas atualizações do sistema, planejamos implementar as seguintes funcionalidades e melhorias:

- **Gestão de Estoque Avançada:** Inclusão de alertas de estoque baixo, relatórios de movimentação e cálculo de custo médio de produtos.
- **Relatórios e Analytics Visuais:** Criação de dashboards gerenciais com gráficos para melhor visualização do faturamento, ranking de produtos mais vendidos e comparação de performance entre as diferentes lojas.
- **Suporte Offline-First (PWA):** Implementação de Service Workers e IndexedDB para permitir o funcionamento ininterrupto do PDV mesmo sem conexão com a internet, realizando a sincronização dos dados automaticamente assim que a conexão for restabelecida.
- **Módulo Financeiro Expandido:** Aprimoramento da seção de despesas para abranger fluxo de caixa completo, contas a pagar e receber, e conciliação bancária.
- **Integração com Hardware Específico:** Melhor suporte e integração direta com impressoras térmicas (para emissão de recibos) e leitores de código de barras, visando agilizar o processo de checkout no balcão de vendas.
- **Controle de Permissões (RBAC):** Adição de níveis de acesso (ex: Administrador, Gerente, Operador de Caixa) para restringir funcionalidades e visualização de dados de acordo com o cargo do funcionário logado.
