const mongoose = require('mongoose');
const uri = "mongodb+srv://pms:pms@cluster0-64z9d.mongodb.net/pmscluster?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

var conn = mongoose.Collection;

var passwordSchema = new mongoose.Schema({

    password_category: {
        type: String,
        required: true,
      
    },

    password_details: {
        type: String,
        required: true,
       
    },



    date: {
        type: Date,
        default: Date.now
    }



});

var passwordModel = mongoose.model('passwordschema', passwordSchema);
module.exports = passwordModel;