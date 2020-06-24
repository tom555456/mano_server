const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")

//顯示mall的首頁
router.get('/',(req,res)=>{
    // res.send('ok')
    db.query(`SELECT * FROM items LIMIT 1,20`)
        .then(([rows])=>{
            res.json(rows);
        })
})

module.exports = router;
