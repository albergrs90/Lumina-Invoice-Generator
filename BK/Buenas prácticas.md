## **Documentación de Buenas Prácticas**

---

# **1️⃣ Principios Generales**

### **1.1 Separación de responsabilidades**

El proyecto debe dividir claramente:

* **UI (Presentación)** → Componentes React

* **Estado global** → Zustand

* **Formularios y validaciones** → React Hook Form

* **Cálculos monetarios** → Utilidades puras independientes

* **Exportación PDF** → Módulo aislado

Ningún componente de UI debe contener lógica de cálculo financiero compleja.

---

### **1.2 Componentes pequeños y reutilizables**

* Máximo 150–200 líneas por componente.

* Extraer subcomponentes cuando haya múltiples responsabilidades.

* Evitar componentes “God Component”.

---

### **1.3 Funciones puras para cálculos**

Todos los cálculos deben:

* Ser funciones puras

* No depender de estado React

* No modificar argumentos

* Tener tests unitarios

Ejemplo conceptual:

`calculateTotals(items, taxRate)`

---

# **2️⃣ Buenas Prácticas Financieras**

### **2.1 Precisión monetaria**

⚠️ Nunca usar `number` directamente para operaciones financieras.

Se debe:

* Trabajar en centavos (enteros), o

* Usar librería de precisión decimal

Ejemplo:

* €1200.50 → 120050 centavos

---

### **2.2 Redondeo consistente**

* Redondear solo al mostrar

* No redondear múltiples veces durante el cálculo

* Aplicar redondeo estándar (2 decimales)

---

### **2.3 Totales derivados**

Los siguientes campos deben ser derivados, nunca editables:

* subtotal

* taxAmount

* total

Se recalculan automáticamente ante cualquier cambio.

---

# **3️⃣ Gestión de Estado (Zustand)**

### **3.1 Estado mínimo necesario**

Guardar únicamente:

* Datos de factura

* Configuración

* Perfil del emisor

No guardar valores que puedan recalcularse.

---

### **3.2 Selectores para evitar re-renderizados**

Usar selectores específicos:

`useInvoiceStore(state => state.items)`

Evitar:

`useInvoiceStore()`

---

### **3.3 Persistencia controlada**

* Persistir con debounce

* No guardar en cada keypress sin control

* Validar datos antes de persistir

---

# **4️⃣ Formularios (React Hook Form)**

### **4.1 Validaciones declarativas**

Usar validaciones:

* required

* min

* pattern

* custom validators

Evitar validaciones manuales dispersas.

---

### **4.2 Inputs numéricos**

* Convertir explícitamente a número o centavos

* Nunca confiar en `type="number"` únicamente

---

### **4.3 Mensajes de error claros**

Los errores deben:

* Ser visibles

* Ser específicos

* No romper layout

---

# **5️⃣ Generación de PDF**

### **5.1 Aislamiento del módulo**

La generación de PDF debe estar en:

`/services/pdfService.ts`

No mezclar lógica PDF dentro de componentes.

---

### **5.2 Escalado del canvas**

Para mejorar nitidez:

* Renderizar con scale mayor

* Ajustar resolución manualmente

---

### **5.3 Fuentes**

* Usar fuentes web seguras

* Verificar que html2canvas las capture correctamente

---

# **6️⃣ Arquitectura de Carpetas Recomendada**

`src/`  
 `├── components/`  
 `│   ├── layout/`  
 `│   ├── invoice/`  
 `│   └── ui/`  
 `├── store/`  
 `│   └── invoiceStore.ts`  
 `├── utils/`  
 `│   ├── calculations.ts`  
 `│   ├── currency.ts`  
 `│   └── formatters.ts`  
 `├── services/`  
 `│   └── pdfService.ts`  
 `├── hooks/`  
 `├── constants/`  
 `└── types/`

Separar claramente:

* Tipos

* Constantes

* Utilidades puras

* Servicios

---

# **7️⃣ Buenas Prácticas de UX**

### **7.1 Feedback inmediato**

* Cálculos en tiempo real

* Indicador de guardado automático

* Estado disabled en botones cuando haya errores

---

### **7.2 Prevención de errores**

* Confirmación antes de limpiar formulario

* Validar antes de generar PDF

* Deshabilitar exportación si hay errores

---

### **7.3 Responsive real**

No solo adaptativo:

* En móvil usar flujo paso a paso

* Botones grandes y táctiles

* Evitar tablas demasiado densas

---

# **8️⃣ Accesibilidad (A11y)**

* Labels correctamente asociados

* Contraste mínimo WCAG AA

* Navegación por teclado

* aria-label en botones de icono

* No depender solo de color para indicar error

---

# **9️⃣ Rendimiento**

### **9.1 Evitar renders innecesarios**

* Memoizar componentes pesados

* React.memo donde sea necesario

* useCallback/useMemo solo si aporta valor real

---

### **9.2 Lazy loading**

* Cargar plantillas bajo demanda

* Optimizar imágenes

---

### **9.3 Evitar cálculos en render**

Los cálculos deben:

* Estar fuera del JSX

* Ejecutarse en selectores o utilidades

---

# **🔟 Calidad de Código**

### **10.1 TypeScript estricto (recomendado)**

Activar:

* strict: true

* noImplicitAny

* strictNullChecks

---

### **10.2 ESLint \+ Prettier**

* Reglas consistentes

* Formato automático

* Evitar código muerto

---

### **10.3 Convenciones**

* Componentes → PascalCase

* Hooks → useCamelCase

* Utilidades → camelCase

* Constantes → UPPER\_SNAKE\_CASE

---

# **11️⃣ Seguridad**

Aunque sea client-side:

* Sanitizar inputs antes de renderizar

* No usar dangerouslySetInnerHTML

* Limitar tamaño del logo

* Validar tipos antes de procesar

---

# **12️⃣ Testing Recomendado**

### **Unit Tests**

* calculateTotals

* currency formatting

* validaciones críticas

### **Casos críticos a probar**

* 0.1 \+ 0.2

* Grandes cantidades

* Impuesto 0%

* Impuesto 100%

* Partidas vacías

---

# **13️⃣ Control de Versionado**

* Commits pequeños y descriptivos

* Conventional commits recomendados

* README claro

* Documentación visible en `/docs`

---

# **14️⃣ Estándares de Diseño**

* Espaciado consistente (8px scale)

* Uso coherente de sombras

* No mezclar estilos inline con Tailwind

* Mantener identidad visual consistente entre preview y PDF

---

# **🎯 Filosofía del Proyecto**

Lumina Invoice Generator no es solo un generador visual.

Es un ejercicio de:

* Precisión financiera

* Arquitectura limpia

* UX profesional

* Buenas prácticas modernas en React

