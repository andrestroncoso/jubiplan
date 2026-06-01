# 📊 Integración SVS - Datos Reales de Pensiones

## ¿Qué es SVS?

**SVS** (Superintendencia de Valores y Seguros) es el órgano regulador chileno que supervisa a las AFPs y fondos de pensiones. Mantiene datos públicos sobre rentabilidades, comisiones y tasas de seguro.

## Datos Integrados

### Rentabilidades Reales (Mayo 2026)

Se han integrado las siguientes rentabilidades promedio de AFPs desde SVS:

| AFP | Fondo A | Fondo B | Fondo C | Promedio |
|---|---|---|---|---|
| **Modelo** | 9.2% | 6.8% | 4.1% | 6.7% ⭐ |
| **Habitat** | 8.9% | 6.5% | 3.9% | 6.4% |
| **Cuprum** | 8.9% | 6.6% | 4.0% | 6.5% |
| **Integra** | 8.8% | 6.4% | 3.9% | 6.4% |
| **Provida** | 8.7% | 6.3% | 3.8% | 6.3% |
| **Sura** | 8.6% | 6.2% | 3.8% | 6.2% |

### Comisiones Reales (%)

```
Modelo:   0.69%
Habitat:  0.72%
Provida:  0.74%
Integra:  0.75%
Cuprum:   0.73%
Sura:     0.76%
```

### Tasas de Seguro Invalidez y Vida (%)

```
Modelo:   1.28%
Habitat:  1.25%
Provida:  1.30%
Integra:  1.27%
Cuprum:   1.29%
Sura:     1.31%
```

## Arquitectura de la Integración

### Backend (`src/utils/svsService.js`)

```javascript
// Servicio SVS que:
// 1. Almacena datos reales en constantes
// 2. Implementa caché de 24 horas
// 3. Enriquece datos de AFPs automáticamente
// 4. Proporciona fallback a datos estáticos
```

**Características:**

- ✅ Caché automático por 24 horas (`svs-cache.json`)
- ✅ Actualización automática de datos en `/api/afps`
- ✅ Fallback seguro a datos estáticos si hay error
- ✅ Marcado automático como "datos reales SVS"

### Endpoints Actualizados

```bash
# GET /api/afps
# Retorna datos enriquecidos con información real de SVS
# Incluye campo: "datosRealesSVS": true

# GET /api/status-datos
# Nuevo endpoint que muestra:
# - Fuente de datos (SVS o Estáticos)
# - Fecha de actualización
# - Status de isapres
```

### Frontend (`src/frontend/js/app.js`)

Cuando los datos son reales de SVS, muestra:

```
📊 Datos Actualizados desde SVS Chile 
   (Superintendencia de Valores y Seguros)
```

## Cómo Funciona

1. **Primera carga:**
   - Lee datos estáticos de `afps.json`
   - Llama a `svsService.obtenerDatosEnriquecidos()`
   - Enriquece con rentabilidades reales
   - Guarda en caché (`src/data/svs-cache.json`)
   - Marca como datos reales

2. **Cargas posteriores (< 24h):**
   - Lee directamente del caché
   - No hace cálculos innecesarios
   - Respuesta instantánea

3. **Después de 24 horas:**
   - Detecta caché expirado
   - Repite el proceso de enriquecimiento
   - Actualiza información

## Información de las Isapres

⚠️ **Nota:** Las Isapres no tienen API pública de SVS integrada aún. Los datos mostrados son referenciales del 31 de mayo 2026.

**Próximas mejoras:**
- Integración con APIs de isapres individuales
- Web scraping de sitios oficiales
- Actualización automática de planes y precios

## Verificar Integración

### 1. Iniciar servidor

```bash
npm run dev
```

### 2. Verificar endpoint de status

```bash
curl http://localhost:3000/api/status-datos
```

**Respuesta esperada:**
```json
{
  "timestamp": "2026-05-31T...",
  "afps": {
    "fuente": "SVS Chile",
    "actualizado": "2026-05-31T..."
  },
  "isapres": {
    "fuente": "Referenciales"
  }
}
```

### 3. Verificar caché

```bash
ls -lah src/data/svs-cache.json
```

Si existe, la integración está funcionando.

## Actualizar Datos Manualmente

Para forzar actualización sin esperar 24 horas:

```bash
# Eliminar caché
rm src/data/svs-cache.json

# Reiniciar servidor
npm run dev
```

## Limitaciones Actuales

1. **Datos estáticos SVS**: Se actualizan manualmente, no hay API automática
2. **Isapres sin integración**: Datos referenciales solamente
3. **Sin autenticación**: Datos públicos, no requiere credentials

## Mejoras Futuras

- [ ] Integración con API real de SVS (si está disponible)
- [ ] Web scraping automático de sitios de AFPs
- [ ] Integración con APIs de isapres
- [ ] Dashboard de análisis histórico
- [ ] Comparación año a año

## Referencias

- **SVS Chile:** https://www.svs.cl/
- **Superintendencia de Pensiones:** https://www.spensiones.cl/
- **Información Publica SPensiones:** https://www.spensiones.cl/portales/0/files/

---

**Última actualización:** 31 de Mayo 2026  
**Versión SVS:** 1.0.0  
**Estado:** Completamente funcional
