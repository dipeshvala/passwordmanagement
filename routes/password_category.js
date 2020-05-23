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

/* GET password_category page. */
router.get('/', checkLoginUser, function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
    getpasscats.exec((err, data) => {
        if (err) throw err;
        res.render('password_category', { title: 'Password Category', namelog: userlog, records: data });

    });
});



/* route of delete password category */
router.get('/delete/:id', checkLoginUser, function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
    var passcat_id = req.params.id;

    var passdel = passcatModel.findByIdAndDelete(passcat_id);

    passdel.exec((err) => {

        if (err) throw err;

        res.redirect('/password_category');

    });


});



/* route of edit password category */
router.get('/edit/:id', checkLoginUser, function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
    var passcat_id = req.params.id;

    var getpasscategory = passcatModel.findById(passcat_id);

    getpasscategory.exec((err, data) => {

        if (err) throw err;

        res.render('edit_pass_category', { title: 'Add New Password Category', namelog: userlog, error: '', success: '', records: data, id: passcat_id });


    });


});


/* route of post to  edit password category */
router.post('/edit/', checkLoginUser, function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
    var passcat_id = req.body.id;

    var passcategory = req.body.password_category_name;


    var update_passcategory = passcatModel.findByIdAndUpdate(
        passcat_id, { password_category: passcategory });

    update_passcategory.exec((err, doc) => {
        if (err) throw err;

        res.redirect('/password_category');
    });




});


module.exports = router;



