
<template>
<h2>Login</h2>
<input v-model="email" placeholder="email"/>
<input v-model="password" type="password" placeholder="password"/>
<button @click="submit">Login</button>
</template>

<script setup>
import {ref} from 'vue'
import {useAuthStore} from '../stores/auth'
import {useRouter} from 'vue-router'

const email = ref('admin@test.com')
const password = ref('123456')
const auth = useAuthStore()
const router = useRouter()

async function submit(){
 await auth.login(email.value,password.value)
 router.push('/dashboard')
}
</script>
