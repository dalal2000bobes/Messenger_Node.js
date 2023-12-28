var express = require('express');
var router = express.Router();

const crypto = require('crypto');
 const CryptoJS = require('crypto-js');

 const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

 function encryptAES(text) {
    var key = "AES key for encfor message @2023"; 
    var iv  = "mHGFxENnZLbienLngd5*bhhhfyANoi.e";

    key = CryptoJS.enc.Base64.parse(key);
    iv = CryptoJS.enc.Base64.parse(iv)

    var cipherData = CryptoJS.AES.encrypt(text, key, { iv: iv });
    return cipherData;
 }

 function dencryptAES(text) {
    var key = "AES key for encfor message @2023"; 
    var iv  = "mHGFxENnZLbienLngd5*bhhhfyANoi.e";

    key = CryptoJS.enc.Base64.parse(key);
    iv = CryptoJS.enc.Base64.parse(iv);

    var data = CryptoJS.AES.decrypt(text, key, { iv: iv });
    return data;
 }


router.post('/sign', function(req, res, next) {
  let data = req.body.data
  let privateKey = req.body.privateKey

  privateKey = dencryptAES(privateKey)

  privateKey = crypto.createPrivateKey({
    key : Buffer.from(privateKey,'base64'),
    type : 'pkcs8',
    formate : 'der'
  });

  const sign = crypto.createSign('SHA256')
  sign.update(data)
  sign.end()
  const signature = sing.sign(privateKey).toString('base64')
  res.send({data,signature});
});

router.post('/verify', function(req, res, next){
    let {data , publicKey , signature} = req.body
    publicKey = crypto.createPublicKey({
        key : Buffer.from(publicKey,'base64'),
        type : 'spki',
        formate : 'der'
      });

    const verify = crypto.Verify("SHA256")
    verify.update(data)
    verify.end()

    let result = verify.verify(publicKey,Buffer.from(signature,'base64'))
    res.send({verify : result})
})

module.exports = router;
