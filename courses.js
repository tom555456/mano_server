const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")

const getData = async (req) => {
    const perPage = 5;
    let page = parseInt(req.params.page) || 1;
    let courseCategoryId = parseInt(req.params.courseCategoryId) || null;
    let catIds = (req.params.catIds) || "";
    let courseId = (req.params.courseId) || "";
    // let parentId = (req.params.parentId) || "";

    const output = {
        catIds: catIds,
        courseId: courseId,
        // parentId: parentId,
        courseCategoryId: courseCategoryId,
        page: page,
        perPage: perPage,
        totalRows: 0,
        totalPages: 0,
        rows: [],
        allData: []
    }
    
    
    // let [r1] = "";
    // if (itemCategoryId) [r1] = await db.query(`SELECT COUNT(1) num FROM items WHERE itemCategoryId = ${itemCategoryId}`);
    // else [r1] = await db.query("SELECT COUNT(1) num FROM items ");
    let [r1] = "";
    // if (catIds)[r1] = await db.query(`SELECT COUNT(1) num FROM course 
    // INNER JOIN rel_course_cat ON rel_course_cat.courseId = course.courseId
    // INNER JOIN category ON category.categoryId = rel_course_cat.categoryId
    // WHERE rel_course_cat.categoryId = ${catIds}`);
    // else [r1] = await db.query('SELECT COUNT(1) num FROM course INNER JOIN category ON course.courseCategoryId = category.categoryId');
    
    if (catIds) {

        if (catIds == 26) {
            [r1] = await db.query('SELECT COUNT(1) num FROM course INNER JOIN category ON course.courseCategoryId = category.categoryId');
         }else {
            [r1] = await db.query(`SELECT COUNT(1) num FROM course 
            INNER JOIN rel_course_cat ON rel_course_cat.courseId = course.courseId
            INNER JOIN category ON category.categoryId = rel_course_cat.categoryId
            WHERE rel_course_cat.categoryId = ${catIds}`);
            
            }

   } else {
    [r1] = await db.query('SELECT COUNT(1) num FROM course INNER JOIN category ON course.courseCategoryId = category.categoryId');
        }
    
    //const [r1] = await db.query(`SELECT COUNT(1) num FROM course`);
    let [r0] = "";
    const sql = `SELECT * FROM course INNER JOIN category ON course.courseCategoryId  = category.categoryId `;
    [r0] = await db.query(sql);
    if(r0) output.allData = r0;
    
        
    output.totalRows = r1[0].num;
    output.totalPages = Math.ceil(r1[0].num / perPage);
    if(output.totalPages === 0) page = 1;
    else if(page > output.totalPages) page = output.totalPages;
    else if(page < 1) page = 1;
    output.page = page;
    if(!output.page){
        return res.json(output);
    }

    //const sql = `SELECT * FROM items WHERE itemCategoryId = ${itemCategoryId} LIMIT ${(page-1) * perPage}, ${perPage}`;
    // const sql2 = `SELECT * FROM items LIMIT ${(page-1) * perPage}, ${perPage}`;
    //const sql3 = `SELECT * FROM course INNER JOIN category ON course.courseCategoryId = category.categoryId WHERE course.courseCategoryId in (${catIds}) LIMIT ${(page-1) * perPage}, ${perPage}`;
    const sql4 = `SELECT * FROM course INNER JOIN category ON course.courseCategoryId = category.categoryId LIMIT ${(page-1) * perPage}, ${perPage}`;
    const sql3 = `SELECT * FROM course 
    INNER JOIN rel_course_cat ON rel_course_cat.courseId = course.courseId
    INNER JOIN category ON category.categoryId = rel_course_cat.categoryId
    WHERE rel_course_cat.categoryId = ${catIds} LIMIT ${(page-1) * perPage}, ${perPage}`

    //const sql5 = `SELECT * FROM course WHERE course.courseId = ${courseId}`;

    
   
    // let [r2] = "";
    // if (itemCategoryId) [r2] = await db.query(sql);    
    // else [r2] = await db.query(sql2);
    // let [r2] = "";
    // if (catIds) [r2] = await db.query(sql3); 
    // else [r2] = await db.query(sql4);

    if (catIds) {

        if (catIds == 26) {
         [r2] = await db.query(sql4)
         }else {
        [r2] = await db.query(sql3)
            }

    }else {
            [r2] = await db.query(sql4)
        }

    
    

    // let [r3] = "";
    // if (parentId) [r3] = await db.query(sql);
   
    // for(let i of r2) {
    //     i.birthday = moment(i.birthday).format("YYYY-MM-DD");
    // }
    if(r2) output.rows = r2 ;
    
   
    return output;
    
}


router.get("/:page?", async (req, res) => {
    const output = await getData(req); 
    res.json(output);

})

router.get("/:catIds?/:page?", async (req, res) => {
    const output = await getData(req); 
    res.json(output);

})

// router.get("/courseDetail/:courseId?",(req, res) => {
//     db.query(`SELECT * FROM course WHERE course.courseId = ${courseId}`)
//     .then(([output])=>{
//         res.json(output);
//     })

// })




// router.get("/:itemCategoryId?/:page?", async (req, res) => {
//     const output = await getData(req); 
//     res.json(output);

// })

module.exports = router;
