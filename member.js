const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")
require('dotenv').config();
const nodemailer = require("nodemailer")


const getData = async (req) => {
    let email = (req.params.email) || "";

    const output = {
        rows: []
    }
       
    const sql = `SELECT * FROM member WHERE email = "${email}"`;
    const [r1] = await db.query(sql);    
    if(r1) output.rows = r1;

    return output;
}


router.get("/:email?", async (req, res) => {
    const output = await getData(req);
    res.json(output);
})

router.post('/insertMember', upload.none(), (req,res)=>{
    const output = {
        success: false
    }
    const sql = "INSERT INTO member set ?";

    db.query(sql, [req.body])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;
            }
            res.json(output)
        })
})


router.post("/sendGmail", async (req, res) => {

    const email = req.body.email

    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
          type: "OAuth2",
          user: process.env.ACCOUNT,
          clientId: process.env.CLINENTID,
          clientSecret: process.env.CLINENTSECRET,
          refreshToken: process.env.REFRESHTOKEN,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      var mailOptions = {
        from: '"Mano抹茶選物社群平台" <0126cloud@gmail.com>',
        to: email,
        subject: "重新設定您的密碼 From:Mano抹茶選物社群平台",
        html: `<div><img src='cid:unique@kreata.ee' alt=''><p>信件發送成功</p></div>`,
        attachments: [{
          filename: 'm.jpg',
          path: __dirname + '/public/m.jpg',
          cid: 'unique@kreata.ee'
      }]
      };

      // 準備發送信件
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          return console.log(err);
        }
      });
})




module.exports = router;
