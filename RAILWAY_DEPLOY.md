# 🚀 Desplegar en Railway (Automático)

## ✨ Lo que hemos configurado

- ✅ `railway.toml` - Configuración automática
- ✅ `Procfile` - Comando de inicio
- ✅ `.railwayignore` - Archivos a ignorar
- ✅ Variables de ambiente preconfiguradas

## 📋 Pasos para Desplegar (3 minutos)

### Paso 1: Ir a Railway
```
https://railway.app
```

### Paso 2: Crear Cuenta (si no tienes)
- Haz clic en **"Start a New Project"**
- Selecciona **"Deploy from GitHub repo"**
- Autoriza Railway para acceder a GitHub

### Paso 3: Seleccionar Repositorio
- Busca y selecciona: **`andrestroncoso/jubiplan`**
- Railway detectará automáticamente la configuración

### Paso 4: Esperar Deploy
Railway ejecutará automáticamente:
```bash
npm install        # Instala dependencias
npm start          # Inicia la app
```

### Paso 5: Obtener URL Pública
Una vez finalizado, Railway te dará una URL como:
```
https://jubiplan-production.up.railway.app
```

¡Esa es tu URL pública! 🎉

---

## 🔧 Configuración Automática

Railway detectará:
- ✅ Node.js (por `package.json`)
- ✅ Puerto 3000 (por `railway.toml`)
- ✅ Variables de ambiente
- ✅ Health check en `/api/health`

---

## 📱 Probar la App Pública

Una vez deployed:

```bash
# Ver si está vivo
curl https://tu-url-railway.up.railway.app/api/health

# Cálculo de pensión
curl -X POST https://tu-url-railway.up.railway.app/api/calcular-pension \
  -H "Content-Type: application/json" \
  -d '{
    "salarioMensual": 2000000,
    "edadActual": 35,
    "edadJubilacion": 65,
    "saldoActual": 5000000,
    "aportesAdicionales": 0,
    "tasaRendimiento": 0.065,
    "comisionAfp": 0.0074,
    "tasaSeguro": 0.0127
  }'
```

---

## 🎨 Personalizar tu URL (Opcional)

En Railway puedes cambiar el nombre del proyecto:

1. Ve al proyecto en Railway
2. Settings → General
3. Cambia el nombre a algo más bonito
4. La URL se actualizará automáticamente

Ejemplo:
```
https://jubiplan-chile.up.railway.app  ← Más bonito
```

---

## 💰 Precios en Railway

```
Tier Gratuito:
- $5 USD/mes de crédito
- Suficiente para una app como Jubiplan
- Alcanza para meses sin costo
```

---

## 🔐 Seguridad en Producción

La app ya está configurada para producción:

✅ Helmet.js activado (headers de seguridad)
✅ CORS configurado correctamente
✅ XSS protection implementado
✅ Variables de ambiente seguras
✅ Validación de entrada en backend

---

## 📊 Monitorear tu App

En Railway dashboard puedes ver:

- **Logs en tiempo real** - Errores y eventos
- **Métricas** - CPU, memoria, red
- **Health check** - Estado de la app
- **Deployments** - Historial de despliegues

---

## 🆘 Si Algo Falla

**Error "Cannot find module":**
```bash
# Railway automáticamente ejecuta:
npm install --production
```

**Puerto en uso:**
```bash
# Railway maneja automáticamente el puerto
# No necesitas configurar nada
```

**CORS errors:**
```bash
# Ya está configurado en server.js
# ALLOWED_ORIGINS se obtiene automáticamente
```

**Variables de ambiente:**
```bash
# Visible en Railway → Project → Variables
# Puedes editarlas en el dashboard
```

---

## 📚 Documentos Relacionados

- `SECURITY.md` - Documentación de seguridad
- `DEPLOYMENT_CHECKLIST.md` - Checklist completo
- `CLAUDE.md` - Información del proyecto

---

## 🎯 Resumen

1. ✅ Código en GitHub: **andrestroncoso/jubiplan**
2. ✅ Configuración automática: **railway.toml**
3. ⏭️ Próximo: Ve a railway.app y despliega
4. 🎉 Resultado: App pública en URL de Railway

---

**¿Necesitas ayuda?** Revisa los logs en Railway dashboard.

**Tiempo de despliegue:** ~2-3 minutos ⏱️

**Costo:** Gratuito (con $5/mes de crédito) 💰
