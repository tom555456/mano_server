const multer = require('multer'); 
const {v4: uuid4} = require('uuid'); 

console.log(Date.now() );

const extMap = { 
    'image/jpeg': '.jpg', 
    'image/png': '.png', 
    'image/gif': '.gif'
 };

 const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, __dirname + '/public/img-uploads')
    },
    filename: (req, file, cb)=>{
        let ext = extMap[file.mimetype];
        cb(null, Date.now() + ext)
    }
});

const fileFilter = (req, file, cb)=>{
    cb(null, !!extMap[file.mimetype]);
}

const upload = multer({storage, fileFilter});

module.exports = upload;
