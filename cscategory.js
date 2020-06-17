const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")


const getData = async (req) => {
    let parentId = parseInt(req.params.parentId) || 2;

    const output = {
        rows: []
    }
       
    //const sql = "SELECT * FROM category WHERE categoryType = '商城'";AND categoryParentId = ${parentId}
    const sql = `SELECT * FROM category WHERE categoryType = '社群' AND categoryParentId = ${parentId}`;
    //const sql = "SELECT t1.categoryName AS lev1, t2.categoryName as lev2, t3.categoryName as lev3, t4.categoryName as lev4 FROM category AS t1 LEFT JOIN category AS t2 ON t2.categoryParentId = t1.categoryId LEFT JOIN category AS t3 ON t3.categoryParentId = t2.categoryId LEFT JOIN category AS t4 ON t4.categoryParentId = t3.categoryId WHERE t1.categoryId = 1";
    
    const [r1] = await db.query(sql);    
    if(r1) {
        output.rows = r1;
        // for(let i = 0; i < output.rows.length; i++){
        //     await getData(req, output.rows[i]['categoryId']);
        // }
    }


    return output;
}


router.get("/:parentId?", async (req, res) => {
    const output = await getData(req);
    // if(output) {
    //     for(let i = 0; i < output.rows.length; i++){
    //         console.log(output.rows[i]['categoryId'])
    //         console.log(await getData(req, output.rows[i]['categoryId']));
    //     }
    // }

    res.json(output);
})

module.exports = router;
