<template>

<div class="page">

<h1>Create Event</h1>

<form @submit.prevent="create">

<input v-model="title" placeholder="Title" required>

<textarea v-model="description" placeholder="Description"></textarea>

<input v-model="location" placeholder="Location" required>

<input v-model="date" type="date" required>

<input v-model.number="totalSeats" type="number" placeholder="Seats" required>

<button>Create</button>

</form>

</div>

</template>

<script>

import API from "../api"

export default{

data(){

return{
title:"",
description:"",
location:"",
date:"",
totalSeats:10
}

},

methods:{

async create(){

try{

await API.post("/events",{
title:this.title,
description:this.description,
location:this.location,
date:this.date,
totalSeats:this.totalSeats
})

alert("Event created")

this.$router.push("/dashboard")

}catch(err){

alert("Erreur création")

}

}

}

}

</script>

<style scoped>

.page{
max-width:600px;
margin:auto;
padding:40px;
}

form{
display:flex;
flex-direction:column;
gap:15px;
}

input,textarea{
padding:10px;
border:1px solid #ddd;
border-radius:6px;
}

button{
background:#6366f1;
color:white;
border:none;
padding:12px;
border-radius:8px;
cursor:pointer;
}

</style>