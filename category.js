const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")


const getData = async (req) => {
    let parentId = parseInt(req.params.parentId) || 0;

    const output = {
        rows: []
    }
       
    const sql = `SELECT * FROM category WHERE categoryType = '商城' AND categoryParentId = ${parentId}`;
    const [r1] = await db.query(sql);    
    if(r1) output.rows = r1;

    return output;
}


router.get("/:parentId?", async (req, res) => {
    const output = await getData(req);
    res.json(output);
})

module.exports = router;
