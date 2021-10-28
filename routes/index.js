var express = require('express');
var router = express.Router();

var mongoose = require('../db.js');//引入对象
var Stuff = mongoose.model('Stuff');//引入模型
var Punish = mongoose.model('Punish');
var Inspect = mongoose.model('Inspect');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/hello', (req, res) => {
  res.send('Hello World!')
});

router.post('/createStuff', function(req, res){
  console.log(req.body.data);
  var stuffData = {
    u_id: req.body.u_id,
    name: req.body.name,
    position: req.body.position,
    zhongdui: req.body.zhongdui,
    dadui: req.body.dadui
  };
  var stuff = req.body;
  Stuff.create(stuff, function(err,doc){
    if(err){
      console.log(err);
    }
    else{
      console.log(doc);
      res.json({status:200})
    }
  })
});

router.post('/addInspect', function(req, res){
  var inspect = req.body;
  Inspect.create(inspect, function(err,doc){
    if(err) console.log(err);
    else{
      res.json({status:200})
    }
  })
});

router.post('/getInspect', function(req, res){
  var page = parseInt(req.body.page);
  var pageSize = parseInt(req.body.limit);
  var query_time = req.body.query_time;
  var pageTotal = 0;
  Inspect.countDocuments({inspect_time:{"$gte":query_time[0], "$lte":query_time[1]}}).exec(function(err,count){
    if(err) console.log(err);
    else{
      pageTotal = count;
    }
  });
  Inspect.find({inspect_time:{"$gte":query_time[0], "$lte":query_time[1]}}).sort({inspect_time:'desc'}).skip((page-1)*pageSize).limit(pageSize).exec(function(err,doc){
    if(err) console.log(err);
    else{
      res.json(
          {
            status:200,
            pageTotal:pageTotal,
            inspectList:doc
          }
      )
    }
  })
});
router.post('/getChaOfD', function(req, res){
  var query_time = req.body.query_time;
  Inspect.aggregate([{$match:{zhongdui:'0',type:'查哨',inspect_time:{"$gte":new Date(query_time[0]), "$lte":new Date(query_time[1])}}},{$group:{_id:"$u_id",total:{$sum:1}}},{$sort:{total: -1}}]).exec(function(err,doc){//sort为1是升序，-1为降序
    if(err) console.log(err);
    else{
      res.json(
          {
            status:200,
            info:doc
          }
      )
    }
  })
});

router.post('/getChaOfZ', function(req, res){
  var query_time = req.body.query_time;
  Inspect.aggregate([{$match:{zhongdui:{'$ne':'0'},type:'查哨',inspect_time:{"$gte":new Date(query_time[0]), "$lte":new Date(query_time[1])}}},{$group:{_id:"$u_id",total:{$sum:1}}}]).exec(function(err,doc){
    if(err) console.log(err);
    else{
      res.json(
          {
            status:200,
            info:doc
          }
      )
    }
  })
});

router.post('/getShangOfD', function(req, res){
  var query_time = req.body.query_time;
  Inspect.aggregate([{$match:{zhongdui:'0',type:'上哨',inspect_time:{"$gte":new Date(query_time[0]), "$lte":new Date(query_time[1])}}},{$group:{_id:"$u_id",total:{$sum:1}}}]).exec(function(err,doc){
    if(err) console.log(err);
    else{
      res.json(
          {
            status:200,
            info:doc
          }
      )
    }
  })
})

router.post('/getShangOfZ', function(req, res){
  var query_time = req.body.query_time;
  Inspect.aggregate([{$match:{zhongdui:{'$ne':'0'},type:'上哨',inspect_time:{"$gte":new Date(query_time[0]), "$lte":new Date(query_time[1])}}},{$group:{_id:"$u_id",total:{$sum:1}}}]).exec(function(err,doc){
    if(err) console.log(err);
    else{
      res.json(
          {
            status:200,
            info:doc
          }
      )
    }
  })
});

router.post('/addPunish', function(req, res){
  var punishData = req.body;
  Punish.create(punishData, function(err,doc){
    if(err) console.log(err);
    else{
      res.json({status:200})
    }
  })
});
router.post('/getPunish', function(req, res){
  var page = parseInt(req.body.page);
  var pageSize = parseInt(req.body.limit);
  var query_time = req.body.query_time;
  var pageTotal = 0;
  Punish.countDocuments({punish_time:{"$gte":query_time[0], "$lte":query_time[1]}}).exec(function(err,count){
    if(err) console.log(err);
    else{
      pageTotal = count;
    }
  });
  Punish.find({punish_time:{"$gte":query_time[0], "$lte":query_time[1]}}).sort({punish_time:'desc'}).skip((page-1)*pageSize).limit(pageSize).exec(function(err,doc){
    if(err) console.log(err);
    else{
      res.json(
          {
            status:200,
            pageTotal:pageTotal,
            punishList:doc
          }
      )
    }
  })
});
router.post('/getDataOfChart', function(req, res){
  var query_time = req.body.query_time;
  console.log(req.body.query_time);
  var dataOfAdd = [];
  var dataOfSub = [];
  Punish.aggregate([{$match:{type:'+', punish_time:{"$gte":new Date(query_time[0]), "$lte":new Date(query_time[1])}}},{$group:{_id:"$unit",total:{$sum:1}}},{$sort:{total: -1}}]).exec(function(err,doc){//sort为1是升序，-1为降序
    if(err) console.log(err);
    else{
      dataOfAdd = doc;
      Punish.aggregate([{$match:{type:'-', punish_time:{"$gte":new Date(query_time[0]), "$lte":new Date(query_time[1])}}},{$group:{_id:"$unit",total:{$sum:1}}},{$sort:{total: -1}}]).exec(function(err,doc){//sort为1是升序，-1为降序
        if(err) console.log(err);
        else{
          dataOfSub = doc;
          res.json(
              {
                status:200,
                info1:dataOfAdd,
                info2:dataOfSub,
              }
          );
        }
      });
    }
  });
});


module.exports = router;
