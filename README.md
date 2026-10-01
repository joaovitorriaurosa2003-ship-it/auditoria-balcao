# Auditoria Balcão · Pão Delícia

App de celular (PWA) para a auditoria diária do balcão da Pão Delícia.
HTML único hospedado no GitHub Pages, com Firebase Auth (login da equipe) e Firestore (dados em tempo real).

Site: https://joaovitorriaurosa2003-ship-it.github.io/auditoria-balcao/

## Telas

- **Início**: status da auditoria de hoje (Manhã e Tarde), indicadores gerais, evolução da conformidade, ranking por responsável e itens mais reprovados.
- **Auditoria**: checklist em etapas (turno e responsável, uma página por categoria, revisão final com o percentual de conformidade).
- **Histórico**: lista filtrável por turno, responsável e itens críticos, com o detalhe completo de cada auditoria.

## Instalar no celular

- **Android (Chrome)**: abra o site e toque em "Instalar" no cartão da tela inicial do app, ou no menu ⋮ > "Instalar app".
- **iPhone (Safari)**: toque em Compartilhar > "Adicionar à Tela de Início".

## Estrutura

```
index.html      app completo (HTML, CSS e JS)
manifest.json   dados do app instalável (nome, cores, ícones)
sw.js           service worker (necessário para instalar)
icons/          ícones do app
assets/         logos Pão Delícia e Kaluf & Gomes
```

## Dados (Firestore)

Coleção `auditorias`, um documento por data e turno (id `AAAA-MM-DD_Turno`), com os campos
`data`, `turno`, `responsavel`, `respostas`, `pct`, `criticosNao`, `criadoEm`.
Salvar de novo a mesma data e turno substitui o registro anterior (o app avisa antes).

Regra de segurança: só usuários autenticados leem e gravam em `/auditorias`.

---
Desenvolvido por João Vitor Riau Rosa, Psicólogo Organizacional, CRP 06/227336 · Kaluf & Gomes Soluções Empresariais
