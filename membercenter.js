const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")

//後端自動跳轉連結
router.get('/',(req,res)=>{
    res.redirect(req.baseUrl+'/list')
})

//顯示會員資料
router.get('/list',(req,res)=>{
    // res.send('ok')
    db.query("SELECT * FROM `member` WHERE `memberid` = 'M002'")
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
router.get('/coupon',(req,res)=>{
    // res.send('ok')
    db.query(`SELECT * FROM rel_coupon_member INNER JOIN marketing ON rel_coupon_member.memberId ='M002'AND rel_coupon_member.discountID=marketing.discountID`)
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

