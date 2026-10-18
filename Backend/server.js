import app from "./src/app.js";
import createServer from "./src/config/Db.js";
async function startServer() {
    await createServer();

    app.listen(3000,()=>{
        console.log("Express server is running at port 3000");
    })

}

startServer()