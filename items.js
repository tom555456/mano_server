const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")

const getData = async (req) => {
    const perPage = 10;
    let page = parseInt(req.params.page) || 1;
    let itemCategoryId = parseInt(req.params.itemCategoryId) || null;
    let catIds = (req.params.cartIds) || "";

    const output = {
        catIds: catIds,
        itemCategoryId: itemCategoryId,
        page: page,
        perPage: perPage,
        totalRows: 0,
        totalPages: 0,
        rows: []
    }
    
    // let [r1] = "";
    // if (itemCategoryId) [r1] = await db.query(`SELECT COUNT(1) num FROM items WHERE itemCategoryId = ${itemCategoryId}`);
    // else [r1] = await db.query("SELECT COUNT(1) num FROM items ");
    let [r1] = "";
    if (catIds) [r1] = await db.query(`SELECT COUNT(1) num FROM items INNER JOIN category ON items.itemCategoryId = category.categoryId WHERE items.itemCategoryId in (${catIds})`);
    else [r1] = await db.query('SELECT COUNT(1) num FROM items INNER JOIN category ON items.itemCategoryId = category.categoryId');
        
    output.totalRows = r1[0].num;
    output.totalPages = Math.ceil(r1[0].num / perPage);
    if(output.totalPages === 0) page = 1;
    else if(page > output.totalPages) page = output.totalPages;
    else if(page < 1) page = 1;
    output.page = page;
    if(!output.page){
        return res.json(output);
    }

    // const sql = `SELECT * FROM items WHERE itemCategoryId = ${itemCategoryId} LIMIT ${(page-1) * perPage}, ${perPage}`;
    // const sql2 = `SELECT * FROM items LIMIT ${(page-1) * perPage}, ${perPage}`;
    const sql3 = `SELECT * FROM items INNER JOIN category ON items.itemCategoryId = category.categoryId WHERE items.itemCategoryId in (${catIds}) LIMIT ${(page-1) * perPage}, ${perPage}`;
    const sql4 = `SELECT * FROM items INNER JOIN category ON items.itemCategoryId = category.categoryId LIMIT ${(page-1) * perPage}, ${perPage}`;
    
    // let [r2] = "";
    // if (itemCategoryId) [r2] = await db.query(sql);    
    // else [r2] = await db.query(sql2);
    let [r2] = "";
    if (catIds) [r2] = await db.query(sql3); 
    else [r2] = await db.query(sql4);

    if(r2) output.rows = r2;
    // for(let i of r2) {
    //     i.birthday = moment(i.birthday).format("YYYY-MM-DD");
    // }
    return output;
}


router.get("/:page?", async (req, res) => {
    const output = await getData(req); 
    res.json(output);

})

router.get("/:cartIds?/:page?", async (req, res) => {
    const output = await getData(req); 
    res.json(output);

})


// router.get("/:itemCategoryId?/:page?", async (req, res) => {
//     const output = await getData(req); 
//     res.json(output);

// })

module.exports = router;
