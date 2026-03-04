
<template>
  <Navbar v-if="auth.isAuthenticated"/>
  <div style="padding:40px">
    <router-view/>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
</script>
