<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { analytics, logEvent, db } from './firebase'
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'

const messages = ref([])

onMounted(() => {
  try {
    logEvent(analytics, 'erika_hola')
  } catch (e) {
    console.error('❌ Error al enviar evento:', e)
  }

  // Leer mensajes en tiempo real desde Firestore
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
  onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})

const name = ref('')
const email = ref('')
const message = ref('')
const status = ref('')

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

    const data = await response.json()

    if (response.ok) {
      logEvent(analytics, 'contact_form_submitted', {
        name: name.value,
        email: email.value,
        messageLength: message.value.length
      })

      status.value = '¡Mensaje enviado con éxito!'
      name.value = ''
      email.value = ''
      message.value = ''
    } else {
      status.value = 'Error al enviar el mensaje.'
    }
  } catch (err) {
    console.error(err)
    status.value = 'Error de red o servidor.'
  }
}
</script>

<template>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <h2>Contáctanos</h2>
      <input v-model="name" placeholder="Nombre" required />
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <textarea v-model="message" placeholder="Escribe tu mensaje..." rows="5" required></textarea>
      <button type="submit">Enviar</button>
      <p class="status">{{ status }}</p>
    </form>
    <div class="messages-list">
      <h3>Mensajes recientes</h3>
      <ul>
        <li v-for="msg in messages" :key="msg.id">
          <strong>{{ msg.name }}</strong> ({{ msg.email }})<br />
          <span>{{ msg.message }}</span>
          <div style="font-size:0.8em;color:#888;">
            {{ msg.createdAt && msg.createdAt.toDate ? msg.createdAt.toDate().toLocaleString() : '' }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f2f5fa, #e3eaf3);
}

form {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
}

form h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
  text-align: center;
}

input,
textarea {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  border-color: #6c63ff;
  outline: none;
}

button {
  padding: 0.75rem;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #574fd6;
}

.status {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
  color: #333;
}

.messages-list {
  margin-top: 2rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  max-width: 400px;
  margin-left: 3rem;
}
.messages-list h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #444;
}
.messages-list ul {
  list-style: none;
  padding: 0;
}
.messages-list li {
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #eee;
}
</style>
