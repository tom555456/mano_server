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

router.post('/insertUrlParams', upload.none(), (req,res)=>{
  const output = {
      success: false
  }
  const sql = "INSERT INTO forget_password SET ?";
  //req.body.fUrl = +new Date();

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

  db.query(sql, [req.body])
      .then(([r])=>{
          output.results = r;
          if(r.affectedRows && r.insertId){
              output.success = true;

              var mailOptions = {
                from: '"Mano抹茶選物社群平台" <0126cloud@gmail.com>',
                to: email,
                subject: `Mano忘記密碼通知信`,
                html: `<div>
                <h3>以下為您的重設密碼連結：</h3>
                <a href="http://localhost:3000/mychangepassword/${req.body.fUrl}">http://localhost:3000/mychangepassword/${req.body.fUrl}</a>
                </div>`
              };
              
            // 準備發送信件
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                return console.log(err);
                }
            });

          }
          res.json(output)
      })
})



const getfUrl = async (req) => {
  let fUrl = (req.params.furl) || 0;

  const output = {
      rows: []
  }
     
  const sql = `SELECT * FROM forget_password WHERE fUrl = ${fUrl}`;
  const [r1] = await db.query(sql);    
  if(r1) output.rows = r1;

  return output;
}


router.get("/url/:furl?", async (req, res) => {
  const output = await getfUrl(req);
  res.json(output);
})



router.put('/changepassword/:username?', upload.none(), (req,res)=>{

  let username = (req.params.username) || "";


  const output = {
      success: false
  }
  const sql = `UPDATE member SET ? WHERE email = "${username}"`;

  db.query(sql, [req.body])
      .then(([r])=>{
          output.results = r;
          if(r.affectedRows && r.insertId){
              output.success = true;
          }
          res.json(output);
      })
})



router.delete('/deleteUrl', upload.none(), (req,res)=>{


      const sql2 = `DELETE FROM forget_password WHERE ?`;
      db.query(sql2, [req.body])
      .then(([r])=>{
          output.results = r;
          if(r.affectedRows && r.insertId){
              output.success = true;       

          }
          res.json(output)
      })

})



module.exports = router;
