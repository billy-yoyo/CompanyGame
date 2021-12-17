import { RequestHandler } from "express";
import * as auth from "../service/auth";

const authMiddleware: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).send("No credentials supplied");
    }

    const parts = authHeader.split(" ");
    const type = parts[0];
    const token = parts.slice(1).join(" ");

    if (type === "Bearer") {
        auth.authenticateAndGetUser(token).then(result => {
            if (result.success) {
                res.locals.user = result.user;
                next();
            } else {
                res.status(403).send("Invalid token");
            }
        });
    } else {
        return res.status(403).send("Invalid token");
    }
};

export default authMiddleware;
