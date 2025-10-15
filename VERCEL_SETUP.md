# Setup Rápido para Vercel

## ✅ Configuración en 3 Pasos

### Paso 1: Agregar Variables de Entorno

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**

Agrega esta variable (MÍN IMO REQUERIDO):

```
ALLOW_DEMO_LOGIN=true
```

Esta variable habilita el acceso demo en `/dev-access`.

### Paso 2: (Opcional) Para botones en homepage y login

Si quieres que aparezcan los botones de demo en la homepage y página de login, agrega también:

```
NEXT_PUBLIC_DEV_MODE=true
```

### Paso 3: Redeploy

1. Ve a **Deployments**
2. Click en los 3 puntos ⋯ del último deployment
3. Click **"Redeploy"**
4. Espera 1-2 minutos

## 🚀 Cómo Acceder

Una vez desplegado, ve a:

```
https://tu-dominio.vercel.app/dev-access
```

Click en **"🚀 Quick Demo Access"** → Acceso instantáneo al dashboard!

## 📋 Variables Completas (Recomendadas)

Para máxima compatibilidad, configura todas estas:

```bash
# Requerida - Habilita acceso demo
ALLOW_DEMO_LOGIN=true

# Opcional - Muestra botones de demo
NEXT_PUBLIC_DEV_MODE=true

# Requeridas - Seguridad y simulación
AUTH_SECRET=cualquier-string-random-123456789
DEV_MODE=true

# Requeridas - Stripe (usa valores dummy si no tienes cuenta real)
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_ID=price_1xxxxxxxxxxxxxxxxx
```

⚠️ **Nota:** Los valores de Stripe pueden ser dummy/falsos en modo demo. No se usarán realmente.

## ✅ Verificar que Funcionó

Después del redeploy:

1. Ve a `https://tu-dominio.vercel.app/dev-access`
2. Deberías ver la página con el botón azul "🚀 Quick Demo Access"
3. Click → Te loguea automáticamente y te lleva al dashboard
4. ✅ Listo!

## 🔧 Troubleshooting

### Error: "This endpoint is only available in development mode"

**Solución:** Agrega `ALLOW_DEMO_LOGIN=true` en Vercel y redeploy.

### La página /dev-access no existe (404)

**Solución:** Espera que termine el deployment actual. Vercel puede tardar 1-2 minutos.

### Botones de demo no aparecen en homepage

**Solución:** Esto es normal si no configuraste `NEXT_PUBLIC_DEV_MODE=true`. Usa `/dev-access` directamente.

### Dashboard muestra "Unauthorized"

**Solución:** Asegúrate de configurar `AUTH_SECRET` en las variables de entorno.

## 📊 Lo que se Crea Automáticamente

Cuando usas el demo login, se crea:

✅ Usuario: `demo@buzentry.com`
✅ Teléfono mock: `+1555XXXXXXX`
✅ Suscripción activa (mock)
✅ Acceso completo al dashboard
✅ Todas las funciones disponibles

## 🎯 Variables Mínimas vs Completas

### Mínimo (solo para testing básico):
```
ALLOW_DEMO_LOGIN=true
AUTH_SECRET=cualquier-string
```

### Recomendado (experiencia completa):
```
ALLOW_DEMO_LOGIN=true
NEXT_PUBLIC_DEV_MODE=true
AUTH_SECRET=random-secret-key
DEV_MODE=true
STRIPE_SECRET_KEY=sk_test_51dummy
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51dummy
STRIPE_PRICE_ID=price_1dummy
```

---

**¿Listo?** Agrega `ALLOW_DEMO_LOGIN=true` en Vercel → Redeploy → Visita `/dev-access` 🚀
