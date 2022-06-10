const express = require("express");
const cors = require('cors');
const { json } = require("express");

const app = express();
app.use(cors());

const user = [{
    user:'user1'
},{
    user:'user2'
},{
    user:'user3'
},{
    user:'user4'
},{
    user:'user5'
},]

app.get('/',(req, res)=>{
    res.send({
        message:"🍔 we have some food "
    })
});

app.get('/users',(req, res)=>{
    res.send(user)
});

app.listen(3000,()=>{
    console.log("https://localhost:3000");
})