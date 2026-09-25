# Auditoria Balcão — Pão Delícia (GitHub Pages + Firebase)

Mesmo padrão do MeuRH, MeuNutri e MeuPsi: HTML único (`index.html`), hospedado
no GitHub Pages, com Firebase como backend (Auth + Firestore). Sem build,
sem framework, sem servidor próprio.

## O que já está pronto no `index.html`

- Tela de login (Firebase Auth, e-mail/senha) — acesso único da equipe.
- Checklist de auditoria (Manhã/Tarde), validação e cálculo de conformidade.
- Histórico e Dashboard lendo em tempo real do Firestore (qualquer pessoa
  que auditar, em qualquer dispositivo, aparece pra todo mundo na hora).
- Aba de Escalas e Atribuições (referência fixa).

Falta só plugar as chaves do seu projeto Firebase (passo 2 abaixo).

## Passo 1 — Criar o projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) → **Adicionar projeto** → dê um nome (ex. `pao-delicia-auditoria`).
2. No menu lateral, vá em **Build → Authentication** → aba **Sign-in method** → ative o provedor **E-mail/senha**.
3. Ainda em Authentication, aba **Users** → **Add user** → cadastre o e-mail e senha únicos que a equipe vai usar para entrar no app (ex. `balcao@paodelicia.com.br`).
4. No menu lateral, vá em **Build → Firestore Database** → **Criar banco de dados** → escolha a região mais próxima (ex. `southamerica-east1`) → comece em **modo de produção**.
5. Na aba **Regras** do Firestore, cole isto e publique (só usuários logados podem ler/gravar):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /auditorias/{docId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## Passo 2 — Pegar as chaves e colar no `index.html`

1. No console do Firebase, clique na engrenagem → **Configurações do projeto**.
2. Em **Seus apps**, clique no ícone `</>` (Web) para registrar um app (não precisa de Hosting do Firebase, só o app Web).
3. Copie o objeto `firebaseConfig` que aparece.
4. Abra o `index.html` que te enviei, procure por `const firebaseConfig = {` (perto do fim do arquivo) e substitua pelos valores reais:

   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
   };
   ```

## Passo 3 — Subir para o GitHub

```bash
cd gh_pages_deploy
git init
git add .
git commit -m "Webapp de auditoria diaria - balcao"
git branch -M main
git remote add origin https://github.com/joaovitorriaurosa2003-ship-it/auditoria-balcao.git
git push -u origin main
```

(Troque o nome do repositório se quiser outro; crie-o vazio antes em github.com/new.)

## Passo 4 — Ativar o GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, escolha a branch `main` e a pasta `/ (root)`.
3. Salve. Em alguns minutos o site fica no ar em `https://joaovitorriaurosa2003-ship-it.github.io/auditoria-balcao/`.

## Passo 5 — Domínio próprio (opcional)

1. No mesmo painel **Settings → Pages**, em **Custom domain**, digite seu domínio (ex. `auditoria.paodelicia.com.br`) e salve. O GitHub cria automaticamente um arquivo `CNAME` no repositório.
2. No painel do seu provedor de domínio, crie um registro **CNAME** apontando esse subdomínio para `joaovitorriaurosa2003-ship-it.github.io`.
   - Se for usar o domínio raiz (sem `www`), em vez de CNAME crie 4 registros **A** apontando para os IPs do GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
3. Volte em Settings → Pages e marque **Enforce HTTPS** assim que o certificado for emitido (leva alguns minutos a algumas horas).

## Resumo do fluxo de dados

- **Login**: Firebase Auth, um único usuário/senha para a equipe do balcão.
- **Dados**: cada auditoria vira um documento na coleção `auditorias` do Firestore, com id `AAAA-MM-DD_Turno` (um documento por data+turno, sobrescreve se reenviar o mesmo dia/turno).
- **Sincronização**: o app escuta o Firestore em tempo real (`onSnapshot`), então histórico e dashboard atualizam sozinhos assim que alguém salva uma nova auditoria, em qualquer dispositivo.

## Próximos ajustes possíveis

- Logo da Kaluf & Gomes e da Pão Delícia no topo do menu lateral — me envie os arquivos de imagem (PNG/SVG) e eu embuto como base64 no `index.html`, sem precisar de servidor de imagens.
- Login individual por colaborador (em vez de um único usuário compartilhado), se decidir mudar depois.
- GitHub Actions para lint/checagem automática a cada push, se quiser um pipeline mais robusto.
