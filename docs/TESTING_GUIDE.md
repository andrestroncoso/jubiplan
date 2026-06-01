# Testing Guide - Calculadora de Pensiones

## 🧪 Casos de Prueba

### 1. Calculadora de Pensiones

#### Test 1.1: Cálculo Básico
```
Entrada:
- Salario Mensual: $2.000.000
- Edad Actual: 35
- Edad Jubilación: 65
- Saldo Actual: $5.000.000
- Aportes Adicionales: $0

Validar:
✓ No muestra errores
✓ Pensión estimada > $0
✓ Saldo final > Saldo inicial
✓ Gráfico se renderiza correctamente
✓ Resultados muestran 4 tarjetas principales
```

#### Test 1.2: Validación de Entrada
```
Entrada Inválida 1:
- Edad Actual: 15 (menor que 18)
Validar: ✓ Muestra error "Edad mínima requerida: 18 años"

Entrada Inválida 2:
- Edad Jubilación: 30
- Edad Actual: 40
Validar: ✓ Muestra error "Edad de jubilación debe ser mayor"

Entrada Inválida 3:
- Salario: -1000
Validar: ✓ Muestra error "Salario no puede ser negativo"
```

#### Test 1.3: Aportes Adicionales
```
Entrada 1 (sin aportes):
- Aportes Adicionales: $0
- Resultado: Pensión P1

Entrada 2 (con aportes):
- Aportes Adicionales: $500.000
- Resultado: Pensión P2

Validar: ✓ P2 > P1 (más aportes = más pensión)
```

#### Test 1.4: Impacto de Comisiones
```
Verificar:
✓ Total Comisiones es visible
✓ Total Comisiones < Total Aportado
✓ Comisiones explican 0.7-0.8% del saldo
```

#### Test 1.5: Gráfico de Evolución
```
Validar:
✓ Gráfico aparece después de cálculo
✓ Eje X muestra "Año 1" a "Año N"
✓ Eje Y muestra valores en moneda
✓ Línea es creciente
✓ Puntos son clickables (interactivos)
✓ Leyenda es visible y clara
```

#### Test 1.6: Reset
```
Acciones:
1. Llenar formulario
2. Calcular
3. Hacer clic en "Nueva Simulación"

Validar:
✓ Formulario se limpiar
✓ Resultados desaparecen
✓ Página regresa arriba
✓ Gráfico se destruye
```

---

### 2. Tabs Navigation

#### Test 2.1: Cambio de Tabs
```
Acciones:
1. Hacer clic en tab "Calculadora"
2. Hacer clic en tab "AFP e Isapres"
3. Hacer clic en tab "Información"
4. Volver a "Calculadora"

Validar:
✓ Contenido cambia dinámicamente
✓ Tab activo está resaltado
✓ Transición suave (animación)
✓ Sin errores en consola
```

#### Test 2.2: Estado Persistente
```
Acciones:
1. Llenar formulario en Calculadora
2. Hacer clic en otro tab
3. Volver a Calculadora

Validar:
✓ Los datos del formulario se mantienen
✓ Resultados se mantienen visibles
```

---

### 3. AFP e Isapres Tab

#### Test 3.1: Cargar AFPs
```
Acciones:
1. Hacer clic en tab "AFP e Isapres"
2. Verificar toggle muestra "AFP" activo

Validar:
✓ 4 tarjetas de AFP aparecen
✓ Cada AFP muestra: nombre, comisión, seguro
✓ Cada AFP lista 3 fondos (A, B, C)
✓ Cada fondo muestra: nombre, riesgo, rentabilidad, composición
✓ Información de contacto visible
```

#### Test 3.2: Fondos de AFP
```
Verificar cada AFP (Habitat, Provida, Modelo, Integra):
✓ Fondo A: Riesgo "Alto", Rentabilidad > 8%
✓ Fondo B: Riesgo "Medio", Rentabilidad 6-7%
✓ Fondo C: Riesgo "Bajo", Rentabilidad 4-5%
✓ Composición es diferente para cada fondo
```

#### Test 3.3: Toggle AFP/Isapres
```
Acciones:
1. Clic en "AFP" - verificar AFPs aparecen
2. Clic en "Isapres" - verificar AFPs desaparecen
3. Clic en "Isapres" - verificar Isapres aparecen
4. Clic en "AFP" - verificar Isapres desaparecen
5. Clic en "Isapres" nuevamente

Validar:
✓ Transición suave
✓ Botón activo está resaltado (color azul)
✓ Sin errores de renderizado
```

#### Test 3.4: Cargar Isapres
```
Validar:
✓ 4 tarjetas de Isapre aparecen
✓ Cada Isapre muestra: nombre, cotización salud
✓ Cada Isapre lista 3 planes
✓ Cada plan muestra: nombre, vale primera, deducible, cobertura
✓ Información de contacto visible
```

#### Test 3.5: Planes de Isapres
```
Verificar cada Isapre:
✓ Plan Básico: Vale Primera baja, Deducible alto
✓ Plan Preferente: Vale Primera media, Deducible medio
✓ Plan Premium: Vale Primera alta, Deducible bajo
```

#### Test 3.6: Información de Contacto
```
Validar:
✓ Teléfono visible para cada institución
✓ Website visible como link
✓ Teléfono formato correcto (+56 2 XXXX XXXX)
```

---

### 4. Información Tab

#### Test 4.1: Contenido Educativo
```
Validar que aparecen secciones:
✓ ¿Qué es una AFP?
✓ ¿Qué es una Isapre?
✓ Los 5 Fondos de Pensiones
✓ ¿Cuánto es mi aporte obligatorio?
✓ ¿Cuándo me puedo jubilar?
✓ Preguntas Frecuentes

Validar contenido es claro y accesible
```

#### Test 4.2: FAQ
```
Validar que FAQ contiene:
✓ ¿Puedo cambiar de AFP?
✓ ¿Mi saldo es mío?
✓ ¿Qué pasa si fallezco?
```

---

### 5. Responsive Design

#### Test 5.1: Mobile (< 768px)
```
Viewport: 375px (iPhone)
Validar:
✓ Formulario es vertical (1 columna)
✓ Tarjetas son 1 por fila
✓ Tabs apilados o en scroll horizontal
✓ Texto es legible sin zoom
✓ Botones son tocables (44px mínimo)
✓ Sin scroll horizontal (overflow)
```

#### Test 5.2: Tablet (768px - 1024px)
```
Viewport: 768px (iPad)
Validar:
✓ Formulario es vertical (1 columna)
✓ Tarjetas son 2 por fila
✓ Resultado grid muestra 2 columnas
✓ Todo visible sin scroll excesivo
```

#### Test 5.3: Desktop (> 1024px)
```
Viewport: 1920px (Monitor)
Validar:
✓ Formulario es vertical
✓ Tarjetas son 3-4 por fila
✓ Resultado grid muestra 4 columnas
✓ Máximo ancho respetado (1200px)
```

---

### 6. Accesibilidad

#### Test 6.1: Tema Oscuro
```
Sistema operativo en modo oscuro:
Validar:
✓ Página automáticamente cambia a tema oscuro
✓ Contraste adecuado en tema oscuro
✓ Colores legibles (blanco sobre oscuro)
```

#### Test 6.2: Tamaño de Fuente
```
Validar:
✓ Fuente base es 16px
✓ Encabezados son 1.8rem - 2.5rem
✓ Labels son 1.1rem
✓ Sin fuentes < 14px en contenido principal
```

#### Test 6.3: Contraste de Colores
```
Validar con herramienta WCAG:
✓ Ratio de contraste > 4.5:1 (texto normal)
✓ Ratio de contraste > 3:1 (texto grande)
```

#### Test 6.4: Navegación por Teclado
```
Acciones (sin mouse):
1. Tab para navegar entre campos
2. Shift+Tab para ir atrás
3. Enter para submit
4. Arrows para sliders

Validar:
✓ Todos los elementos son alcanzables
✓ Focus visible y claro
✓ Orden lógico de tab
```

---

### 7. API Tests

#### Test 7.1: GET /api/afps
```
Solicitud: GET http://localhost:3000/api/afps
Validar respuesta:
✓ Status 200
✓ Content-Type: application/json
✓ Contiene array "afps"
✓ 4 AFPs en total
✓ Cada AFP tiene: id, nombre, comisión, tasaSeguro, fondos
```

#### Test 7.2: GET /api/isapres
```
Solicitud: GET http://localhost:3000/api/isapres
Validar respuesta:
✓ Status 200
✓ Content-Type: application/json
✓ Contiene array "isapres"
✓ 4 Isapres en total
✓ Cada Isapre tiene: id, nombre, cotizacion, planes
```

#### Test 7.3: POST /api/calcular-pension
```
Solicitud:
POST /api/calcular-pension
Body: {
  "salarioMensual": 2000000,
  "edadActual": 35,
  "edadJubilacion": 65,
  "saldoActual": 5000000,
  "aportesAdicionales": 0,
  "tasaRendimiento": 0.065,
  "comisionAfp": 0.0074,
  "tasaSeguro": 0.0127
}

Validar respuesta:
✓ Status 200
✓ Contiene: saldoFinal, pensionMensualEstimada, años
✓ Contiene: totalAportado, totalComisiones, totalSeguros
✓ Contiene: aportesRegimen (array con año y saldoAcumulado)
✓ Contiene: flujoJubilacion
✓ saldoFinal > saldoActual
✓ pensionMensualEstimada > 0
```

#### Test 7.4: POST /api/calcular-pension - Validación
```
Solicitud con parámetros inválidos:
Body: {
  "edadActual": 15,
  "edadJubilacion": 65,
  ...
}

Validar respuesta:
✓ Status 400
✓ Contiene array "errores"
✓ Error message: "Edad mínima requerida: 18 años"
```

#### Test 7.5: GET /api/health
```
Solicitud: GET http://localhost:3000/api/health
Validar respuesta:
✓ Status 200
✓ status: "OK"
✓ timestamp presente
```

---

### 8. Performance

#### Test 8.1: Carga Inicial
```
Validar tiempos:
✓ HTML carga en < 100ms
✓ CSS carga en < 100ms
✓ JS carga en < 200ms
✓ Página interactiva en < 2s
```

#### Test 8.2: Cálculo
```
Validar tiempos:
✓ Cálculo de pensión completa en < 500ms
✓ Gráfico renderiza en < 1s
✓ Cambio de tab en < 300ms
```

#### Test 8.3: Tamaño de Archivos
```
Validar:
✓ HTML < 50KB
✓ CSS < 50KB
✓ JS < 50KB
✓ Datos JSON < 20KB
```

---

### 9. Navegadores

Probar en:
- ✓ Chrome (última versión)
- ✓ Firefox (última versión)
- ✓ Safari (última versión)
- ✓ Edge (última versión)
- ✓ Mobile Safari (iOS)
- ✓ Chrome Mobile (Android)

---

## 🐛 Debugging

### Consola del Navegador (F12)
```
Verificar:
✓ Sin errores rojos
✓ Sin warnings amarillos (excepto opcionales)
✓ Mensaje: "✓ Aplicación cargada. API disponible en:"
✓ Network tab: todas las requests 200
```

### Console Logs Útiles
```javascript
// Ver si API está disponible
console.log('API_BASE:', API_BASE);

// Ver datos cargados
console.log('afpsData:', afpsData);

// Ver resultado de cálculo
console.log('Resultado:', resultado);
```

---

## ✅ Checklist de Testing Completo

- [ ] Test 1: Calculadora básica
- [ ] Test 2: Validación de entrada
- [ ] Test 3: Aportes adicionales
- [ ] Test 4: Comisiones
- [ ] Test 5: Gráfico
- [ ] Test 6: Reset
- [ ] Test 7: Tabs navigation
- [ ] Test 8: Estado persistente
- [ ] Test 9: Cargar AFPs
- [ ] Test 10: Fondos de AFP
- [ ] Test 11: Toggle AFP/Isapres
- [ ] Test 12: Cargar Isapres
- [ ] Test 13: Planes de Isapres
- [ ] Test 14: Información de contacto
- [ ] Test 15: Información tab
- [ ] Test 16: Mobile responsive
- [ ] Test 17: Tablet responsive
- [ ] Test 18: Desktop responsive
- [ ] Test 19: Tema oscuro
- [ ] Test 20: Tamaño fuentes
- [ ] Test 21: Contraste colores
- [ ] Test 22: Navegación teclado
- [ ] Test 23: API /afps
- [ ] Test 24: API /isapres
- [ ] Test 25: API /calcular-pension
- [ ] Test 26: API validación
- [ ] Test 27: API /health
- [ ] Test 28: Performance
- [ ] Test 29: Navegadores múltiples

---

**Última actualización**: 31 de Mayo 2026
