const mongoose = require('mongoose');
const uri = "mongodb+srv://pms:pms@cluster0-64z9d.mongodb.net/pmscluster?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

var conn = mongoose.Collection;

var userSchema=new mongoose.Schema({

    username:{ type:String,
        required:true,
        index:{
            unique:true,
        }},

    email:{
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },

    password:{
        type:String,
        required:true
    },

    date:{
        type:Date,
        default:Date.now
    }



});

var userModel=mongoose.model('users',userSchema);
module.exports=userModel;