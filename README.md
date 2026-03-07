# BACKSTAGE — Demo Agentes IA para Artistas Musicales

## Deploy en 5 minutos

### Paso 1: API Key de Anthropic
1. Entrá a https://console.anthropic.com
2. Creá cuenta o logueate
3. En "API Keys" → "Create Key" → copiá la key
4. Cargá crédito (con $5 USD alcanza para cientos de conversaciones)

### Paso 2: Subir a GitHub
```bash
cd backstage-demo
git init
git add .
git commit -m "BACKSTAGE demo"
```
Creá un repo nuevo en github.com y después:
```bash
git remote add origin https://github.com/TU_USUARIO/backstage-demo.git
git branch -M main
git push -u origin main
```

### Paso 3: Deploy en Vercel
1. Andá a https://vercel.com → logueate con GitHub
2. "New Project" → importá el repo backstage-demo
3. En "Environment Variables" agregá:
   - Key: `ANTHROPIC_API_KEY`
   - Value: (pegá tu API key)
4. Click "Deploy"

### Paso 4: Compartir
Vercel te da una URL como `backstage-demo.vercel.app`.
Esa URL la abre cualquier persona sin login ni cuenta.

### Dominio custom (opcional)
En Vercel → Settings → Domains → agregá tu dominio.

---

## Estructura del proyecto
```
backstage-demo/
├── pages/
│   ├── index.js        ← Frontend (onboarding + chat)
│   └── api/
│       └── chat.js     ← Backend (proxy a Claude API)
├── package.json
└── README.md
```

## Costo estimado
- Claude Sonnet API: ~$0.01-0.03 por conversación de 10 msgs
- Vercel: $0 (plan free)
- 100 conversaciones de demo: ~$1-3 USD total
