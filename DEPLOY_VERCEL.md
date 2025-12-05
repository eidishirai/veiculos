# 🚀 Guia de Deploy na Vercel - Sistema de Veículos

## 📋 Pré-requisitos

Antes de começar, você precisa ter:
- ✅ Conta no GitHub (já feito!)
- ✅ Repositório no GitHub (já feito!)
- ✅ Conta no Firebase
- ✅ Conta no Cloudinary (opcional, para upload de imagens)

---

## 🔥 Passo 1: Configurar Firebase

### 1.1 Criar Projeto Firebase
1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `veiculos-revenda` (ou o nome que preferir)
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 1.2 Configurar Firestore Database
1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Iniciar no modo de produção"**
4. Selecione a localização: **`southamerica-east1` (São Paulo)**
5. Clique em **"Ativar"**

### 1.3 Configurar Storage (para imagens)
1. No menu lateral, clique em **"Storage"**
2. Clique em **"Começar"**
3. Aceite as regras padrão
4. Escolha a mesma localização: **`southamerica-east1`**
5. Clique em **"Concluído"**

### 1.4 Obter Credenciais do Firebase
1. Clique no ícone de **engrenagem** ⚙️ ao lado de "Visão geral do projeto"
2. Clique em **"Configurações do projeto"**
3. Role até **"Seus aplicativos"**
4. Clique no ícone **`</>`** (Web)
5. Apelido do app: `veiculos-web`
6. **NÃO** marque "Firebase Hosting"
7. Clique em **"Registrar app"**
8. **COPIE** todas as credenciais que aparecerem:
   ```javascript
   apiKey: "AIza..."
   authDomain: "seu-projeto.firebaseapp.com"
   projectId: "seu-projeto"
   storageBucket: "seu-projeto.appspot.com"
   messagingSenderId: "123456789"
   appId: "1:123456789:web:abc123"
   ```

### 1.5 Configurar Regras de Segurança

#### Firestore Rules:
1. Vá em **Firestore Database** > **Regras**
2. Cole o seguinte código:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vehicles/{vehicleId} {
      allow read: if true;
      allow write: if true; // ATENÇÃO: Adicione autenticação em produção!
    }
  }
}
```
3. Clique em **"Publicar"**

#### Storage Rules:
1. Vá em **Storage** > **Regras**
2. Cole o seguinte código:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /vehicles/{allPaths=**} {
      allow read: if true;
      allow write: if true; // ATENÇÃO: Adicione autenticação em produção!
    }
  }
}
```
3. Clique em **"Publicar"**

---

## ☁️ Passo 2: Configurar Cloudinary (Opcional - para upload otimizado)

### 2.1 Criar Conta
1. Acesse: https://cloudinary.com/users/register/free
2. Preencha o formulário e crie sua conta
3. Confirme seu email

### 2.2 Obter Credenciais
1. Acesse o **Dashboard**: https://console.cloudinary.com/
2. Copie o **Cloud Name** (exemplo: `dxyz123abc`)
3. Vá em **Settings** > **Upload**
4. Role até **Upload presets**
5. Clique em **"Add upload preset"**
6. Nome: `veiculos-upload`
7. Signing Mode: **"Unsigned"**
8. Folder: `veiculos`
9. Clique em **"Save"**
10. Copie o nome do preset: `veiculos-upload`

---

## 🌐 Passo 3: Deploy na Vercel

### 3.1 Criar Conta na Vercel
1. Acesse: https://vercel.com/signup
2. Clique em **"Continue with GitHub"**
3. Autorize a Vercel a acessar seus repositórios

### 3.2 Importar Projeto
1. No dashboard da Vercel, clique em **"Add New..."** > **"Project"**
2. Encontre o repositório **`veiculos`**
3. Clique em **"Import"**

### 3.3 Configurar Variáveis de Ambiente
1. Na tela de configuração, role até **"Environment Variables"**
2. Adicione as seguintes variáveis (uma por uma):

**Firebase:**
```
NEXT_PUBLIC_FIREBASE_API_KEY = [Sua API Key do Firebase]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = [seu-projeto.firebaseapp.com]
NEXT_PUBLIC_FIREBASE_PROJECT_ID = [seu-projeto-id]
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = [seu-projeto.appspot.com]
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [123456789]
NEXT_PUBLIC_FIREBASE_APP_ID = [1:123456789:web:abc123]
```

**Cloudinary (se estiver usando):**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = [seu-cloud-name]
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = [veiculos-upload]
```

### 3.4 Fazer Deploy
1. Após adicionar todas as variáveis, clique em **"Deploy"**
2. Aguarde 2-3 minutos enquanto a Vercel faz o build
3. ✅ Pronto! Seu site estará no ar!

---

## 🎯 Passo 4: Acessar e Testar

### 4.1 URL do Site
A Vercel vai gerar uma URL automática:
```
https://veiculos-[seu-usuario].vercel.app
```

### 4.2 Testar Funcionalidades
1. **Homepage**: Deve carregar normalmente
2. **Admin Panel**: Acesse `/admin/estoque`
3. **Cadastrar Veículo**: Acesse `/publicar`
4. **Teste o upload**: Tente cadastrar um veículo com foto

### 4.3 Domínio Personalizado (Opcional)
1. No dashboard do projeto na Vercel
2. Vá em **"Settings"** > **"Domains"**
3. Adicione seu domínio personalizado
4. Siga as instruções para configurar DNS

---

## 🔧 Passo 5: Configurações Adicionais (Recomendado)

### 5.1 Adicionar Autenticação (Segurança)
Para proteger o admin panel, você pode:
1. Usar Firebase Authentication
2. Ou adicionar uma senha simples no código

### 5.2 Configurar CORS no Firebase
Se tiver problemas de CORS:
1. Instale o Google Cloud SDK
2. Execute:
```bash
gsutil cors set cors.json gs://[seu-bucket].appspot.com
```

Onde `cors.json` contém:
```json
[
  {
    "origin": ["https://veiculos-[seu-usuario].vercel.app"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

---

## 📝 Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Firebase configurado e funcionando
- [ ] Variáveis de ambiente adicionadas na Vercel
- [ ] Site acessível pela URL da Vercel
- [ ] Consegue cadastrar veículos
- [ ] Consegue fazer upload de imagens
- [ ] Admin panel acessível
- [ ] Página de detalhes do veículo funcionando
- [ ] Busca e filtros funcionando

---

## 🆘 Problemas Comuns

### Erro: "Firebase not initialized"
- Verifique se todas as variáveis de ambiente foram adicionadas corretamente
- Certifique-se de que começam com `NEXT_PUBLIC_`

### Erro: "Storage bucket not configured"
- Verifique se o Storage foi ativado no Firebase
- Confirme o nome do bucket nas variáveis de ambiente

### Imagens não carregam
- Verifique as regras de Storage
- Confirme se o CORS está configurado

### Build falha na Vercel
- Verifique os logs de build
- Certifique-se de que não há erros de TypeScript

---

## 🎉 Pronto!

Seu sistema de veículos está no ar! 🚀

**Próximos passos sugeridos:**
1. Adicionar autenticação para proteger o admin
2. Configurar domínio personalizado
3. Adicionar Google Analytics
4. Implementar SEO otimizado
5. Adicionar PWA (Progressive Web App)

---

**Precisa de ajuda?** Me chame! 😊
