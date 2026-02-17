# **📄 Documento de Requisitos de Software (BRD)**

## **Proyecto: Lumina Invoice Generator**

**Tipo:** Aplicación Web Estática (Client-Side)  
 **Objetivo:** Generación profesional de facturas con enfoque UX y diseño premium.  
 **Stack Tecnológico:**

* React 19

* Tailwind CSS

* Lucide Icons

* Zustand (gestión de estado)

* React Hook Form (formularios)

* jsPDF \+ html2canvas (exportación PDF)

* decimal.js (precisión monetaria)

---

# **1\. 🎯 Visión General**

Lumina Invoice Generator es una aplicación web estática orientada a freelancers y pequeños negocios que necesiten generar facturas profesionales de forma rápida, visual y sin registro.

La aplicación prioriza:

* Edición en vivo (Live Preview)

* Persistencia automática

* Diseño premium

* Simplicidad funcional con base técnica sólida

El sistema opera completamente del lado del cliente, sin backend.

---

# **2\. 📌 Alcance de la Versión (v1)**

Incluye:

* Generación de facturas individuales

* Persistencia local

* Exportación a PDF lista para impresión A4

* Plantillas visuales personalizables

* Un único impuesto global por factura

No incluye en esta versión:

* Backend

* Facturación masiva

* Múltiples impuestos por partida

* Firma digital

* Integración con pasarelas de pago

---

# **3\. ✅ Requisitos Funcionales (RF)**

---

## **RF-01: Gestión de Perfil del Emisor**

El usuario podrá ingresar:

* Nombre / Empresa

* NIF / CIF

* Dirección

* Email

* Teléfono

* Logo (PNG/JPG)

### **Persistencia**

* Los datos del emisor se almacenarán automáticamente en `localStorage`.

* El logo será convertido a base64 mediante FileReader API.

* Persistencia con debounce de 1 segundo.

---

## **RF-02: Creación de Factura**

### **Datos obligatorios:**

* Número de factura

* Fecha de emisión

* Fecha de vencimiento

* Datos del receptor:

  * Nombre / Empresa

  * NIF / CIF

  * Dirección

  * Email

### **Numeración automática**

* Sistema incremental persistido en `localStorage`

* Editable manualmente

* Validación de duplicados en entorno local

---

## **RF-03: Gestión de Partidas (Items)**

Tabla interactiva con:

* Descripción

* Cantidad (\> 0\)

* Precio unitario (≥ 0\)

* Total automático no editable

Debe permitir:

* Añadir filas

* Eliminar filas

* Reordenar partidas (opcional)

Validación obligatoria:

* Debe existir al menos una partida

---

## **RF-04: Cálculos Monetarios**

⚠️ Todos los cálculos monetarios deberán realizarse:

* En centavos (enteros) o

* Mediante librería de precisión decimal (decimal.js)

Se calculará en tiempo real:

* Subtotal

* Impuesto global configurable (%)

* Total final

Los valores mostrados estarán siempre formateados, pero internamente se almacenarán en centavos.

---

## **RF-05: Internacionalización de Moneda**

Selector de divisas:

* EUR (€) — por defecto

* USD ($)

* MXN ($)

* GBP (£)

El formateo numérico se realizará mediante `Intl.NumberFormat` según región.

---

## **RF-06: Motor de Plantillas**

Se ofrecerán 3 estilos visuales:

### **1\. Modern Dark**

* Fondos oscuros

* Bordes con acentos neón

* Alto contraste

### **2\. Corporate Minimal**

* Blanco y negro

* Tipografías serif

* Estética formal

### **3\. Creative Blue**

* Acentos azul cobalto

* Diseño asimétrico

* Enfoque visual creativo

El cambio de plantilla será instantáneo y afectará al preview y al PDF.

---

## **RF-07: Exportación a PDF**

* Generación a partir del componente `InvoiceCanvas`

* Optimizado para tamaño A4

* Calidad visual alta apta para impresión

* Escalado del canvas para mejorar nitidez

Nombre automático:

`Factura_[Numero]_[Cliente].pdf`

---

## **RF-08: Persistencia Global**

Se guardará automáticamente en `localStorage`:

* Estado completo de la factura

* Perfil del emisor

* Configuración

* Último número de factura

Persistencia con debounce de 1 segundo.

---

## **RF-09: Validaciones Obligatorias**

* Campos del emisor obligatorios

* Datos del receptor obligatorios

* Al menos una partida

* Cantidad \> 0

* Precio ≥ 0

* Total no editable manualmente

* Email validado por patrón

* Impuesto entre 0% y 100%

---

# **4\. 🧱 Estructura de Datos (Modelo Local)**

`{`  
  `"invoice": {`  
    `"number": "2026-001",`  
    `"issueDate": "2026-02-16",`  
    `"dueDate": "2026-03-16"`  
  `},`  
  `"sender": {`  
    `"name": "",`  
    `"taxId": "",`  
    `"address": "",`  
    `"email": "",`  
    `"phone": "",`  
    `"logo": "base64_string"`  
  `},`  
  `"receiver": {`  
    `"name": "",`  
    `"taxId": "",`  
    `"address": "",`  
    `"email": ""`  
  `},`  
  `"settings": {`  
    `"currency": "EUR",`  
    `"taxRate": 21,`  
    `"template": "modern"`  
  `},`  
  `"items": [`  
    `{`  
      `"id": "uuid",`  
      `"desc": "Servicios Web",`  
      `"qty": 1,`  
      `"price": 120000`  
    `}`  
  `],`  
  `"totals": {`  
    `"subtotal": 120000,`  
    `"taxAmount": 25200,`  
    `"total": 145200`  
  `},`  
  `"notes": "",`  
  `"paymentMethod": "Transferencia bancaria"`  
`}`

Todos los valores monetarios se almacenan en centavos.

---

# **5\. 📱 Arquitectura de Información**

| Sección | Componente | Propósito |
| ----- | ----- | ----- |
| Sidebar Izquierdo | EditorPanel | Entrada de datos, carga de logo, selección de plantilla |
| Centro (Preview) | InvoiceCanvas | Renderizado A4 en tiempo real |
| Header | ActionBar | Descargar PDF, Limpiar formulario, Cambiar divisa |

---

# **6\. 🎨 Requisitos No Funcionales**

## **Estética Premium**

* Uso de `shadow-2xl`

* `backdrop-blur`

* Transiciones suaves

* Microinteracciones en botones

* Tipografía consistente

## **Responsive Design**

* En móvil se reemplaza sidebar por flujo Stepper

* Preview adaptado a scroll vertical

* Botones accesibles y táctiles

## **Rendimiento**

* Carga inicial \< 1.5s

* Lazy loading de fuentes

* Optimización de imágenes

* Evitar re-renderizados innecesarios

---

# **7\. 🔐 Limitaciones Técnicas**

* Aplicación 100% client-side

* No garantiza numeración única entre dispositivos

* No reemplaza software de facturación legal certificado

* PDF basado en render HTML (puede tener limitaciones en efectos complejos)

---

# **8\. 🧠 Consideraciones Técnicas Clave**

* Uso de Zustand para estado global

* React Hook Form para validaciones controladas

* Separación clara entre:

  * Estado

  * Lógica de cálculo

  * Renderizado visual

* Cálculos monetarios aislados en utilidades puras

---

# **9\. 📈 Posibles Mejoras Futuras**

* Historial local de facturas

* Exportar / Importar JSON

* Duplicar factura

* Soporte múltiples impuestos

* Modo claro / oscuro global

* Versión SaaS con backend

