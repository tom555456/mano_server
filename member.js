const express = require('express'); 
const db = require(__dirname + "/db-connect");
const router = express.Router(); 
const upload = require(__dirname + "/upload-module")


const getData = async (req) => {
    let email = (req.params.email) || "";

    const output = {
        rows: []
    }
       
    const sql = `SELECT * FROM member WHERE email = "${email}"`;
    const [r1] = await db.query(sql);    
    if(r1) output.rows = r1;

    return output;
}


router.get("/:email?", async (req, res) => {
    const output = await getData(req);
    res.json(output);
})

router.post('/insertMember', upload.none(), (req,res)=>{
    const output = {
        success: false
    }
    const sql = "INSERT INTO member set ?";

    db.query(sql, [req.body])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;
            }
            res.json(output)
        })
})



module.exports = router;
