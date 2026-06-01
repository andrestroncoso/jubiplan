# 📱 CALCULADORA PENSIONES CHILE - v1.2.0

## ⚡ Quick Start
```bash
npm run dev  # http://localhost:3000
```

## 📊 Qué es
Calculadora de pensiones para adultos mayores. Calcula pensión, muestra AFPs/Isapres reales, histórico rentabilidades.

## ✨ Features
- ✅ Calculadora (5 params, cálculo actuarial)
- ✅ 6 AFPs (datos SVS reales)
- ✅ 6 Isapres (7 filtros)
- ✅ Histórico (30 días, gráficos)
- ✅ UF/Dólar diario (header)
- ✅ Responsive + zoom-proof

## 📁 Estructura Clave
```
src/backend/server.js           (5 endpoints)
src/frontend/index.html         (4 tabs)
src/utils/
  ├── pensionCalculator.js
  ├── svsService.js
  ├── mindicadorService.js
  └── historicalDataService.js
src/data/
  ├── afps.json (6)
  └── isapres.json (6)
```

## 🔧 APIs
- Mindicador (UF/Dólar) → Funcional
- queAFP (Histórico) → Demo
- SVS (Rentabilidades) → Manual actualizado

## 🎯 Próximas Mejoras
- [ ] Opción B: APIs reales en vivo
- [ ] Opción C: Gráficos comparativos
- [ ] Opción D: Isapres en tiempo real

## 📚 Docs Completas
- `ACCESO_RAPIDO.md` ← Start aquí
- `PROYECTO_RESUMEN.md` ← Resumen ejecutivo
- `OPCION_A_COMPLETADA.md` ← Detalles Opción A
- `RESUMEN_FINAL_SESION2.md` ← Sesión 2 completa

## 👨‍💻 Stack
- Node.js + Express
- HTML5 + CSS3 + JS vanilla
- Chart.js (gráficos)
- SVS + Mindicador APIs

## 🚀 Estado
✅ Producción lista  
✅ Opción A completada  
✅ UI pulida y responsive  
✅ Accesible para adultos mayores

---
**Última sesión:** 31 Mayo 2026
