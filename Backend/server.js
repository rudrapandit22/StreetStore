import dotenv from "dotenv";
import app from "./src/app.js";
import connectdb from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer =  async() =>{
    try{
        await connectdb();

        app.listen(PORT,()=>{
            console.log(`Server listening on port ${PORT}`);

        });

    }
    catch(error){
        console.error("Failed yo start server",error.message);
        process.exit(1);
    }

}
startServer();