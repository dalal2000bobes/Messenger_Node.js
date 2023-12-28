const Account = require("../models/Account");
const { signUp, login } = require("./auth");

const Op = require('sequelize').Op;

const router = require("express").Router();
const { validateSignUp, validateLogin } = require("./validation");
/************************
 * @Router /api/auth *
 ************************/

router.post("/signup", validateSignUp, signUp);

router.get("/login", validateLogin, login);

router.get('/contact', function(req, res, next) {
  var data = req.query;
    Account.findAll().then((value)=>{
      var lisContant = []
      value.forEach((item)=>{
        if(item["id"] != data.id){
          lisContant.push(item)
        }
      });
        res.send(lisContant)
    })
  });

router.get('/one', function(req, res, next) {
  Account.findOne({where: {id : req.query.id}}).then((value) => {
    res.send(value)
  })
});

module.exports = router;
