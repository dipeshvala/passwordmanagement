var express = require('express');
var router = express.Router();
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');


var userModel = require('../modules/user');
var passcatModel = require('../modules/password_category');
var passwordModel = require('../modules/add_password');



var getpasscats = passcatModel.find({});
var getpassworddata = passwordModel.find({});


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


function checkLoginUser(req, res, next) {
  var usertoken = localStorage.getItem('userToken');

  try {
    var decoded = jwt.verify(usertoken, 'logintoken');
  }
  catch (err) {
    res.redirect('/');
  }
  next();
}

function checkEmail(req, res, next) {
  var email1 = req.body.user_email;

  var check_exist_email = userModel.findOne({ email: email1 });
  check_exist_email.exec((err, data) => {
    if (err) throw err;
    else if (data) {
      return res.render('sign_up', { title: 'Register', projectname: 'Password Management System', msg: 'Email Already Exists.' });
    }
    next();
  });
}

function checkUsername(req, res, next) {
  var username = req.body.user_name;

  var check_exist_username = userModel.findOne({ username: username });
  check_exist_username.exec((err, data) => {
    if (err) throw err;
    else if (data) {
      return res.render('sign_up', { title: 'Register', projectname: 'Password Management System', msg: 'Username Already Exists.' });
    }
    next();
  });
}

/* GET addnewcategory page. */
router.get('/', checkLoginUser, function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
  
    res.render('addNewCategory', { title: 'Add New Password Category', namelog: userlog, error: '', success: '' });
  
  });



  /* post addnewcategory page. */
router.post('/', checkLoginUser, [check('password_category_name', 'Enter Password category name').isLength({ min: 1 })], function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      res.render('addNewCategory', { title: 'Add New Password Category', namelog: userlog, error: errors.mapped(), success: '' });
  
    }
    else {
      var passCatname = req.body.password_category_name;
      var passwordCatDetails = new passcatModel({
        password_category: passCatname
      });
  
      passwordCatDetails.save((err, data) => {
        if (err) throw err;
        res.render('addNewCategory', { title: 'Add New Password Category', namelog: userlog, error: '', success: 'password category inserted.' });
  
      })
  
    }
  });
  


module.exports=router;



