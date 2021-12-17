import * as express from "express";
import { getServerConfig } from "./config/server";
import { router as authRouter } from "./controllers/auth";
import authMiddleware from "./middleware/auth";

const app = express();

app.use("/auth", authRouter);

const apiRouter = express.Router();

app.use("/api", authMiddleware, apiRouter);

const start = async () => {
    const config = await getServerConfig();
    app.listen(config.port, config.host, () => {
        console.log(`App started, bound to http://${config.host}:${config.port}`);
    })
};

start();
