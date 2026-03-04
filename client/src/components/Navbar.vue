<template>
<nav style="background:#4f46e5;color:white;padding:15px">
EventFlow
<button style="float:right" @click="auth.logout()">Logout</button>
</nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>
