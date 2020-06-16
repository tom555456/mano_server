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

    db.query(sql, [req.body])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;
            }
            res.json(output)
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
    const sql = "INSERT INTO order_payment set ?";

    db.query(sql, [req.body])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;
            }
            res.json(output)
        })

});





module.exports = router;