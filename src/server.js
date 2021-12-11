const connect = require("./configs/db")
const app = require("./index")
app.listen(2400, async function(){
    await connect()
    console.log("listening on port 2400")
})