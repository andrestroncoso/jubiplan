# ⚡ ACCESO RÁPIDO - Próximas Sesiones

## 🚀 Start Rápido

```bash
cd "c:\Users\andre\Documents\Cursos\VScode - Claude Code\Claude Code 1\pension-calculator"
npm run dev
# Abre: http://localhost:3000
```

---

## 📌 Información Clave

| Aspecto | Detalle |
|---|---|
| **Versión** | 1.2.0 |
| **Puerto** | 3000 |
| **Estado** | ✅ Funcional |
| **Última cambio** | 31 Mayo 2026 |
| **Usuarios** | Adultos mayores (60+) |

---

## 🎯 Características Actuales

### ✅ Implementadas
1. Calculadora de pensiones (actuarial precisa)
2. 6 AFPs con datos SVS
3. 6 Isapres con 7 filtros
4. Badge UF/Dólar en header
5. Pestaña Histórico con gráficos (datos demo)

### 📋 Pendientes (Próximas Fases)
1. APIs reales Mindicador + queAFP
2. Integración SuperDeSalud (Isapres)
3. Gráficos comparativos avanzados
4. Guardar simulaciones

---

## 📁 Rutas Importantes

```
Backend API:    src/backend/server.js (puerto 3000)
Frontend:       src/frontend/index.html
Servicios:      src/utils/*.js
Datos:          src/data/*.json
Estilos:        src/frontend/styles/main.css
```

---

## 🔧 Servicios Disponibles

```javascript
// En src/utils/

// 1. Mindicador (UF/Dólar)
mindicadorService.obtenerIndicadoresDelDia()

// 2. Histórico (queAFP)
historicalDataService.obtenerHistoricoAFPs()

// 3. SVS (Rentabilidades)
svsService.obtenerDatosEnriquecidos(afpsJSON)

// 4. Cálculo de Pensión
calculator.calcularPension(params)
```

---

## 📊 Endpoints API

| Método | Ruta | Retorna |
|---|---|---|
| GET | `/api/afps` | 6 AFPs con datos SVS |
| GET | `/api/isapres` | 6 Isapres referenciales |
| POST | `/api/calcular-pension` | Cálculo actuarial |
| GET | `/api/health` | Status del servidor |
| GET | `/api/status-datos` | Fuente datos (SVS/Estáticos) |

---

## 🎨 Cambios UI Recientes

### 1. Badge SVS Separado (31 Mayo)
- ✅ Nota informativa arriba
- ✅ NO ocupa espacio en cuadrícula
- ✅ Estructura HTML corregida

### 2. Badge Indicadores (31 Mayo)
- ✅ UF y Dólar en header
- ✅ Se actualiza al cargar
- ✅ Colores diferenciados

### 3. Pestaña Histórico (31 Mayo)
- ✅ Gráficos de tendencias
- ✅ Datos demo para 3 AFPs
- ✅ Explicaciones simples

---

## 🐛 Problemas Conocidos y Soluciones

### Problema: Badge SVS aparece como tarjeta
**Solución:** Removidas clases grid del contenedor principal  
**Archivos:** `index.html` líneas 155, 188

### Problema: Histórico no carga
**Solución:** Verificar que Chart.js está cargado desde CDN  
**Archivo:** `app.js` línea 900+

### Problema: UF/Dólar no aparece
**Solución:** Llamar `cargarIndicadoresDelDia()` al iniciar  
**Archivo:** `app.js` final

---

## 📚 Documentación Disponible

```
PROYECTO_RESUMEN.md              ← Resumen ejecutivo
SVS_INTEGRACION.md               ← Datos SVS detallado
CAMBIOS_UI_VISUALES.md           ← Cambios visuales
OPCION_A_COMPLETADA.md           ← Resumen Opción A
TOKEN_COMPACTION_V2.md           ← Compactación tokens
ACCESO_RAPIDO.md                 ← Este archivo

docs/
├── ARCHITECTURE.md              ← Diseño técnico
├── TESTING_GUIDE.md             ← Casos de prueba
└── SVS_INTEGRACION.md           ← APIs SVS
```

---

## 🎯 Próximo Trabajo (Si aplica)

### Opción A (COMPLETADA) ✅
- [x] UF Diaria
- [x] Gráfico Histórico

### Opción B (PENDIENTE)
- [ ] Integración API Mindicador en vivo
- [ ] Integración API queAFP en vivo
- [ ] Banco Central datos históricos

### Opción C (PENDIENTE)
- [ ] Gráficos comparativos
- [ ] Alertas de cambios
- [ ] Exportar PDF
- [ ] Guardar simulaciones

---

## ⚙️ Variables de Entorno

Crear `.env` en raíz si se necesitan:
```
PORT=3000
NODE_ENV=development
API_MINDICADOR=https://mindicador.cl/api
API_QUEAFP=https://queafp.cl/api/v1
```

---

## 📞 Contacto / Issues

Si hay problemas:
1. Verificar que npm está instalado: `npm --version`
2. Verificar Node.js: `node --version` (v16+)
3. Limpiar node_modules: `rm -rf node_modules && npm install`
4. Hard refresh navegador: `Ctrl+Shift+R`

---

## 🎓 Para Adultos Mayores

### UI/UX Principles
- ✅ Fonts grandes (16px+)
- ✅ Alto contraste colores
- ✅ Explicaciones simples
- ✅ Sin jerga técnica
- ✅ Transiciones suaves
- ✅ Botones grandes y claros

### Testing
- Probar con zoom 125% en navegador
- Verificar legibilidad en móvil
- Revisar que explicaciones son claras

---

## 📊 Datos Actuales (Mayo 31)

**AFPs (6 totales):**
- Modelo: 9.2% (Fondo A)
- Habitat: 8.9%
- Cuprum: 8.9%
- Integra: 8.8%
- Provida: 8.7%
- Sura: 8.6%

**Isapres (6 totales):**
- Banmédica
- Masvida
- Cruces (mejor rating 9.4)
- Fonasa
- Consalud
- Vidatrés

---

## ✨ Notas

1. **Cache:** Todos los servicios cachean 24h
2. **Datos:** SVS reales, Isapres referenciales
3. **Histórico:** Implementado con datos demo, queAFP API lista
4. **Producción:** Cambiar API URLs y agregar HTTPS

---

**Última actualización:** 31 Mayo 2026  
**Versión:** 1.2.0  
**Estado:** ✅ Listo
