const mongoose=require("mongoose");
const Listing = require("../models/listings.js");
const User = require("../models/users.js");
const initData = require("./data.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected with DB");
}).catch((err) => {
    console.error("Error connecting to database:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDb = async()=>{
    await Listing.deleteMany({});
    let addList=await Listing.insertMany(initData.data);
 console.log(addList);
    console.log("Data was initialized");
 
 };
initDb();
