var express = require('express');
var router = express.Router();

var mongoose = require('../db.js');//引入对象
var User = mongoose.model('User');//引入模型

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/logout', function(req, res, next) {
    res.json({status:200});
});

router.post('/login', function(req, res, next) {
    var username = req.body.username;
  var password = req.body.password;
    User.findOne({ 'username': username }, function (err, doc) {
    if (err) {
      console.log('find failed');
    }
    else {
        if(password == doc.password){
            res.json(
                {
                    status:200,
                    user:{
                        token: doc.username,
                        roles: [doc.role],
                        name: doc.username,
                    }
                }
            )
        }
        else{
            res.json(
                {
                    status:401,
                    message:'Login failed!'
                }
            )
        }
    }
  });
});

router.post('/info', function(req, res, next) {
    var token = req.body.token;
    User.findOne({ 'username': token }, function (err, doc) {
        if (err) {
            console.log('find failed');
        }
        else {
            res.json(
                {
                    status:200,
                    userList:{
                        token: doc.username,
                        roles: [doc.role],
                        name: doc.username,
                    }
                }
            )
        }
    });
});

module.exports = router;
