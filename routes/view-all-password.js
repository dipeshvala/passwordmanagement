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


/* GET view all password page. */
router.get('/', checkLoginUser, function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
    var perPage = 5;
    var page = req.params.page || 1;

    passwordModel.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage).exec((err, data) => {
            if (err) throw err;

            passwordModel.countDocuments({}).exec((err, count) => {
                if (err) throw err;

                res.render('view-all-password', { title: 'View All Passwords', namelog: userlog, records: data, current: page, pages: Math.ceil(count / perPage) });
            });
        });

});

/* GET view all password for pagination page. */
router.get('/:page', checkLoginUser, function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
    var perPage = 5;
    var page = req.params.page || 1;

    passwordModel.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage).exec((err, data) => {
            if (err) throw err;

            passwordModel.countDocuments({}).exec((err, count) => {
                if (err) throw err;

                res.render('view-all-password', { title: 'View All Passwords', namelog: userlog, records: data, current: page, pages: Math.ceil(count / perPage) });
            });
        });

});


/* GET view all password edit page. */
router.get('/edit/:id', checkLoginUser, function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
    var id = req.params.id;
    var getpassdetails = passwordModel.findById(id);

    getpassdetails.exec((err, data) => {
        getpasscats.exec((err, data2) => {
            if (err) throw err;

            res.render('edit_pass_details', { title: 'Edit Password Details', namelog: userlog, error: '', success: '', records: data2, record: data, id: id });

        });
    });

});


/* post view of password details upgrade. */
router.post('/edit/:id', checkLoginUser, function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
    var id = req.params.id;
    var passcat = req.body.pass_cat;
    var passdetails = req.body.pass_details;

    var editpassdata = passwordModel.findByIdAndUpdate(id,
        {
            password_category: passcat,
            password_details: passdetails
        });

    editpassdata.exec((err) => {

        if (err) throw err;

        res.redirect('/view-all-password');
    });

});



/* route of delete password */
router.get('/delete/:id', checkLoginUser, function (req, res, next) {
    var userlog = localStorage.getItem('loginuser');
    var passcat_id = req.params.id;

    var passdel = passwordModel.findByIdAndDelete(passcat_id);

    passdel.exec((err) => {

        if (err) throw err;

        res.redirect('/view-all-password');

    });


});



module.exports = router;



