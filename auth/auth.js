const bcrypt = require("bcryptjs");
const Account = require("../models/Account");
const httpStatus = require("../constants/httpStatus");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signUp = async (req, res, next) => {
  const data = req.body;
  const name = data.name;
  const phoneNumber = data.phoneNumber;
  const pubKey = data.pubKey;
  const state = data.state;
  const password = await bcrypt.hash(data.password, 10);
  
  var canCreate = true;
  Account.findOne({ where: {phoneNumber: phoneNumber} }).then((account) => {
    if (account){
      canCreate = false ;
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "Account is already exist" });
    }else {
      Account.create(
        {
          name : name ,
          phoneNumber : phoneNumber ,
          password: password,
          pubKey : pubKey,
          state : state
        }
      ).then((user) => {
          Account.findOne({where : {phoneNumber: phoneNumber}}).then(info => {
            res.status(httpStatus.CREATED).send({ id : user.id });
          });
        })
        .catch((error) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error });
        });
    }
  });
};


exports.login = (req, res, next) => {
  const data = req.query;
  const phoneNumber = data.phoneNumber;
  const password = data.password;
  Account.findOne({ where: {phoneNumber: phoneNumber} }).then(async (account) => {
      if (!account)
        return res.status(httpStatus.BAD_REQUEST).send({
          message: "phone number is not correct",
        });
      isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) {
        return res.status(httpStatus.BAD_REQUEST).send({
          message: "password is not correct",
        });
      }
      res.status(httpStatus.OK).send({ id : account.id});
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error });
    });
};
