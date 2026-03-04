<template>

<div class="auth-container">

  <div class="card">

    <h2>Connexion</h2>

    <input
      v-model="email"
      placeholder="Email"
      type="email"
    />

    <input
      v-model="password"
      placeholder="Mot de passe"
      type="password"
    />

    <button @click="submit">
      Se connecter
    </button>

  </div>

</div>

</template>

<script setup>

import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('admin@test.com')
const password = ref('123456')

const auth = useAuthStore()
const router = useRouter()

async function submit(){

  await auth.login(email.value,password.value)

  router.push('/dashboard')

}

</script>

<style scoped>

.auth-container{
height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:linear-gradient(135deg,#6366f1,#8b5cf6);
}

.card{
background:white;
padding:40px;
border-radius:12px;
width:320px;
box-shadow:0 10px 30px rgba(0,0,0,0.15);
display:flex;
flex-direction:column;
gap:15px;
}

h2{
text-align:center;
margin-bottom:10px;
}

input{
padding:12px;
border-radius:8px;
border:1px solid #ddd;
font-size:14px;
}

button{
padding:12px;
border:none;
background:#6366f1;
color:white;
border-radius:8px;
cursor:pointer;
font-weight:bold;
transition:0.2s;
}

button:hover{
background:#4f46e5;
}

</style>