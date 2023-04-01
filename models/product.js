const mongoose = require('mongoose');


const Prod_Schema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, '{Product Name must be Provided']
    },
    price:{
        type: Number,
        required: [true, '{Product Number must be Provided']
    },
    featured:{
        type: Boolean,
        default: false 
    },
    rating:{
        type: Number,
        default: 4.5
    },
    CreatedAt:{
        type: Date,
        default: Date.now()
    },
    company:{
        type: String,
        enum: {
            values: ['ikea','liddy','caressa','marcos'],
            message: 'Company {VALUE} is Not Supported'
        }
    }
});

module.exports = mongoose.model('Prod_Model',Prod_Schema);