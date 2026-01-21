const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust')
}
main().then(()=>{
    console.log("Database connected Successfully");
}).catch((err)=>{
    console.log(err);
})

const initDB = async ()=>{
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({...obj,
     owner:"6967574eda52fc411fb79604"})),
   await Listing.insertMany(initData.data);
   console.log("Data was initialised");
}

initDB();