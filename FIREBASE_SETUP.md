# Guia de Configuração do Firebase

## Passo 1: Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" (ou "Add project")
3. Dê um nome ao projeto (ex: "veiculos-premium")
4. Desabilite o Google Analytics (opcional para começar)
5. Clique em "Criar projeto"

## Passo 2: Configurar o Firestore Database

1. No menu lateral, vá em **Build** > **Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha o modo de produção (Production mode)
4. Selecione a localização mais próxima (ex: `southamerica-east1` para São Paulo)
5. Clique em "Ativar"

### Regras de Segurança Iniciais

Por enquanto, para desenvolvimento, vá em "Regras" e use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vehicles/{document=**} {
      allow read: if true;  // Qualquer um pode ler
      allow write: if true; // Qualquer um pode escrever (MUDAR EM PRODUÇÃO!)
    }
  }
}
```

**IMPORTANTE**: Em produção, você deve adicionar autenticação e restringir o `write` apenas para usuários autenticados como admin.

## Passo 3: Configurar o Storage

1. No menu lateral, vá em **Build** > **Storage**
2. Clique em "Começar"
3. Aceite as regras padrão (modo de produção)
4. Escolha a mesma localização do Firestore
5. Clique em "Concluído"

### Regras de Segurança do Storage

Vá em "Regras" e use:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /vehicles/{allPaths=**} {
      allow read: if true;  // Qualquer um pode ler
      allow write: if true; // Qualquer um pode escrever (MUDAR EM PRODUÇÃO!)
    }
  }
}
```

## Passo 4: Obter as Credenciais

1. Vá em **Configurações do Projeto** (ícone de engrenagem ao lado de "Visão geral do projeto")
2. Role até "Seus apps" e clique no ícone **</>** (Web)
3. Dê um apelido ao app (ex: "veiculos-web")
4. **NÃO** marque "Configurar o Firebase Hosting"
5. Clique em "Registrar app"
6. Copie o objeto `firebaseConfig` que aparece

Exemplo:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "veiculos-premium.firebaseapp.com",
  projectId: "veiculos-premium",
  storageBucket: "veiculos-premium.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Passo 5: Configurar as Variáveis de Ambiente

1. Na raiz do projeto, copie o arquivo `.env.example` para `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

2. Abra o `.env.local` e preencha com os valores do `firebaseConfig`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=veiculos-premium.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=veiculos-premium
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=veiculos-premium.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```

3. **IMPORTANTE**: Reinicie o servidor Next.js após criar/editar o `.env.local`:
   ```bash
   # Pare o servidor (Ctrl+C) e rode novamente:
   npm run dev
   ```

## Passo 6: Testar a Integração

1. Acesse `http://localhost:3001/publicar`
2. Preencha os dados de um veículo
3. Selecione algumas fotos
4. Clique em "Publicar Agora"
5. Aguarde o upload (pode demorar alguns segundos)
6. Verifique no Firebase Console:
   - **Firestore**: Deve aparecer uma coleção `vehicles` com um documento
   - **Storage**: Deve aparecer uma pasta `vehicles` com as imagens

## Otimização de Imagens (Recomendado)

Para economizar espaço no Storage, considere:
- Redimensionar imagens para no máximo 1920px de largura
- Converter para WebP (melhor compressão)
- Usar bibliotecas como `sharp` ou `browser-image-compression`

## Custos (Plano Gratuito - Spark)

- **Firestore**: 1GB de armazenamento, 50k leituras/dia, 20k escritas/dia
- **Storage**: 5GB de armazenamento, 1GB de download/dia
- **Hosting**: 10GB de armazenamento, 360MB de download/dia

Para uma revenda com ~100 carros (10 fotos cada = 1000 fotos × 150KB = 150MB), você está **muito** dentro do limite gratuito.

## Próximos Passos (Segurança)

Quando for para produção:
1. Adicionar Firebase Authentication
2. Restringir regras do Firestore e Storage para apenas admins autenticados
3. Adicionar validação de dados no lado do servidor (Cloud Functions)
