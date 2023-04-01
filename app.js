const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');

const notFoundMDW =  require('./middleware/not-found');
const errorHandlerMDW = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const prods_router = require('./routes/products');

app.get('/',(req,res)=>{
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products Route<a/>');
});

app.use('/api/v1/products',prods_router);

app.use(notFoundMDW);
app.use(errorHandlerMDW);

const port = process.env.PORT || 3000; 

const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port,console.log(`Server Listening on the Port ${port}...`));
    }catch (error) {console.log(error)}
}
start();