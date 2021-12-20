import bodyParser = require("body-parser");
import * as express from "express";
import { getServerConfig } from "./config/server";
import { router as authRouter } from "./controllers/authController";
import exceptionHandler from "./exceptions/lib/handler";
import authMiddleware from "./middleware/authMiddleware";

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRouter);

const apiRouter = express.Router();

app.use("/api", authMiddleware, apiRouter);

app.use(exceptionHandler.middleware());

const start = async () => {
    const config = await getServerConfig();
    app.listen(config.port, config.host, () => {
        console.log(`App started, bound to http://${config.host}:${config.port}`);
    })
};

start();
