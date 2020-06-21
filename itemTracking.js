const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")


const getData = async (req) => {
    let username = req.params.username || "";

    const output = {  
        username: username,
        rows: []
    }
       
    const sql = `SELECT items.itemId,items.shippingId, items.itemName, 
    items.itemImg, items.itemPrice, items.itemQty, items.itemCategoryId, items.created_at,
     items.updated_at,item_tracking.id AS itemTrackingId,item_tracking.username AS username,
      item_tracking.created_at, item_tracking.updated_at FROM items INNER JOIN item_tracking ON
       items.itemId = item_tracking.itemId WHERE item_tracking.username = '施Alice'`;
    
    // 之後要補用使用者名字抓取 WHERE username = '${username}'

    const [r1] = await db.query(sql);    
    if(r1) {
        output.rows = r1;
    }


    return output;
}

// 取得願望清單資料
router.get("/:username?", async (req, res) => {
    const output = await getData(req);
    res.json(output);
    })

// 新增願望清單資料
router.post("/add", async (req, res) => {
    const sql = `INSERT INTO item_tracking (username,itemId,itemPrice) VALUES
     ("施Alice",${req.body.itemId},${req.body.itemPrice})`
    // 之後要換成使用者名稱 "${req.body.username}",${req.body.itemId})`
    db.query(sql)
        .then(res.send(sql))
    })

// 刪除願望清單資料
router.delete("/del", async (req, res) => {
    const sql = `DELETE FROM item_tracking WHERE username = "施Alice" 
    AND itemId = ${req.body.itemId}`;
    
    db.query(sql)
        .then(res.send(sql))
})

module.exports = router;
