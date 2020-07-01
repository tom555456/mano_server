const express        = require('express');
// const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db = require(__dirname + "/db-connect");
const cors = require('cors');
const upload = require(__dirname+'/upload-module1')
// const ObjectID = require('mongodb').ObjectID;
// const app = express();
const router = express.Router(); 

// app.use(cors());
// app.options('*', cors());
// app.use('/', router);


// const { DB_URL } = require('./config.json');

// const url = process.env.PROD_MONGODB || DB_URL;

// router.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

const getDatastory= async (req)=>{
    const perPage=50;
    let page = parseInt(req.params.page) || 1;
    const output ={
        perPage: perPage,
        totalRows:0,
        totalPage:0,
        rows:[]
    };
    const [r1]=await db.query("SELECT COUNT(1) num FROM `story` ORDER BY story.id DESC");
    //const miz = output.rows
    output.totalRows=r1[0].num;
    output.totalPage= Math.ceil(output.totalRows/output.perPage);
    if(page<1)page=1;
    if(page>output.totalPage)page=output.totalPage;
    if(output.totalPage===0)page=0;
    output.page=page;
    if(! output.page){
        return output;
    }
    const sql =`SELECT * FROM story ORDER BY story.id DESC LIMIT ${(page-1)*perPage}, ${perPage}`;
    const [r2]= await db.query(sql);
    if(r2)output.rows=r2;
    // for(let i of r2){
    //     i.birthday = moment(i.birthday).format('YYYY-MM-DD');
    // }
    return output;
};

router.get("/:page?", async (req, res) => {    
    const output = await getDatastory(req); 
    res.json(output);
    // console.log(output)

})
// router.get("/", (req, res) => {
//     db.query("SELECT * FROM `story`") 
//     .then(([rows])=>{
//          res.json(rows);
//     })
   
    // console.log(output)

//})


router.post('/',upload.none(),(req, res) => {
    const output = {success:false};
    const sql = "INSERT INTO story SET ?";
    //req.body.created_at = new Date();
    console.log(req.body);
    db.query(sql, [req.body])
    .then(([r])=>{
         output.results=r;
         if(r.affectedRows && r.insertId){
            output.success = true;
        }
        res.json(output);
     })
});

// router.post('/',upload.none(),(req, res) => {
//     const sql = "INSERT INTO story SET ?";
//     db.query(sql,[req.body])
//     .then(([rows])=>{
//         res.json(rows);
//    })
// });

// router.put('/upimg',  (req, res)=>{
//     const sql =`UPDATE story \
//     SET \
//     storyImg="${req.body.storyImg}" \
//     WHERE cid =  "${req.body.cid}"`
//     db.query(sql)
//         .then(res.send(sql))
router.post('/try-upload2', upload.single('avatar'), (req, res)=>{
    res.json({
        filename:req.file.filename,  
        body:req.body
    })
    //測試postman
    //console.log(req.file)
})


router.put('/:id?', upload.none(), (req, res)=>{
    const output = {
        success: false,
        body: req.body
    }
    let id = req.params.id;
   //console.log(id)
    // if(! id){
    //     output.error = '沒有主鍵';
    //     return res.json(output);
    // }
   const sql = "UPDATE `story` SET ? WHERE cid = ? ";
   delete req.params.id;
    // console.log(req.body);
    db.query(sql, [req.body, id])
       .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.changedRows){
                output.success = true;
            }
            res.json(output);
        })
});

router.delete('/:id', (req, res)=>{
    const output = {success:false};
    //let referer = req.get('Referer'); // 從哪裡來
    const sql = "DELETE FROM `story` WHERE `story`.`id` = ? ";
    console.log(req.params.id);

    db.query(sql, [req.params.id])
        .then(([r])=>{
        if(r.affectedRows && r.insertId){
            output.success = true;
        }
        res.json(output);
    })
});


    
// router.get('/story', (req, res) => {
//     db.query(`SELECT COUNT(1) num FROM marketing`).find().toArray((err, result) => {
//     if (err) return res.sendStatus(500);
//     res.send({data: result})
//   })
// })

// router.post('/story', async(req, res) => {
//     // console.log(req.body);
//     const { name, time, content } = req.body;
//     if( !name || !time || !content ){
//         res.sendStatus(403);
//     }
//     db.query(`SELECT * FROM marketing`).save(req.body, (err, result) => {
//         if (err) return res.sendStatus(500);
//         console.log('saved to database')
//         res.send(req.body);
//     });
// })

// router.delete('/story/:id', async(req, res) => {
// // console.log(req.params.id);
// if(!req.params.id){
// es.sendStatus(403);
// }
// var obj = id(req.params.id);
// db.query(`SELECT * FROM story`).remove(req.params.id, function(err, obj) {
// if (err) {
// return res.sendStatus(500);
// }
// // console.log("1 document deleted");
// res.send('delete success');
// });
// })

// router.put('/story/:id', async(req, res) => {
//     console.log(req.params.id, req.body); 
//     console.log(req.params.id);
//     if(!req.body){
//         res.sendStatus(403);
//     }
//     var newvalues = {$set: req.body};
//     // var obj = {_id: ObjectID(req.params.id)};
//     ddb.query(`SELECT * FROM marketing`).updateOne(req.params.id, newvalues, function(err, obj) {
//         if (err) return res.sendStatus(500);
//         console.log("1 document update");
//         res.send('update success');
//     });
// })

// const port = process.env.PORT || 3000;

// console.log(port);

// MongoClient.connect(url, (err, client) => {
//     if (err) return console.log(err)
//     db = client.db('ian-test')
// })

// app.listen(port, () => {
//     console.log('listening on 3000')
// })

module.exports = router;