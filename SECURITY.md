# 🔒 Guía de Seguridad - Jubiplan

## Mejoras de Seguridad Implementadas

### 1. **Headers HTTP de Seguridad (Helmet)**
- ✅ **Implementado**: Helmet.js protege contra vulnerabilidades comunes
- Establece headers de seguridad automáticamente:
  - `X-Frame-Options: DENY` - Previene clickjacking
  - `X-Content-Type-Options: nosniff` - Previene MIME sniffing
  - `Strict-Transport-Security` - Fuerza HTTPS
  - `Content-Security-Policy` - Previene inyecciones

### 2. **Validación de Entrada**
- ✅ Validación en backend para parámetros numéricos
- ✅ Límite de tamaño en payloads JSON: 10KB
- ✅ Tipos de datos estrictamente validados

### 3. **Protección XSS (Cross-Site Scripting)**
- ✅ Función `sanitizeHTML()` en app.js
- ✅ Escape de datos dinámicos en templates
- ✅ Sin uso de `eval()` o `innerHTML` inseguro
- ✅ Datos JSON del servidor validados antes de renderizar

### 4. **CORS Seguro**
- ✅ Configuración restringida de CORS
- ✅ Solo métodos necesarios: GET, POST, OPTIONS
- ✅ Credentials: false (sin cookies)
- ✅ Orígenes configurables vía variables de ambiente

### 5. **Variables de Ambiente**
- ✅ Archivos `.env` para configuración segura
- ✅ Puerto configurable
- ✅ Ambiente configurable (development/production)
- ✅ ALLOWED_ORIGINS configurable

### 6. **Accesibilidad y ARIA**
- ✅ Roles ARIA para navegación (`role="tab"`, `role="region"`)
- ✅ Atributos aria-selected y aria-controls
- ✅ aria-live para contenido dinámico
- ✅ Etiquetas semánticas correctas

### 7. **Sin Datos Sensibles**
- ✅ Sin contraseñas hardcodeadas
- ✅ Sin API keys en el código
- ✅ Sin tokens de autenticación
- ✅ Sin información personal de usuarios

---

## Configuración para Despliegue

### Desarrollo Local
```bash
npm install
npm run dev
```

### Producción
```bash
# 1. Actualizar .env
cp .env.example .env
# Editar .env con valores de producción:
# - ALLOWED_ORIGINS: https://tudominio.com
# - NODE_ENV: production
# - PORT: 3000 (o según tu infraestructura)

# 2. Instalar dependencias
npm install --production

# 3. Iniciar servidor
npm start
```

### Variables de Ambiente Requeridas
```
PORT=3000                                    # Puerto de escucha
NODE_ENV=production                          # Ambiente
ALLOWED_ORIGINS=https://tudominio.com       # CORS permitido (separado por comas)
```

---

## Checklist de Seguridad Pre-Despliegue

- [ ] `.env` configurado con valores de producción
- [ ] `ALLOWED_ORIGINS` con dominios reales
- [ ] `NODE_ENV=production`
- [ ] HTTPS habilitado en servidor (nginx/Apache)
- [ ] Certificado SSL válido
- [ ] Firewall configurado
- [ ] Rate limiting implementado (opcional)
- [ ] Logs de seguridad monitoreados
- [ ] Headers HTTP verificados
- [ ] CORS testado desde dominios permitidos

---

## Testeo de Seguridad

### Verificar Headers
```bash
curl -I https://tudominio.com/api/health
```

Debería retornar headers de seguridad:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`

### Verificar CORS
```bash
curl -H "Origin: https://tudominio.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS https://tudominio.com/api/calcular-pension -v
```

### Verificar HTTPS
- Todas las request deben ser HTTPS
- Certificado debe ser válido
- Redirecciones HTTP → HTTPS

---

## Vulnerabilidades Conocidas y Mitigaciones

| Vulnerabilidad | Mitigación | Estado |
|---|---|---|
| XSS | sanitizeHTML() + validación | ✅ Implementado |
| CSRF | SameSite cookies (si aplica) | ✅ N/A (sin sesiones) |
| SQL Injection | JSON estático, sin DB | ✅ N/A |
| Clickjacking | X-Frame-Options: DENY | ✅ Helmet |
| MIME Sniffing | X-Content-Type-Options | ✅ Helmet |
| Weak Headers | Helmet.js | ✅ Implementado |

---

## Monitoreo Recomendado

1. **Logs de Errores**: Capturar excepciones no controladas
2. **Alertas de Seguridad**: Monitorear intentos de explotación
3. **Performance**: Tiempo de respuesta de APIs
4. **Disponibilidad**: Uptime monitoring
5. **CORS Violations**: Logging de requests rechazadas

---

## Dependencias de Seguridad

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.0.3"
  }
}
```

**Recomendación**: Mantener dependencias actualizadas
```bash
npm audit
npm update
```

---

## Soporte y Reportes de Seguridad

Para reportar vulnerabilidades de seguridad:
1. NO publicar en issues públicos
2. Contactar al equipo de desarrollo
3. Proporcionar detalles técnicos
4. Esperar confirmación antes de divulgar

---

**Última actualización**: 1 de Junio 2026
**Versión**: 1.1.0
