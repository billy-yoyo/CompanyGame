import { RequestHandler } from "express";
import * as auth from "../service/authService";

const authMiddleware: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("No credentials supplied");
    }

    const parts = authHeader.split(" ");
    const type = parts[0];
    const token = parts.slice(1).join(" ");

    if (type === "Bearer") {
        auth.authenticateAndGetUser(token).then(result => {
            res.locals.user = result.user;
            next();
        }).catch(() => {
            res.status(401).send("Invalid token");
        });
    } else {
        return res.status(401).send("Invalid token");
    }
};

export default authMiddleware;
