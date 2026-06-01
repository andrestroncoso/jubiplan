# ⚡ Guía Rápida - Calculadora de Pensiones

## 🎯 Inicio Rápido (1 minuto)

```bash
# 1. Instalar dependencias (ya completado)
npm install

# 2. Iniciar servidor
npm run dev

# 3. Abrir navegador
# http://localhost:3000
```

## 📋 Verificación Rápida

### ✅ Frontend
- [x] Interfaz carga correctamente
- [x] Tres tabs navegables (Calculadora, AFP e Isapres, Información)
- [x] Formulario responsivo en todos los dispositivos
- [x] Gráficos interactivos (Chart.js)
- [x] Tema oscuro automático

### ✅ Backend
- [x] Servidor Express ejecutándose
- [x] APIs REST disponibles
- [x] CORS habilitado
- [x] Datos JSON cargándose correctamente

### ✅ Datos
- [x] 4 AFPs con fondos A, B, C
- [x] 4 Isapres con planes variados
- [x] Información actualizada y realista

## 🧮 Cómo Usar la Calculadora

### Paso 1: Ingresa tu Información
1. **Salario Mensual**: Tu sueldo bruto (ej: $2.000.000)
2. **Edad Actual**: Tu edad en años (ej: 35)
3. **Edad de Jubilación**: Cuando deseas jubilarte (ej: 65)
4. **Saldo Actual en AFP**: Lo que tienes ahorrado (opcional)
5. **Aportes Adicionales**: Ahorro voluntario mensual (opcional)

### Paso 2: Haz Clic en "Calcular Pensión"

### Paso 3: Interpreta los Resultados
- **Pensión Mensual Estimada**: Lo que recibirías mensualmente en jubilación
- **Saldo Acumulado**: Total ahorrado para el retiro
- **Total Aportado**: Dinero que pusiste tú
- **Total en Comisiones**: Costo de administración

### Paso 4: Revisa el Gráfico
- Muestra cómo crece tu saldo año por año
- Verde = dinero acumulado
- Eje Y = moneda chilena (CLP)

## 🏦 Explorando AFP e Isapres

### AFP (Administradoras de Fondos de Pensiones)
Cada AFP tiene 3 fondos:
- **Fondo A**: Alto riesgo, alta rentabilidad (personas jóvenes)
- **Fondo B**: Riesgo medio, rentabilidad media
- **Fondo C**: Bajo riesgo, baja rentabilidad (cercanos a jubilarse)

Ver: comisión (0.7-0.8%), tasa de seguro (~1.27%)

### Isapres (Seguros de Salud Privados)
Cada isapre tiene 3 planes:
- **Plan Básico**: Cobertura limitada, vale primera bajo
- **Plan Preferente**: Cobertura media, deducible medio
- **Plan Premium**: Cobertura completa, deducible bajo

Ver: valor de vale primera, deducibles, cobertura

## 📊 Ejemplos de Cálculo

### Ejemplo 1: Persona Joven
```
Salario: $2.000.000
Edad: 30 años
Jubilación: 65 años
Saldo AFP: $1.000.000
Aportes: $0

Resultado: Pensión ~$850.000/mes al retiro
```

### Ejemplo 2: Persona en Edad Media
```
Salario: $3.500.000
Edad: 45 años
Jubilación: 65 años
Saldo AFP: $25.000.000
Aportes: $100.000/mes

Resultado: Pensión ~$1.800.000/mes al retiro
```

### Ejemplo 3: Persona Próxima a Jubilarse
```
Salario: $1.500.000
Edad: 60 años
Jubilación: 65 años
Saldo AFP: $80.000.000
Aportes: $0

Resultado: Pensión ~$2.000.000/mes al retiro
```

## 🔧 Datos Técnicos

| Concepto | Valor |
|----------|-------|
| Aporte Obligatorio | 10% salario |
| Comisión AFP Promedio | 0.74% |
| Seguro Obligatorio | 1.27% |
| Rendimiento Esperado | 6.5% anual |
| Expectativa de Vida | 80 años |
| Edad Jubilación Hombres | 65 años |
| Edad Jubilación Mujeres | 60 años |

## ❓ Preguntas Frecuentes

**P: ¿Puedo cambiar de AFP?**
R: Sí, una vez al año sin costo durante octubre.

**P: ¿Dónde veo mi saldo real?**
R: En el sitio de tu AFP (Habitat, Provida, Modelo, Integra).

**P: ¿Qué pasa si fallezco antes de jubilarme?**
R: Tu familia hereda el saldo. El seguro cubre también invalidez.

**P: ¿Puedo retirar mi saldo antes de jubilación?**
R: Solo en casos excepcionales (invalidez, desempleo prolongado).

**P: ¿Está garantizada la pensión?**
R: No, es variable según rentabilidad de los fondos.

## 📱 Accesibilidad

La aplicación fue diseñada para personas mayores:
- ✅ Texto grande y legible
- ✅ Colores con alto contraste
- ✅ Interfaz intuitiva y simple
- ✅ Sin animaciones que distraigan
- ✅ Compatible con lectores de pantalla
- ✅ Funciona en todos los navegadores modernos

## 🔗 Enlaces Útiles

- **Superintendencia de Pensiones**: https://www.spensiones.cl/
- **AFP Habitat**: https://www.habitatafp.cl/
- **AFP Provida**: https://www.provida.cl/
- **AFP Modelo**: https://www.modeloafp.cl/
- **AFP Integra**: https://www.integraafp.cl/

## ⚠️ Disclaimers Importantes

1. **Educacional**: Esta herramienta es solo educativa
2. **Aproximada**: No es asesoramiento financiero
3. **Variable**: Las rentabilidades pueden cambiar
4. **Consulta**: Habla con un asesor antes de decisiones grandes
5. **Datos**: Información actualizada al 31 de Mayo 2026

## 🆘 Troubleshooting

### "El servidor no responde"
```bash
# Verifica que el servidor esté corriendo
npm run dev

# Verifica la consola del navegador (F12)
# Mensaje: "API disponible en http://localhost:3000/api/"
```

### "El gráfico no aparece"
```bash
# Espera a que cargue Chart.js desde CDN
# Revisa la consola (F12) para errores
# Recarga la página (Ctrl+R)
```

### "No puedo cambiar de tab"
```bash
# Revisa que JavaScript esté habilitado
# Limpia el cache (Ctrl+Shift+Delete)
# Reinicia el navegador
```

## 🎓 Próximos Pasos

1. **Experimenta**: Prueba diferentes escenarios
2. **Compara**: Mira qué AFP te conviene más
3. **Aprende**: Lee la sección de Información
4. **Consulta**: Habla con tu AFP o asesor
5. **Planifica**: Toma decisiones informadas

---

**¿Necesitas ayuda?** Revisa `README.md` o `docs/ARCHITECTURE.md`

**Última actualización**: 31 de Mayo 2026
