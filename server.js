const express = require("express");
const cors = require("cors");
const moment = require("moment");




const app = express();


// parse application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false })); 
// parse application/json 
app.use(express.json());
app.use(express.static('public'))

const whitelist = [undefined, 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000']
const corsOptions = {
    credentials: true,
    origin: function(origin, cb){
        //console.log(origin);
        if(whitelist.indexOf(origin) !== -1){
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
};
app.use(cors(corsOptions));


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.use('/items', require(__dirname+'/items'))
app.use('/category', require(__dirname+'/category'))
app.use('/cscategory', require(__dirname+'/cscategory'))
app.use('/courses', require(__dirname+'/courses'))
app.use('/order', require(__dirname+'/order'))
app.use('/member', require(__dirname+'/member'))
app.use('/comment',require(__dirname+'/comment'))
app.use('/itemTracking',require(__dirname+'/itemTracking'))
app.use('/mallpagehome',require(__dirname+'/mallpagehome'))

app.use('/membercenter', require(__dirname+'/membercenter'))
//相當於const membercenter = require(__dirname+'/membercenter')//再把變數放上面




// set port, listen for requests
app.listen(3002, function(){
    console.log("successfully connect")
})