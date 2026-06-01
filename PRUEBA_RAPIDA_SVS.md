# ⚡ Prueba Rápida - Integración SVS

## Verificar que SVS está integrado correctamente

### 1. Verificar Servidor Ejecutándose
```bash
curl http://localhost:3000/api/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2026-05-31T23:42:07.165Z",
  "datosAFPs": "Cargados con datos reales SVS"
}
```

---

### 2. Verificar Datos SVS en AFPs
```bash
curl http://localhost:3000/api/afps | jq '.afps[0] | {nombre, datosRealesSVS, comisión, tasaSeguro}'
```

**Respuesta esperada:**
```json
{
  "nombre": "AFP Modelo",
  "datosRealesSVS": true,
  "comisión": 0.69,
  "tasaSeguro": 1.28
}
```

✅ Si ves `datosRealesSVS: true`, la integración está funcionando correctamente.

---

### 3. Verificar Status de Datos
```bash
curl http://localhost:3000/api/status-datos
```

**Respuesta esperada:**
```json
{
  "timestamp": "2026-05-31T23:42:07.123Z",
  "afps": {
    "fuente": "SVS Chile",
    "actualizado": "05/31/2026 23:42:07"
  },
  "isapres": {
    "fuente": "Referenciales"
  }
}
```

✅ Si ves `"fuente": "SVS Chile"`, los datos reales se están usando.

---

### 4. Verificar Caché
```bash
ls -la src/data/svs-cache.json
```

**Respuesta esperada:**
```
-rw-r--r-- 1 usuario usuario 12345 May 31 23:42 src/data/svs-cache.json
```

✅ Si el archivo existe, el caché está activo y funcionando.

---

### 5. Verificar en Navegador

1. Abre http://localhost:3000
2. Ve a la sección "AFP e Isapres"
3. Busca el badge:
   ```
   📊 Datos Actualizados desde SVS Chile
      (Superintendencia de Valores y Seguros)
   ```

✅ Si lo ves, el indicador visual está funcionando.

---

## Comparar Datos: Antes vs Después

### AFP Modelo
| Campo | Antes | Después (SVS) | Cambio |
|---|---|---|---|
| Comisión | 0.70% | 0.69% | ✓ -0.01% |
| Tasa Seguro | 1.25% | 1.28% | ↑ +0.03% |
| Fondo A | 8.6% | 9.2% | ↑ +0.6% |
| Fondo B | 6.9% | 6.8% | ↓ -0.1% |
| Fondo C | 4.3% | 4.1% | ↓ -0.2% |

---

## Calcular Impacto en Pensión

Con los nuevos datos SVS, la pensión estimada debe variar ligeramente:

**Ejemplo:**
- Salario: $2,000,000
- Edad Actual: 35
- Edad Jubilación: 65
- Saldo AFP: $5,000,000

**Con datos antiguos:**
- Pensión estimada: ~$1,250,000

**Con datos SVS:**
- Pensión estimada: ~$1,260,000 (±1% diferencia)

---

## Troubleshooting

### ❌ Problema: No veo "datosRealesSVS": true

**Solución:**
```bash
# Eliminar caché antiguo
rm src/data/svs-cache.json

# Reiniciar servidor
npm run dev

# Esperar 2 segundos
# Hacer request nuevamente
```

---

### ❌ Problema: Fuente muestra "Estáticos"

**Verificar:**
1. ¿Hay error en consola? Revisar output de servidor
2. ¿El archivo svsService.js existe? Verificar en `src/utils/`
3. ¿Node está actualizado? `node --version` (debe ser 16+)

**Reset completo:**
```bash
# Detener servidor
npm stop

# Limpiar caché
rm src/data/svs-cache.json

# Limpiar node_modules
rm -rf node_modules
npm install

# Reiniciar
npm run dev
```

---

### ❌ Problema: Error de puerto en uso

```bash
# Ver qué proceso usa puerto 3000
lsof -i :3000

# Matar proceso
kill -9 <PID>

# Reiniciar servidor
npm run dev
```

---

## Verificación Final

✅ **Todos estos deben estar en VERDE:**

- [ ] Servidor iniciado sin errores
- [ ] GET `/api/health` retorna status OK
- [ ] GET `/api/afps` incluye `datosRealesSVS: true`
- [ ] GET `/api/status-datos` muestra "SVS Chile"
- [ ] Archivo `src/data/svs-cache.json` existe
- [ ] Frontend muestra badge "📊 Datos Actualizados desde SVS"
- [ ] Cálculo de pensión funciona correctamente

---

## 📚 Documentación

Para más información:
- [`docs/SVS_INTEGRACION.md`](docs/SVS_INTEGRACION.md) - Guía completa de SVS
- [`INTEGRACION_SVS_REALIZADA.md`](INTEGRACION_SVS_REALIZADA.md) - Cambios específicos
- [`README.md`](README.md) - Documentación general

---

**Última actualización:** 31 de Mayo 2026  
**Estado:** ✅ Integración Completa  
**Versión:** 1.1.0
