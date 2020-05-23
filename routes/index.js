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



/* GET login page. */
router.get('/', function (req, res, next) {
  var userlog = localStorage.getItem('loginuser');

  if (userlog) {
    res.redirect('/password_category');
  }
  else {
    res.render('index', { title: 'Login', projectname: 'Password Management System', msg: '' });
  }
});


/* GET signup page. */
router.get('/signup', function (req, res, next) {
  var userlog = localStorage.getItem('loginuser');

  if (userlog) {
    res.redirect('/password_category');
  }
  else {
    res.render('sign_up', { title: 'Register', projectname: 'Password Management System', msg: '' });

  }
});


router.post('/signup', checkEmail, checkUsername, function (req, res, next) {

  var username = req.body.user_name;
  var email = req.body.user_email;
  var password = req.body.user_password;
  var confirmpassword = req.body.user_confirm_password;

  if (password != confirmpassword) {
    res.render('sign_up', { title: 'Register', projectname: 'Password Management System', msg: 'Password doesnt match to confirmpassword.' });
  }
  else {

    password = bcryptjs.hashSync(password, 10);

    var userDetails = new userModel({
      username: username,
      email: email,
      password: password
    });

    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('sign_up', { title: 'Register', projectname: 'Password Management System', msg: 'User Registration Successful.' });
    });
  }

});

/* login page post method */
router.post('/', function (req, res, next) {
  var username = req.body.uname;
  var pass = req.body.password;
  var check_user = userModel.findOne({ username: username });
  check_user.exec((err, data) => {
    if (err) throw err;
    var getUserId = data._id;

    var getpass = data.password;
    if (bcryptjs.compareSync(pass, getpass)) {
      var token = jwt.sign({ userId: getUserId }, 'logintoken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginuser', username);
      res.redirect('/password_category');
    }
    else {
      res.render('index', { title: 'Login', projectname: 'Password Management System', msg: 'Invalid Username and password' });
    }

  });

});

router.get('/logout', function (req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginuser');
  res.redirect('/');
});


module.exports = router;
