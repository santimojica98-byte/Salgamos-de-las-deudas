# 💚 Libertad Financiera — Dashboard Familiar

App web para control de deudas familiares con IA, simulador, calendario y sincronización con Google Sheets.

## 🚀 Deploy en Vercel (5 minutos)

### Opción A: GitHub + Vercel (Recomendado)

1. **Sube a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: libertad financiera dashboard"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/libertad-financiera.git
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - "Add New Project" → importa tu repo
   - Framework: **Other**
   - Build command: *(dejar vacío)*
   - Output directory: *(dejar vacío o `.`)*
   - Click **Deploy** ✅

3. **Tu app estará en:** `https://libertad-financiera.vercel.app`

### Opción B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## ⚙️ Configurar Google Apps Script (guarda pagos en la nube)

1. Abre tu Google Sheet
2. **Extensions → Apps Script**
3. Borra el código existente
4. Copia y pega el contenido de `apps-script.js`
5. Guarda (Ctrl+S)
6. **Deploy → New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy** → Authorize → **Copia la URL**
8. En la app, pega esa URL en el campo **"🔗 Apps Script URL"**

---

## 📱 Funcionalidades

| Feature | Descripción |
|---------|-------------|
| 📊 Dashboard | Relojes de progreso por categoría + resumen global |
| 📈 Gráfico evolución | Curva de reducción de deuda mes a mes |
| 📅 Calendario | Pagos organizados por fecha + próximos vencimientos |
| ⚡ Simulador IA | Calcula cuándo terminas con abono extra (Avalancha / Bola de nieve) |
| 🤖 IA Consejera | Chat con análisis de tus deudas y recomendaciones |
| 🔔 Recordatorios | Notificaciones del navegador para pagos próximos |
| ☁️ Nube | Sincronización bidireccional con Google Sheets |
| 💾 Local | Datos guardados en localStorage como respaldo |
| 🌐 PWA | Instalable en el celular como app nativa |

---

## 💳 Categorías de deuda

| Código | Significado |
|--------|-------------|
| T. ANG | Tarjetas Angela |
| C. ANG | Créditos Angela |
| C. EXT | Créditos Externos |
| T. EXT | Tarjetas Externas |

---

## 🏗 Estructura del proyecto

```
libertad-financiera/
├── index.html          # HTML principal con todas las tabs
├── styles.css          # Estilos completos
├── app.js              # Lógica JavaScript (dashboard, IA, simulador, calendario)
├── apps-script.js      # Código para Google Apps Script
├── manifest.json       # PWA manifest
├── vercel.json         # Configuración de deploy
└── README.md           # Este archivo
```

---

## 🔧 Actualizar datos de deudas

Los datos están en `app.js` en el array `CATEGORIES`. Para actualizar saldos:

```javascript
const CATEGORIES = [
  { name:'Tarjetas ANG', color:'#2dba7c', icon:'💳', debts:[
    {name:'Rappi', cuota:2900000, saldo:11000000, dueDay:5},
    // Actualiza saldo aquí ↑
  ]},
  // ...
];
```

También puedes actualizar las tasas de interés en `RATES`:
```javascript
const RATES = {
  'Rappi': 0.36, // 36% anual
  // ...
};
```

---

## 📊 Google Sheets esperada

La app crea automáticamente dos hojas nuevas en tu spreadsheet:
- **`Pagos_App`** — historial de todos los pagos registrados desde la app
- **`Resumen_App`** — resumen con total pagado y número de transacciones

---

Hecho con 💚 · 2025–2026
