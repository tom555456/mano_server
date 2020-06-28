const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")

//後端自動跳轉連結
router.get('/',(req,res)=>{
    res.redirect(req.baseUrl+'/list')
})

//顯示會員資料
router.get('/list/:memberId?',(req,res)=>{
    const memberId = req.params.memberId || ''
    // res.send('ok')
    db.query(`SELECT * FROM member WHERE memberid = '${memberId}'`)
        .then(([rows])=>{
            res.json(rows);
        })
})

//修改會員資料
router.put('/edit',(req,res)=>{
    // console.log(req.body)
    const sql =`UPDATE member \
    SET memberName="${req.body.memberName}",\
    paymentCity="${req.body.paymentCity}",\
    paymentDistrict="${req.body.paymentDistrict}",\
    phone="${req.body.phone}",\
    email="${req.body.email}",\
    shipAddress="${req.body.shipAddress}",\
    memberImg="${req.body.memberImg}" ,\
    pwd="${req.body.pwd}" \
    WHERE memberid = "${req.body.memberId}"`
    db.query(sql)
        .then(res.send(sql))
})




//上傳圖片名稱到SQL
router.put('/upimg',  (req, res)=>{
    const sql =`UPDATE member \
    SET \
    memberImg="${req.body.memberImg}" \
    WHERE memberid =  "${req.body.memberId}"`
    db.query(sql)
        .then(res.send(sql))
    //測試postman
    // console.log(req.file)
    // res.send('ok')
})

//顯示折價券資料
router.get('/coupon/:memberId?',(req,res)=>{
    const memberId = req.params.memberId || ''
    // res.send('ok')
    db.query(`SELECT * FROM rel_coupon_member INNER JOIN marketing ON rel_coupon_member.memberId ='${memberId}'AND rel_coupon_member.discountID=marketing.discountID AND use_times < 1  
    ORDER BY rel_coupon_member.created_at  DESC`)
        .then(([rows])=>{
            res.json(rows);
        })
})

//顯示用過的折價券資料
router.get('/couponused/:memberId?',(req,res)=>{
    const memberId = req.params.memberId || ''
    // res.send('ok')
    db.query(`SELECT * FROM rel_coupon_member INNER JOIN marketing ON rel_coupon_member.memberId ='${memberId}'AND rel_coupon_member.discountID=marketing.discountID AND use_times > 1  
    ORDER BY rel_coupon_member.created_at  DESC`)
        .then(([rows])=>{
            res.json(rows);
        })
})

//真正存圖片
router.post('/try-upload2', upload.single('avatar'), (req, res)=>{
    res.json({
        filename:req.file.filename,  
        body:req.body
    })
    //測試postman
    console.log(req.file)
    // res.send('ok')
})


//顯示會員訂單
router.get('/memberorder/:memberId?/:page?',(req,res)=>{
    const memberId = req.params.memberId || ''
    const page = parseInt(req.params.page) || 1
    const showFirst = page * 5 - 5 
    const showLast = page * 5
    // res.send('ok')
    db.query(`SELECT * FROM order_lists INNER JOIN orders ON orders.memberId ='${memberId}'AND order_lists.orderId=orders.orderId ORDER BY paymentDate  DESC LIMIT ${showFirst},${showLast} `)
        .then(([rows])=>{
            res.json(rows);
        })
})
//顯示會員訂單-筆數
router.get('/memberorderpage/:memberId?',(req,res)=>{
    const memberId = req.params.memberId || ''
    // res.send('ok')
    db.query(`SELECT COUNT(1) AS page FROM orders WHERE memberid = '${memberId}'`)
        .then(([rows])=>{
            const finalpage = Math.ceil(rows[0].page / 5) 
            const arr =[]
            for (let i = 1; i <= finalpage; i++) {
                arr.push(i)
            }
            res.json(arr)
        })
        // .then(([rows])=>{
        //     res.json(rows);
        // })
})


//顯示詳細訂單-商品篇
router.get('/memberorderdetail/:orderId?',(req,res)=>{
    const orderId = req.params.orderId || ''
    // res.send('ok')
    db.query(`SELECT * FROM order_lists INNER JOIN orders ON order_lists.orderId=orders.orderId INNER JOIN items ON order_lists.itemId=items.itemId WHERE orders.orderId ='${orderId}'`)
        .then(([rows])=>{
            res.json(rows);
        })
})
//顯示詳細訂單-課程篇
router.get('/memberordercoursedetail/:orderId?',(req,res)=>{
    const orderId = req.params.orderId || ''
    // res.send('ok')
    db.query(`SELECT * FROM order_lists INNER JOIN orders ON order_lists.orderId=orders.orderId INNER JOIN course ON order_lists.courseId=course.courseId WHERE orders.orderId ='${orderId}'`)
        .then(([rows])=>{
            res.json(rows);
        })
})

//以下的目前沒用到
// router.get("/:memberid?/:main?", async (req, res) => {
//     const output = await getData(req); 
//     res.json(output);

// })

// router.get("/:memberid?/:coupon?", async (req, res) => {
//     const output = await getData(req); 
//     res.json(output);

// })

module.exports = router;