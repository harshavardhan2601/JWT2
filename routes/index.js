var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var config = require('../config/config.js');
var VerifyToken = require('../auth/VerifyToken');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login');
});

router.get('/register', function (req, res, next) {
  res.render('Register');
})


router.post('/registerdata', function (req, res, next) {
  var reqs = req.body;
  console.log(reqs);
  var registerobj = {
    first: reqs.first,
    email: reqs.email,
    password: reqs.password,
    mobile: reqs.mobile,
    status: 1,
  }
  mongoose.model('register').create(registerobj, function (err, registerObj) {
    if (err) {
      console.log(err)
    } else {
      console.log(registerObj)
      res.redirect('/');
    }
  })
})


router.post('/userslogin', function (req, res, next) {
  try {
    var reqs = req.body;
    // console.log(reqs);
    mongoose.model('register').findOne({ email: reqs.email, password: reqs.password })
      .then((Obj) => {
        console.log(Obj);
        if (Obj != null) {
          //set the sessions in

          req.session.login_Obj = Obj;
          req.session.user_id = Obj._id;
          console.log(req.session.login_Obj);
          console.log(req.session.user_id);
          //TOKEN VERIFICATIONS
          var my_iddss = Obj._id;
          console.log('checking ' + my_iddss);
          token = jwt.sign({ id: Obj._id }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
          });
          res.cookie('x_access_token', token);
          res.cookie('auth', true)

          mongoose.model('register').find({}, function(err, data) {
              if (err) {
                  console.log(err)
              } else {
                res.redirect('dashboard');
              }
          });
      } else {
        res.send({ status: 2, massage: 'Failure' });
      }
        // if (Obj) {
        //   // console.log(Obj._id);
        //   // // var user_id = Obj._id;
        //   // req.session.user_id = Obj._id;
        //   // // req.session.email_id = Obj.email;
        //   // console.log('_id======' + req.session.user_id);
        //   // // console.log('_id======' + req.session.email_id);
        //   // // console.log({ status: 1, massage: 'Success' });
        //   // // res.send({ status: 1, 'data': Obj });
        //   // // res.json({ 'data': Obj});
        //   // jwt.sign({ Obj }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        //   //   console.log(token);
        //   //   // res.send({
        //   //   //   token
        //   //   // });
        //   //   res.cookie('X_access_token', token);
        //   //   res.cookie('auth', true);
        //   // });
        //   // res.redirect('dashboard');
        // } else {
        //   res.send({ status: 2, massage: 'Failure' });
        // }

      })
  } catch (error) {
    console.log(error);
  }
})


router.get('/dashboard', function (req, res, next) {
  if (req.session.user_id != '' && req.session.user_id != undefined && req.session.user_id != null) {
    res.render('dashboard');
  } else {
    res.redirect('/');
  }
})

router.get('/profile', function (req, res, next) {
  var p = req.session.user_id;
  console.log(p);
  mongoose.model('register').findById({ _id: p }, function (err, profileObj) {
    if (err) {
      console.log(err)
    } else {
      res.render('profile', { profileObj: profileObj });
    }
  })
})

router.get('/logout', function (req, res, next) {
  console.log(req.session);
  req.session.destroy();
  res.clearCookie('x_access_token');
  res.cookie('auth', false);
  res.redirect('/');
})


module.exports = router;
