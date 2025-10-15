# SOLUCIÓN RÁPIDA - Acceso al Dashboard en Vercel

## ✅ Paso 1: Verificar Variables de Entorno

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**

Asegúrate que existan EXACTAMENTE estas variables:

```
ALLOW_DEMO_LOGIN=true
DEV_MODE=true
NEXT_PUBLIC_DEV_MODE=true
AUTH_SECRET=cualquier-string-aqui-123456
STRIPE_SECRET_KEY=sk_test_51xxxYOUR_STRIPE_TEST_KEY_HERExxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxYOUR_STRIPE_PUBLISHABLE_KEY_HERExxx
STRIPE_PRICE_ID=price_1xxxYOUR_PRICE_ID_HERExxx
```

⚠️ **IMPORTANTE:**
- `ALLOW_DEMO_LOGIN=true` - Permite el acceso demo en producción
- Si `NEXT_PUBLIC_DEV_MODE` no existe, los botones no aparecerán (pero `/dev-access` siempre funciona)

---

## ✅ Paso 2: Redeploy

Después de agregar/verificar las variables:

1. Ve a **Deployments**
2. Click en el último deployment
3. Click **"Redeploy"** (botón con tres puntos ⋯)
4. Selecciona **"Redeploy"** nuevamente
5. Espera que termine (1-2 minutos)

---

## ✅ Paso 3: Verificar que Funcionó

Una vez desplegado, abre tu URL de Vercel y:

1. Abre la consola del navegador (F12)
2. Escribe: `console.log(process.env.NEXT_PUBLIC_DEV_MODE)`
3. Debería mostrar: `"true"`

Si muestra `undefined` o `"false"`, las variables no se aplicaron correctamente.

---

## 🔧 Si el Botón AÚN No Aparece

### Opción A: Acceso Directo por URL

Simplemente ve a esta URL (reemplaza con tu dominio):

```
https://tu-app.vercel.app/api/auth/dev-login
```

Y agrega esto en la consola del navegador:

```javascript
fetch('/api/auth/dev-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'demo@buzentry.com' })
})
.then(res => res.json())
.then(() => window.location.href = '/dashboard')
```

---

### Opción B: Crear Página de Acceso Directo

Ve a tu app y navega manualmente a:

```
https://tu-app.vercel.app/login
```

Luego abre la consola del navegador y ejecuta:

```javascript
fetch('/api/auth/dev-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'demo@buzentry.com' })
})
.then(() => window.location.href = '/dashboard')
```

Esto te logueará y te llevará al dashboard.

---

## 🚨 Troubleshooting

### "Variables no se aplican"

1. Asegúrate que las variables estén en **"Production"** environment
2. Después de agregarlas, DEBES hacer **Redeploy**
3. Las variables NO se aplican hasta que redeployes

### "Botón no aparece pero variables están bien"

1. Hard refresh: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
2. Limpia caché del navegador
3. Prueba en ventana incógnito
4. Verifica en consola: `process.env.NEXT_PUBLIC_DEV_MODE`

### "Error 401 Unauthorized"

Agrega también:
```
AUTH_SECRET=my-secret-key-12345
```

Y redeploy.

---

## ✅ Test Final

Una vez que hayas:
1. ✅ Agregado todas las variables
2. ✅ Hecho Redeploy
3. ✅ Esperado que termine

Deberías ver:
- Botón verde en homepage: "🚀 Quick Demo"
- Botón azul en /login: "🚀 Quick Demo Login"

Click → Dashboard instantáneo!
