var express = require('express');
var Message = require('../models/Message');
var router = express.Router();

function getAllMessage(res, from , to){
  Message.findAll({
    where :{
      AccountId : [from, to],
      destination : [to, from]
    },
    order:[['createdAt', 'DESC']],
  },
  ).then((message)=>{
      if(!message){
          res.status(httpStatus.BAD_REQUEST).send({
          message: "Error",
        });
      }else{
          res.send(message);
      }
    });
}
router.post('/send', function(req, res, next) {
  var data = req.body
  Message.create({
    content : data.content,
    destination : data.destination,
    AccountId : data.AccountId,
    state : data.state
  }).then((value)=>{
    getAllMessage(res, data.AccountId, data.destination)
  })
});

router.post('/seen', function (req, res, next) {
  var data = req.body
  Message.update({
    state : "seen"
  },{ where: { id: data.id } }).then((value)=>{
    Message.findOne({where : {id : data.id}}).then((mess)=>{
      getAllMessage(res, mess.AccountId,mess.destination)
    })
  })
})

router.get('/receive', function (req, res, next) {
    const data = req.query;
    getAllMessage(res, data.from, data.to)
    // res.send(result)
})

module.exports = router;
