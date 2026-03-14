import { defineStore } from 'pinia'
import API from '../api'

export const useAuthStore = defineStore('auth',{

 state:() => ({
   token: localStorage.getItem('token') || '',
   user: JSON.parse(localStorage.getItem('user') || 'null')
 }),

 getters:{
   isAuthenticated:(s)=>!!s.token
 },

 actions:{

   async login(email,password){

     const res = await API.post('/auth/login',{email,password})

     this.token = res.data.token
     this.user = res.data.user

     localStorage.setItem('token',this.token)
     localStorage.setItem('user',JSON.stringify(this.user))

   },

   logout(){

     this.token=''
     this.user=null

     localStorage.removeItem('token')
     localStorage.removeItem('user')

   }

 }

})