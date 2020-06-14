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
    const sql ="UPDATE `member` \
    SET `memberName`="+JSON.stringify(req.body.memberName)+",\
    `paymentCity`="+JSON.stringify(req.body.paymentCity)+",\
    `phone`="+JSON.stringify(req.body.phone)+",\
    `email`="+JSON.stringify(req.body.email)+",\
    `shipAddress`="+JSON.stringify(req.body.shipAddress)+",\
    `memberImg`="+JSON.stringify(req.body.memberImg)+" \
    WHERE `memberid` =  "+JSON.stringify(req.body.memberId)
    db.query(sql)
        .then(res.send(sql))
})


//以下的目前沒用到
router.get("/:memberid?/:main?", async (req, res) => {
    const output = await getData(req); 
    res.json(output);

})

router.get("/:memberid?/:coupon?", async (req, res) => {
    const output = await getData(req); 
    res.json(output);

})

module.exports = router;

