# 🎨 Guía de Logo Jubiplan

## Archivos Disponibles

### Versión Gradiente (Color)
- **Archivo:** `assets/jubiplan-logo.svg`
- **Uso:** Correos, documentos, presentaciones, firma digital
- **Colores:** Verde → Cyan → Púrpura (Gradiente)
- **Formato:** SVG (escalable, sin pérdida de calidad)

### Versión Blanca
- **Archivo:** `assets/jubiplan-logo-white.svg`
- **Uso:** Fondos oscuros, papelería, firma en fondo oscuro
- **Colores:** Blanco
- **Formato:** SVG (escalable, sin pérdida de calidad)

---

## 📧 Integración en Correos

### Opción 1: SVG Directo (Recomendado)
```html
<img src="assets/jubiplan-logo.svg" alt="Jubiplan" width="60" height="60">
```

### Opción 2: PNG desde SVG (si SVG no es soportado)
Necesitas convertir a PNG:

**Método 1 - Online (sin instalación):**
1. Ir a: https://convertio.co/es/svg-png/ o similar
2. Subir `jubiplan-logo.svg`
3. Descargar en PNG (recomendado 200x200 o 256x256)

**Método 2 - Con ImageMagick (línea de comandos):**
```bash
# Instalar ImageMagick primero
convert -density 300 assets/jubiplan-logo.svg -resize 256x256 assets/jubiplan-logo-256.png
convert -density 300 assets/jubiplan-logo.svg -resize 512x512 assets/jubiplan-logo-512.png
```

**Método 3 - Con Inkscape (software):**
1. Abrir `jubiplan-logo.svg` en Inkscape
2. File → Export As → PNG
3. Configurar resolución (300 DPI para impresión, 96 DPI para web)
4. Guardar

---

## 📏 Tamaños Recomendados

### Para Correos Electrónicos
- **Pequeño:** 48x48 px (thumbnail)
- **Mediano:** 100x100 px (firma)
- **Grande:** 200x200 px (presentación)

### Para Documentos
- **PDF:** 300 DPI (1200x1200 px a 300 DPI = 4"x4")
- **Word:** 2-3 cm de ancho
- **Powerpoint:** 1-1.5 pulgadas

### Para Web
- **Favicon:** 32x32 o 64x64 px
- **Header:** 80-120 px
- **Social Media:** 200x200 px

---

## 🎯 Usos Recomendados

| Contexto | Archivo | Tamaño | Formato |
|---|---|---|---|
| **Correo (firma)** | jubiplan-logo.svg | 60x60 | SVG o PNG 100x100 |
| **Fondo blanco/claro** | jubiplan-logo.svg | 100-200 | SVG o PNG |
| **Fondo oscuro** | jubiplan-logo-white.svg | 100-200 | SVG o PNG |
| **Favicon web** | jubiplan-logo.svg | 32x32 | PNG |
| **Documento impreso** | jubiplan-logo.svg | 300 DPI | PDF o PNG |
| **Presentación** | jubiplan-logo.svg | 200-400 | SVG o PNG |

---

## 💼 Firma de Correo Profesional

**HTML para firma de correo:**
```html
<table style="border-collapse: collapse;">
  <tr>
    <td style="padding: 20px 0;">
      <img src="https://tudominio.com/assets/jubiplan-logo.svg" 
           alt="Jubiplan" 
           width="70" 
           height="70"
           style="margin-right: 15px; vertical-align: middle;">
    </td>
    <td style="vertical-align: middle; padding-left: 15px; border-left: 2px solid #00d9ff;">
      <strong>Tu Nombre</strong><br>
      Cargo / Posición<br>
      <a href="tel:+56912345678">+56 9 1234 5678</a><br>
      <a href="mailto:correo@jubiplan.cl">correo@jubiplan.cl</a><br>
      <a href="https://jubiplan.cl" style="color: #00d9ff; text-decoration: none;">jubiplan.cl</a>
    </td>
  </tr>
</table>
```

---

## 🔄 Conversión a PNG (Paso a Paso)

### Usando un Convertidor Online:
1. Visita https://cloudconvert.com/svg-to-png
2. Haz clic en "Seleccionar archivo"
3. Elige `jubiplan-logo.svg`
4. En opciones, set resolution a **300 DPI** (para impresión) o **96 DPI** (para web)
5. Haz clic en "Convertir"
6. Descarga el PNG

### Guardar como PNG en PowerPoint:
1. Insertar → Imágenes → `jubiplan-logo.svg`
2. Clic derecho sobre la imagen
3. "Guardar como imagen"
4. Seleccionar PNG
5. Guardar

---

## 📌 Notas Importantes

✅ **Usa SVG cuando sea posible:**
- No pierde calidad al escalar
- Archivo más pequeño
- Compatible con la mayoría de plataformas modernas

✅ **Para compatibilidad total, ten ambos:**
- SVG para navegadores/aplicaciones modernas
- PNG para compatibilidad retroactiva

✅ **Colores:**
- Gradiente: Verde #00ff88 → Cyan #00d9ff → Púrpura #a78bfa
- Blanco: #ffffff
- Mantener estos colores para consistencia de marca

✅ **No modificar:**
- No cambiar colores sin consentimiento
- No distorsionar proporciones (mantener aspect ratio)
- No agregar efectos adicionales

---

## 📋 Checklist para Correos

- [ ] Logo en versión correcta (gradiente o blanco según fondo)
- [ ] Tamaño adecuado (60-100 px para firma)
- [ ] Formato compatible (SVG o PNG)
- [ ] Enlace funcional a jubiplan.cl (opcional)
- [ ] Texto legible junto al logo
- [ ] Probado en diferentes clientes de correo

---

**Versión:** 1.0  
**Última actualización:** 31 Mayo 2026  
**Estado:** Listo para usar