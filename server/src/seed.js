const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const User = require("./models/User")
const Event = require("./models/Event")

require("dotenv").config({path: "../.env"})

async function seed(){

 await mongoose.connect(process.env.MONGO_URI)

 await User.deleteMany({})
 await Event.deleteMany({})

 const password = await bcrypt.hash("123456",10)

 const admin = await User.create({
  email:"admin@test.com",
  password:password,
  role:"admin"
 })

 const organizer = await User.create({
  email:"organizer@test.com",
  password:password,
  role:"organizer"
 })

 const participant = await User.create({
  email:"participant@test.com",
  password:password,
  role:"participant"
 })

 await Event.create([
  {
   title:"Tech Conference",
   description:"Conférence tech - Vue + Node + Mongo.",
   location:"Paris",
   date:new Date("2026-03-11"),
   totalSeats:50,
   remainingSeats:49,
   organizerId:organizer._id,
   participants:[participant._id]
  },
  {
   title:"Startup Meetup",
   description:"Rencontre networking et pitch.",
   location:"Lyon",
   date:new Date("2026-03-18"),
   totalSeats:30,
   remainingSeats:30,
   organizerId:organizer._id,
   participants:[]
  }
 ])

 console.log("Seed OK")
 process.exit()
}

seed()