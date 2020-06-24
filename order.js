const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")


router.get('/',(req,res)=>{

    db.query("SELECT * FROM `orders`")
        .then(([rows])=>{
            res.json(rows);
        })
})

router.get('/orderLists',(req,res)=>{

    db.query("SELECT * FROM `order_lists`")
        .then(([rows])=>{
            res.json(rows);
        })
})


router.get('/orderPayment',(req,res)=>{

    db.query("SELECT * FROM `order_payment`")
        .then(([rows])=>{
            res.json(rows);
        })
})


router.post('/insertOrder', upload.none(), (req,res)=>{
    const output = {
        success: false
    }
    const sql = "INSERT INTO orders set ?";
    //req.body.created_at = +new Date()
    req.body.item.created_at = new Date(new Date().getTime() + 28800000);
    //console.log(new Date(new Date().getTime() + 28800000))
    db.query(sql, [req.body.item])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;

                const sql2 = "INSERT INTO order_lists set ?";

                for(let i =0; i < req.body.item2.length; i++) {

                    req.body.item2[i].orderId = r.insertId;
                    db.query(sql2, [req.body.item2[i]])
                        .then(([r])=>{
                            output.results = r;
                            if(r.affectedRows && r.insertId){
                                output.success = true;
                            }
                            res.json(output)
                        })
                }
                
            }
        
        })

})

router.post('/insertOrderList', upload.none(), (req,res)=>{
    const output = {
        success: false
    }
    const sql = "INSERT INTO order_lists set ?";

    db.query(sql, [req.body])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;
            }
            res.json(output)
        })
})


router.post('/insertOrderPayment', upload.none(), (req, res)=>{ 

    const output = {
        success: false
    }

    const sql = "INSERT INTO orders set ?";
    //req.body.created_at = +new Date()
    req.body.item.created_at = new Date(new Date().getTime() + 28800000);
    //console.log(new Date(new Date().getTime() + 28800000))
    db.query(sql, [req.body.item])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;

                const sql2 = "INSERT INTO order_lists set ?";

                for(let i =0; i < req.body.item2.length; i++) {

                    req.body.item2[i].orderId = r.insertId;
                    db.query(sql2, [req.body.item2[i]])
                        .then(([r])=>{
                            output.results = r;
                            if(r.affectedRows && r.insertId){
                                output.success = true;
                            }
                        })
                }

                const sql3 = "INSERT INTO order_payment set ?";
                
                req.body.item3.orderId = r.insertId;
                db.query(sql3, [req.body.item3])
                    .then(([r])=>{
                        output.results = r;
                        if(r.affectedRows && r.insertId){
                            output.success = true;
                        }
                        res.json(output)
                    })   
            }
        
        })

});

router.get('/shopCoupon/:memberId',(req,res)=>{

    let memberId = req.params.memberId || "";
    db.query(`SELECT * FROM rel_coupon_member INNER JOIN marketing ON rel_coupon_member.memberId ='${memberId}' AND rel_coupon_member.discountID=marketing.discountID WHERE categoryType = '通用' OR categoryType = '商城'`)
        .then(([rows])=>{
            res.json(rows);
        })
})

router.get('/courseCoupon/:memberId',(req,res)=>{

    let memberId = req.params.memberId || "";
    db.query(`SELECT * FROM rel_coupon_member INNER JOIN marketing ON rel_coupon_member.memberId ='${memberId}' AND rel_coupon_member.discountID=marketing.discountID WHERE categoryType = '通用' OR categoryType = '課程' `)
        .then(([rows])=>{
            res.json(rows);
        })
})

router.get('/member/:id',(req,res)=>{

    let id = parseInt(req.params.id) || 1;

    db.query(`SELECT * FROM member WHERE id = ${id}`)
        .then(([rows])=>{
            res.json(rows);
        })
})

router.put('/discountUse',(req,res)=>{
    // console.log(req.body)
    const sql =`UPDATE rel_coupon_member \
    SET use_times = use_times + 1 \
    WHERE rel_coupon_member_id = ${req.body.relCouponId}`
    db.query(sql)
        .then(res.send(sql))
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
        html: `<div>
        <img src='cid:unique@kreata.ee' alt=''>
        <p>信件發送成功</p>
        </div>`,
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