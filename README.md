# 💰 Calculadora de Pensiones Chile

Una aplicación web elegante, minimalista y funcional para calcular pensiones y comparar AFP e Isapres en Chile. Diseñada especialmente para ser accesible y entendible para personas mayores de edad.

## 🎯 Características

- **Calculadora de Pensiones Avanzada**
  - Simula tu pensión basada en múltiples parámetros
  - Visualización gráfica de evolución del saldo
  - Cálculo actuarial preciso
  - Usa datos reales de rentabilidades

- **Datos Reales de SVS Chile** ✨ NUEVO
  - Integración con SVS (Superintendencia de Valores y Seguros)
  - Rentabilidades reales de AFPs (actualizado Mayo 2026)
  - Comisiones actuales según regulador
  - Tasas de seguro vigentes
  - Caché automático de 24 horas

- **Directorio de AFP e Isapres**
  - Información actualizada de todas las AFP principales
  - Comparación de fondos y rentabilidades
  - Detalles de planes de isapres
  - 7 opciones de filtrado para isapres

- **Interfaz Accesible**
  - Diseño minimalista y limpio (inspirado en Stripe)
  - Tipografía grande y legible para adultos mayores
  - Colores de alto contraste
  - Totalmente responsiva (móvil/tablet/desktop)
  - Soporte para tema oscuro

## 📁 Estructura del Proyecto

```
pension-calculator/
├── src/
│   ├── frontend/                 # Frontend web (HTML/CSS/JS)
│   │   ├── index.html           # Página principal
│   │   ├── styles/
│   │   │   └── main.css         # Estilos globales
│   │   └── js/
│   │       └── app.js           # Lógica frontend
│   ├── backend/                  # Backend Node.js
│   │   ├── server.js            # Servidor Express
│   │   ├── routes/              # Rutas API
│   │   ├── controllers/         # Controladores
│   │   └── services/            # Servicios de negocio
│   ├── data/                     # Datos estáticos + caché
│   │   ├── afps.json            # Información de AFPs
│   │   ├── isapres.json         # Información de isapres
│   │   └── svs-cache.json       # Caché de datos SVS (generado)
│   └── utils/
│       ├── pensionCalculator.js # Lógica de cálculo
│       └── svsService.js        # Integración SVS Chile ✨ NUEVO
├── .claude/
│   └── settings.json            # Configuración de Claude Code
├── docs/                        # Documentación
├── temp/                        # Archivos temporales
├── package.json                 # Dependencias Node.js
└── README.md                    # Este archivo
```

## 🚀 Instalación y Uso

### Requisitos
- Node.js 16+ instalado
- npm o yarn

### Pasos

1. **Instalar dependencias**
```bash
npm install
```

2. **Iniciar servidor (desarrollo)**
```bash
npm run dev
```

O para producción:
```bash
npm start
```

3. **Acceder a la aplicación**
- Abre tu navegador en `http://localhost:3000`
- La aplicación estará disponible inmediatamente

## 🧮 Parámetros de Cálculo

La calculadora acepta los siguientes parámetros:

| Parámetro | Descripción | Rango |
|-----------|-------------|-------|
| **Salario Mensual** | Salario bruto mensual actual | $0+ |
| **Edad Actual** | Edad en años | 18-100 |
| **Edad de Jubilación** | Edad deseada para jubilarse | 18-100 |
| **Saldo Actual en AFP** | Saldo acumulado actual | $0+ |
| **Aportes Adicionales** | Ahorro voluntario mensual | $0+ |
| **Tasa de Rendimiento** | Rendimiento anual esperado | 4-8% |

## 📊 Funcionalidad de la Calculadora

1. **Cálculo Actuarial Preciso**
   - Considera aporte obligatorio (10%)
   - Descuenta comisiones de AFP
   - Incluye seguro de invalidez y vida
   - Aplica rendimiento compuesto

2. **Proyección de Saldo**
   - Simula año por año hasta jubilación
   - Gráfico interactivo de evolución
   - Desglose de costos y comisiones

3. **Estimación de Pensión**
   - Cálculo con expectativa de vida
   - Factor actuarial aplicado
   - Comparativa con diferentes AFPs

## 📊 Integración SVS - Datos Reales

La aplicación ahora se integra con **SVS (Superintendencia de Valores y Seguros)** para obtener datos reales y actualizados:

**Datos Enriquecidos:**
- ✅ Rentabilidades reales de fondos de pensiones
- ✅ Comisiones actuales de AFP
- ✅ Tasas de seguro vigentes
- ✅ Caché automático de 24 horas
- ✅ Fallback a datos estáticos si hay error

**Indicador Visual:**
Cuando abres "AFP e Isapres", verás:
```
📊 Datos Actualizados desde SVS Chile 
   (Superintendencia de Valores y Seguros)
```

**API de Status:**
```bash
curl http://localhost:3000/api/status-datos
```

Para más detalles, ve a [`docs/SVS_INTEGRACION.md`](docs/SVS_INTEGRACION.md)

## 🔌 API Endpoints

### GET `/api/afps`
Obtiene información de todas las AFPs
```json
{
  "afps": [
    {
      "id": "afp-01",
      "nombre": "AFP Habitat",
      "comisión": 0.74,
      "tasaSeguro": 1.27,
      "fondos": [...]
    }
  ]
}
```

### GET `/api/isapres`
Obtiene información de todas las isapres
```json
{
  "isapres": [
    {
      "id": "isapre-01",
      "nombre": "Isapre Banmédica",
      "cotizacion": 7.0,
      "planes": [...]
    }
  ]
}
```

### POST `/api/calcular-pension`
Calcula la pensión estimada
```json
{
  "salarioMensual": 2000000,
  "edadActual": 35,
  "edadJubilacion": 65,
  "saldoActual": 5000000,
  "aportesAdicionales": 0,
  "tasaRendimiento": 0.065,
  "comisionAfp": 0.0074,
  "tasaSeguro": 0.0127
}
```

### GET `/api/status-datos` ✨ NUEVO
Obtiene información sobre la fuente de datos (SVS o estáticos)
```json
{
  "timestamp": "2026-05-31T23:42:07.123Z",
  "afps": {
    "fuente": "SVS Chile",
    "actualizado": "05/31/2026 23:42:07"
  },
  "isapres": {
    "fuente": "Referenciales",
    "nota": "Los datos de isapres son referenciales..."
  }
}
```

## 🎨 Diseño

- **Colores Principales**: Azul (#2563eb), Verde (#10b981)
- **Tipografía**: System fonts para mejor rendimiento
- **Espaciado**: Grid system con gap consistente
- **Interactividad**: Transiciones suaves y animaciones accesibles
- **Accesibilidad**: WCAG 2.1 AA compliant

## 📱 Responsividad

- Móviles: < 768px
- Tablets: 768px - 1024px
- Desktop: > 1024px
- Totalmente funcional en todos los dispositivos

## 🔒 Seguridad

- CORS habilitado para desarrollo local
- Validación de parámetros en backend
- Sin almacenamiento de datos sensibles
- HTTPS recomendado en producción

## 📝 Notas Importantes

- Los datos de rentabilidad son aproximados y referenciales
- Las AFP realizan reajustes mensuales
- Consulte con un asesor financiero para asesoramiento personalizado
- La calculadora no considera cambios en ingresos futuros
- Las comisiones y tasas pueden variar según la AFP

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 📞 Soporte

Para reportar bugs o sugerencias, contacta a través de:
- GitHub Issues
- Email: andres.troncoso.castillo@gmail.com

---

**Última actualización**: 31 de Mayo de 2026
**Versión**: 1.1.0 (con Integración SVS)
**Estado**: ✅ Completamente Funcional con Datos Reales
