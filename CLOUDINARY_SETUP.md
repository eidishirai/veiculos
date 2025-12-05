# Guia de Configuração do Cloudinary (100% GRATUITO)

## Por que Cloudinary?

- ✅ **25 GB de armazenamento gratuito** (vs 5GB do Firebase)
- ✅ **25 GB de bandwidth/mês**
- ✅ **Transformações de imagem** (resize, crop, otimização)
- ✅ **CDN global** (imagens rápidas em qualquer lugar)
- ✅ **Sem cartão de crédito necessário**
- ✅ **Gratuito para sempre**

## Passo 1: Criar Conta no Cloudinary

1. Acesse [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Preencha o formulário:
   - Email
   - Senha
   - Nome da conta (pode ser o nome da sua revenda)
3. **NÃO é necessário cartão de crédito**
4. Confirme o email

## Passo 2: Obter as Credenciais

1. Após fazer login, você será redirecionado para o **Dashboard**
2. Na parte superior, você verá:
   ```
   Cloud Name: seu_cloud_name
   API Key: 123456789012345
   API Secret: xxxxxxxxxxxxxxxxx
   ```
3. **Anote o `Cloud Name`** (você vai precisar)

## Passo 3: Criar um Upload Preset (Unsigned)

Para permitir upload direto do browser sem expor segredos:

1. No menu lateral, vá em **Settings** (ícone de engrenagem)
2. Clique na aba **Upload**
3. Role até **Upload presets**
4. Clique em **Add upload preset**
5. Configure:
   - **Preset name**: `veiculos_preset` (ou qualquer nome)
   - **Signing Mode**: Selecione **Unsigned** ⚠️ IMPORTANTE
   - **Folder**: `vehicles` (opcional, para organizar)
   - **Use filename**: Marque se quiser manter o nome original
6. Clique em **Save**
7. **Anote o nome do preset** (ex: `veiculos_preset`)

## Passo 4: Configurar as Variáveis de Ambiente

1. Copie o `.env.example` para `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

2. Abra o `.env.local` e preencha as variáveis do Cloudinary:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=veiculos_preset
   ```

3. **Exemplo completo**:
   ```
   # Firebase (apenas Firestore para dados)
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=veiculos-premium.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=veiculos-premium
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=veiculos-premium.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

   # Cloudinary (upload de imagens - GRATUITO)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=minha-revenda
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=veiculos_preset
   ```

4. **Reinicie o servidor**:
   ```bash
   # Pare o servidor (Ctrl+C) e rode novamente:
   npm run dev
   ```

## Passo 5: Testar o Upload

1. Acesse `http://localhost:3001/publicar`
2. Preencha os dados de um veículo
3. Selecione algumas fotos
4. Clique em "Publicar Agora"
5. Verifique:
   - **Cloudinary Dashboard**: Vá em **Media Library** e veja as imagens na pasta `vehicles`
   - **Firestore**: Os dados do veículo com as URLs do Cloudinary

## Otimizações Automáticas do Cloudinary

O Cloudinary já otimiza automaticamente as imagens:
- Compressão inteligente
- Formato WebP quando o browser suporta
- Lazy loading
- Responsive images

### Exemplo de URL gerada:
```
https://res.cloudinary.com/minha-revenda/image/upload/v1234567890/vehicles/porsche911.jpg
```

### Transformações on-the-fly (opcional):
Você pode adicionar parâmetros na URL para transformar a imagem:

```
# Redimensionar para 800px de largura
https://res.cloudinary.com/minha-revenda/image/upload/w_800/v1234567890/vehicles/porsche911.jpg

# Thumbnail 200x200
https://res.cloudinary.com/minha-revenda/image/upload/w_200,h_200,c_fill/v1234567890/vehicles/porsche911.jpg
```

## Limites do Plano Gratuito

- **Armazenamento**: 25 GB
- **Bandwidth**: 25 GB/mês
- **Transformações**: 25.000/mês
- **Vídeos**: 500 MB

### Estimativa para Revenda:
- **1.000 carros** × 10 fotos × 200KB = **2 GB** ✅
- **10.000 visualizações/mês** × 200KB = **2 GB bandwidth** ✅

**Conclusão**: Você está muito dentro do limite! 🎉

## Segurança

Como estamos usando **Unsigned Upload Preset**:
- ✅ Qualquer um pode fazer upload (mas só através do seu site)
- ⚠️ Em produção, considere adicionar **Upload Restrictions**:
  - Limitar tamanho máximo (ex: 5MB)
  - Limitar formatos (jpg, png, webp)
  - Adicionar rate limiting

Para configurar restrições:
1. Vá no Upload Preset
2. Em **Upload Restrictions**, configure:
   - Max file size: 5 MB
   - Allowed formats: jpg, png, webp

## Próximos Passos

1. ✅ Configure o Cloudinary
2. ✅ Configure o Firebase (apenas Firestore)
3. ✅ Teste o upload
4. 🚀 Comece a cadastrar veículos!

## Suporte

- Documentação: https://cloudinary.com/documentation
- Dashboard: https://cloudinary.com/console
