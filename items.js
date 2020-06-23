const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")

const getData = async (req) => {
    const perPage = 5;
    let page = parseInt(req.params.page) || 1;
    let itemCategoryId = parseInt(req.params.itemCategoryId) || null;
    let catIds = (req.params.cartIds) || "";
    let itemId = (req.params.itemId) || "";

    const output = {
        catIds: catIds,
        itemId: itemId,
        itemCategoryId: itemCategoryId,
        page: page,
        perPage: perPage,
        totalRows: 0,
        totalPages: 0,
        rows: [],
        allData: []
    }
    

    //const [r1] = await db.query(`SELECT COUNT(1) num FROM items`);
    let [r0] = "";
    const sql = `SELECT * FROM items INNER JOIN category ON items.itemCategoryId  = category.categoryId `;
    [r0] = await db.query(sql);
    if(r0) output.allData = r0;


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

    const sql3 = `SELECT * FROM items INNER JOIN category ON items.itemCategoryId = category.categoryId WHERE items.itemCategoryId in (${catIds}) LIMIT ${(page-1) * perPage}, ${perPage}`;
    const sql4 = `SELECT * FROM items INNER JOIN category ON items.itemCategoryId = category.categoryId LIMIT ${(page-1) * perPage}, ${perPage}`;
    
    let [r2] = "";
    if (catIds) [r2] = await db.query(sql3); 
    else [r2] = await db.query(sql4);

    if(r2) output.rows = r2;
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



module.exports = router;
