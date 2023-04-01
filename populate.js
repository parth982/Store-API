const connectDB = require('./db/connect');
require('dotenv').config();
const Prod_Model = require('./models/product');

const jsonProds = require('./products.json');


// If all these 3 Operns are Succesful then console.log() will execute & process will exit successfully as status 0.
//  Else catch Block will be executed and process will exit unsuccessfully as status 1. 
// 1) our Appln is able to Connect to our Cluster's Database  
// 2) Able to Delete all Documnets from Collection
// 3) And then able to Create Documents from data of All JSON Objects in products.json file according to Prod_Model's Schema

const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URI);
        // Making Sure All Documents are Deleted from Collection before adding New ones
        await Prod_Model.deleteMany();
        // Added an Array of Json Objects to Collection named 'prod_models' in Database 'STORE API' by creating Documents according to Schema on Prod_Model. 
        await Prod_Model.create(jsonProds);
        console.log('Successfully added All Json Objects from products.json file to STORE-API DBs Collection');
        process.exit(0);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}
start();