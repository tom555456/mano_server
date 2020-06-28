const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")

//顯示mall的首頁
router.get('/',(req,res)=>{
    // res.send('ok')
    db.query("SELECT * FROM items WHERE `itemId`='145'OR`itemId`='82'OR`itemId`='138'OR`itemId`='143'OR`itemId`='143'OR`itemId`='42'OR`itemId`='44'OR`itemId`='50'OR`itemId`LIKE'8_' order by rand() LIMIT 1,20")
        .then(([rows])=>{
            res.json(rows);
        })
})

module.exports = router;
