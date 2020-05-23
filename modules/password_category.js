const mongoose = require('mongoose');
const uri = "mongodb+srv://pms:pms@cluster0-64z9d.mongodb.net/pmscluster?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

var conn = mongoose.Collection;

var passcatSchema=new mongoose.Schema({

    password_category:{ type:String,
        required:true,
        index:{
            unique:true,
        }},

   

    date:{
        type:Date,
        default:Date.now
    }



});

var passcatModel=mongoose.model('passcategory',passcatSchema);
module.exports=passcatModel;