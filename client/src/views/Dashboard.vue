<template>

<div class="page">

  <div class="header">

    <h1>EventFlow Dashboard</h1>

    <button
      v-if="isOrganizer"
      class="create"
      @click="$router.push('/create-event')"
    >
      + Create Event
    </button>

  </div>

  <div v-if="loading" class="loading">
    Loading events...
  </div>

  <div v-if="events.length === 0 && !loading">
    Aucun événement disponible
  </div>

  <div class="grid">

    <div
      v-for="event in events"
      :key="event._id"
      class="card"
    >

      <h3>{{ event.title }}</h3>

      <p class="desc">
        {{ event.description }}
      </p>

      <div class="meta">

        <span>📍 {{ event.location }}</span>

        <span>📅 {{ formatDate(event.date) }}</span>

      </div>

      <div class="seats">
        Places restantes :
        {{ event.remainingSeats }} / {{ event.totalSeats }}
      </div>

      <button
        class="join"
        :disabled="event.remainingSeats === 0"
        @click="register(event._id)"
      >
        {{ event.remainingSeats === 0 ? "Complet" : "Participer" }}
      </button>

    </div>

  </div>

</div>

</template>

<script>

import API from "../api"
import { useAuthStore } from "../stores/auth"

export default {

data(){

return{
events:[],
loading:true
}

},

computed:{

isOrganizer(){

const auth = useAuthStore()

return auth.user?.role === "organizer" || auth.user?.role === "admin"

}

},

async mounted(){

this.loadEvents()

},

methods:{

async loadEvents(){

try{

const res = await API.get("/events")

this.events = res.data

}catch(err){

console.error(err)

}

this.loading=false

},

formatDate(date){

return new Date(date).toLocaleDateString()

},

async register(id){

try{

await API.post(`/events/${id}/register`)

alert("Inscription réussie")

// recharge la liste des événements
this.loadEvents()

}catch(err){

console.log(err.response?.data)

alert(err.response?.data?.message || "Erreur inscription")

}

}

}

}

</script>

<style scoped>

.page{

padding:40px;
max-width:1100px;
margin:auto;

}

.header{

display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:30px;

}

.create{

background:#6366f1;
color:white;
border:none;
padding:10px 16px;
border-radius:8px;
cursor:pointer;

}

.grid{

display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:20px;

}

.card{

background:white;
padding:20px;
border-radius:12px;
box-shadow:0 4px 12px rgba(0,0,0,0.08);
transition:0.2s;

}

.card:hover{

transform:translateY(-4px);

}

.desc{

color:#555;
font-size:14px;

}

.meta{

display:flex;
justify-content:space-between;
margin-top:10px;
font-size:14px;

}

.seats{

margin-top:12px;
font-size:14px;
color:#444;

}

.join{

margin-top:15px;
width:100%;
padding:10px;
border:none;
background:#10b981;
color:white;
border-radius:8px;
cursor:pointer;

}

.join:disabled{

background:#9ca3af;
cursor:not-allowed;

}

.loading{

text-align:center;
margin-top:50px;

}

</style>