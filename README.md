# Aplicativo de Contacto con Vue 3, Vite y Firebase

Este proyecto es una aplicación web de formulario de contacto construida con **Vue 3** y **Vite** en el frontend, y **Firebase Functions** en el backend. Permite a los usuarios enviar mensajes a través de un formulario, los cuales se almacenan en Firestore y se notifican por correo electrónico al administrador. Además, se registran métricas de uso mediante Firebase Analytics.

**La aplicación soporta modo offline para Firestore: los usuarios pueden leer y escribir mensajes sin conexión, y los cambios se sincronizan al recuperar la conexión. El envío de correos electrónicos solo ocurre cuando el backend está disponible.**

---

## Tecnologías y Funcionalidades

- **Frontend:** Vue 3 + Vite
- **Backend:** Firebase Functions (Node.js)
- **Base de datos:** Firestore
- **Email:** Notificaciones con Gmail y Nodemailer
- **Métricas:** Firebase Analytics

---

## Implementación

### Formulario de Contacto (Frontend)

- Construido con Vue 3 y Vite.
- Incluye campos de nombre, correo electrónico y mensaje.
- Validación básica de campos requeridos.
- Envío de datos al backend mediante una petición HTTP.
- Notificación visual del estado del envío.

**Ejemplo de envío de formulario:**

```js
const submitForm = async () => {
  status.value = 'Enviando...'
  try {
    const response = await fetch('http://localhost:5001/prueba-5087b/us-central1/submitContactForm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        message: message.value
      })
    })
    // ... manejo de respuesta ...
  } catch (err) {
    // ... manejo de error ...
  }
}
```

### Almacenamiento en Firestore (Backend)

- El backend recibe los datos del formulario y los almacena en una colección de Firestore.
- Se utiliza Firebase Admin SDK para interactuar con la base de datos.

**Fragmento relevante:**

```js
const docRef = await db.collection("messages").add({
  name,
  email,
  message,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
});
```

### Persistencia Offline en Firestore (Frontend)

- La aplicación soporta el uso de Firestore en modo offline, permitiendo que los usuarios puedan leer y escribir mensajes incluso sin conexión a internet. Los cambios se sincronizan automáticamente cuando la conexión se restablece.
- Se utiliza la persistencia local y soporte multi-tab de Firestore para una mejor experiencia de usuario.
- **Nota:** El envío de correos electrónicos al administrador solo se realiza cuando el backend está disponible; si el usuario está offline, el mensaje se almacena en Firestore y se enviará el correo cuando el backend procese el mensaje.

**Fragmento relevante:**

```js
// src/firebase.js
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
```

Esto asegura que los datos de Firestore estén disponibles offline y que los cambios realizados en diferentes pestañas del navegador se mantengan sincronizados.

### Notificaciones por Email (Backend)

- Al recibir un mensaje, el backend envía una notificación por correo electrónico al administrador usando Gmail y Nodemailer.
- Las credenciales de Gmail se almacenan de forma segura en el entorno de Firebase Functions.

**Fragmento relevante:**

```js
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.pass,
  },
});

await transporter.sendMail(mailOptions);
```

### Firebase Analytics (Frontend)

- Se utiliza para registrar eventos personalizados y analizar la interacción de los usuarios con el formulario de contacto.
- Se inicializa Analytics en `src/firebase.js` y se registran eventos al montar la app y al enviar el formulario.

**Ejemplo de uso:**

```js
import { analytics, logEvent } from './firebase'

onMounted(() => {
  logEvent(analytics, 'erika_hola')
})

logEvent(analytics, 'contact_form_submitted', {
  name: name.value,
  email: email.value,
  messageLength: message.value.length,
  response: data
})
```

---

## Estructura del Proyecto

```
Firebase Expert/
  ├── firebase.json
  ├── frontend/
  │   ├── src/
  │   │   ├── App.vue
  │   │   ├── firebase.js
  │   │   └── main.js
  │   ├── public/
  │   ├── package.json
  │   └── ...
  ├── functions/
  │   ├── index.js
  │   ├── package.json
  │   └── ...
  └── public/
      └── index.html
```

---

## Instalación y Uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/tu-repo.git
cd Firebase\ Expert
```

### 2. Configurar el Frontend

```bash
cd frontend
npm install
npm run dev
```

- Edita `src/firebase.js` si necesitas cambiar la configuración de Firebase.

### 3. Configurar el Backend (Functions)

```bash
cd ../functions
npm install
```

- Configura las variables de entorno para el correo de notificación:

```bash
firebase functions:config:set gmail.email="TU_EMAIL" gmail.pass="TU_PASSWORD"
```

- Despliega las funciones a Firebase:

```bash
firebase deploy --only functions
```

### 4. Emuladores Locales (opcional)

Para desarrollo local puedes usar los emuladores de Firebase:

```bash
firebase emulators:start
```

---

## Seguridad y Buenas Prácticas

- Las credenciales de Gmail se almacenan de forma segura en el entorno de Firebase Functions.

---

## Dependencias Principales

- **Frontend:** Vue 3, Vite, Firebase JS SDK
- **Backend:** Firebase Functions, Firebase Admin, Nodemailer, CORS

---

## Licencia

MIT
