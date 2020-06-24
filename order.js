const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")
require('dotenv').config();
const nodemailer = require("nodemailer")



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
    req.body.item.orderNumber = +new Date()
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
    req.body.item.orderNumber = +new Date()
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
        subject: `您的訂單 ${orderNumber} 已被確認`,
        html: `<div>
        <img src='cid:unique@kreata.ee' alt=''>
        <h5>訂單明細</h5>
        <P></p>
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


router.get('/lastOrderNumber/:memberId?',(req,res)=>{

    const memberId = req.params.memberId || ''

    db.query(`SELECT orderNumber FROM orders WHERE memberid = '${memberId}' ORDER BY orderNumber  DESC`)
        .then(([rows])=>{
            res.json(rows);
        })
})





router.post('/insertOrderAndSendMail', upload.none(), (req,res)=>{
    const output = {
        success: false
    }
    const sql = "INSERT INTO orders set ?";
    req.body.item.orderNumber = +new Date()
    req.body.item.created_at = new Date(new Date().getTime() + 28800000);
    //console.log(new Date(new Date().getTime() + 28800000))

    const email = req.body.email
    let orderList = "";
    let total = 0;
    let discount = 0


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


    db.query(sql, [req.body.item])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;

                total = req.body.item.totalPrice;
                discount = req.body.item.shopDiscount;
                const sql2 = "INSERT INTO order_lists set ?";

                for(let i =0; i < req.body.item2.length; i++) {

                    req.body.item2[i].orderId = r.insertId;

                    orderList += `<tr> \
                    <td>${req.body.item2[i].itemName ? req.body.item2[i].itemName : ""}</td> \
                    <td></td> \
                    <td>${req.body.item2[i].courseName ? req.body.item2[i].courseName : ""}</td> \
                    <td></td> \
                    <td>${req.body.item2[i].checkQuantity}</td> \
                    <td></td> \
                    <td>${req.body.item2[i].checkSubtotal}</td> \
                    </tr>`; 

                    db.query(sql2, [req.body.item2[i]])
                        .then(([r])=>{
                            output.results = r;
                            if(r.affectedRows && r.insertId){
                                output.success = true;

                            }
                            res.json(output)
                        })
                }

                var mailOptions = {
                    from: '"Mano抹茶選物社群平台" <0126cloud@gmail.com>',
                    to: email,
                    subject: `您的訂單 ${req.body.item.orderNumber} 已被確認`,
                    html: `<div>
                    <img src='cid:unique@kreata.ee' alt=''>
                    <h2>感謝您於本平台完成購物</h2>
                    <hr/>
                    <h3>您的訂單明細</h3>
                    <table>
                    <thead>
                    <tr>
                      <th>商品</th>
                      <th></th>
                      <th>課程</th> 
                      <th></th>
                      <th>數量</th>
                      <th></th>
                      <th>小計</th>  
                    </tr>
                    </thead>
                    <tbody>
                      ${orderList}
                    </tbody>
                    </table>
                    <h4>折扣金額：${discount}</h4>
                    <h3>折扣後總金額：${total}</h3>
                    <hr/>
                    <p>注意：該封郵件是由系統自動寄送的通知信，請不要直接回覆此信，
                    若您需要其他協助，歡迎您透過 <a href="http://localhost:3000/mall/faq">此處</a> 進入Mano客服中心。</p>
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
                
            }
        
        })
})


router.post('/insertOrderPaymentAndSendMail', upload.none(), (req,res)=>{
    const output = {
        success: false
    }
    const sql = "INSERT INTO orders set ?";
    req.body.item.orderNumber = +new Date()
    req.body.item.created_at = new Date(new Date().getTime() + 28800000);
    //console.log(new Date(new Date().getTime() + 28800000))

    const email = req.body.email
    let orderList = "";
    let total = 0;
    let discount = 0


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


    db.query(sql, [req.body.item])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;

                total = req.body.item.totalPrice;
                discount = req.body.item.shopDiscount;
                const sql2 = "INSERT INTO order_lists set ?";

                for(let i =0; i < req.body.item2.length; i++) {

                    req.body.item2[i].orderId = r.insertId;

                    orderList += `<tr> \
                    <td>${req.body.item2[i].itemName ? req.body.item2[i].itemName : ""}</td> \
                    <td></td> \
                    <td>${req.body.item2[i].courseName ? req.body.item2[i].courseName : ""}</td> \
                    <td></td> \
                    <td>${req.body.item2[i].checkQuantity}</td> \
                    <td></td> \
                    <td>${req.body.item2[i].checkSubtotal}</td> \
                    </tr>`; 

                    db.query(sql2, [req.body.item2[i]])
                        .then(([r])=>{
                            output.results = r;
                            if(r.affectedRows && r.insertId){
                                output.success = true;

                            }
                            res.json(output)
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

                var mailOptions = {
                    from: '"Mano抹茶選物社群平台" <0126cloud@gmail.com>',
                    to: email,
                    subject: `您的訂單 ${req.body.item.orderNumber} 已被確認`,
                    html: `<div>
                    <img src='cid:unique@kreata.ee' alt=''>
                    <h2>感謝您於本平台完成購物</h2>
                    <hr/>
                    <h3>您的訂單明細</h3>
                    <table>
                    <thead>
                    <tr>
                      <th>商品</th>
                      <th></th>
                      <th>課程</th> 
                      <th></th>
                      <th>數量</th>
                      <th></th>
                      <th>小計</th>  
                    </tr>
                    </thead>
                    <tbody>
                      ${orderList}
                    </tbody>
                    </table>
                    <h4>折扣金額：${discount}</h4>
                    <h3>折扣後總金額：${total}</h3>
                    <hr/>
                    <p>注意：該封郵件是由系統自動寄送的通知信，請不要直接回覆此信，
                    若您需要其他協助，歡迎您透過 <a href="http://localhost:3000/mall/faq">此處</a> 進入Mano客服中心。</p>
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
                
            }
        
        })

})







module.exports = router;