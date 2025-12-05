# 🚗 Veículos - Plataforma de Compra e Venda

Plataforma web moderna e elegante para publicação e visualização de anúncios de veículos.

## ✨ Características

### Design Premium
- 🎨 Dark mode com paleta de cores vibrantes
- 💎 Glassmorphism e gradientes modernos
- ⚡ Micro-animações e transições suaves
- 📱 Totalmente responsivo (mobile-first)

### Funcionalidades Principais

#### Página Inicial
- Hero section impactante com animações
- Grid de veículos em destaque
- Header sticky com glassmorphism
- Design premium e profissional

#### Fluxo de Publicação Completo
- 📝 Formulário multi-seção organizado
- 🔍 Validação de campos obrigatórios
- 👁️ Pré-visualização do anúncio antes de publicar
- 📊 Informações detalhadas:
  - Dados básicos (marca, modelo, ano, preço)
  - Detalhes técnicos (quilometragem, combustível, transmissão, cor)
  - Descrição completa
  - Contato (telefone/WhatsApp)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm start
```

O site estará disponível em `http://localhost:3000` (ou 3001 se 3000 estiver ocupado)

## 📁 Estrutura do Projeto

```
Veiculos/
├── src/
│   └── app/
│       ├── layout.tsx          # Layout principal com fonts
│       ├── page.tsx             # Página inicial
│       ├── page.module.css      # Estilos da home
│       ├── globals.css          # Design system e variáveis
│       └── publicar/
│           ├── page.tsx         # Página de publicação
│           └── publicar.module.css  # Estilos da publicação
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🎨 Design System

### Paleta de Cores
- **Background**: Dark mode premium (#0a0a0f, #16161d, #1e1e28)
- **Acentos**: Gradientes vibrantes (Indigo #6366f1 → Purple #8b5cf6)
- **Texto**: Hierarquia clara (Primary, Secondary, Muted)

### Tipografia
- Fonte: **Inter** (Google Fonts)
- Pesos: 300-800 para máxima versatilidade

### Espaçamento
- Sistema consistente (xs: 0.5rem → xl: 3rem)

### Transições
- Fast: 150ms (hover states)
- Base: 250ms (animações gerais)
- Slow: 350ms (transições complexas)

## 🔄 Próximos Passos

### Backend & Persistência
- [ ] Integração com banco de dados
- [ ] API para CRUD de veículos
- [ ] Sistema de autenticação

### Upload de Imagens
- [ ] Implementar upload real de fotos
- [ ] Galeria de imagens na visualização
- [ ] Compressão e otimização automática

### Funcionalidades Avançadas
- [ ] Sistema de busca e filtros
- [ ] Página de detalhes do veículo
- [ ] Favoritos e comparação
- [ ] Chat ou sistema de mensagens
- [ ] Integração com WhatsApp

### SEO & Performance
- [ ] Meta tags dinâmicas
- [ ] Sitemap automático
- [ ] Lazy loading de imagens
- [ ] PWA (Progressive Web App)

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilos**: CSS Modules + Vanilla CSS
- **React**: 18
- **Node**: 20+

## 📝 Notas de Desenvolvimento

- Projeto configurado com TypeScript para type safety
- CSS Modules para escopo local de estilos
- Design system com CSS Variables para fácil manutenção
- Componentes funcionais com React Hooks
- Estado local (useState) - pronto para migrar para Context/Redux se necessário

## 📸 Screenshots

O projeto inclui demonstrações visuais do fluxo completo:
- Home page com veículos em destaque
- Formulário de publicação
- Pré-visualização do anúncio

---

**Desenvolvido com ❤️ usando Next.js**
