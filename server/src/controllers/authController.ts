import { Router } from "express";
import { ControllerRouter } from "../apiLib/controller";
import { TAuthenticateUser, TCreateUser, TDeleteUser, TLoginResult, TLoginUser, TUser } from "@common/models/auth";
import { TSuccess } from "@common/models/general";
import * as auth from "../service/authService";
export const router = Router();
const controller = new ControllerRouter(router);

controller.post("/create", { body: TCreateUser, response: TUser }, async (req) => {
    const user = await auth.createUser(req.body);
    return user;
});

controller.post("/delete", { body: TDeleteUser }, async (req) => {
    await auth.deleteUser(req.body);
});

controller.post("/login", { body: TLoginUser, response: TLoginResult }, async (req) => {
    const result = await auth.loginUser(req.body);
    return result;
});

controller.post("/authenticate", { body: TAuthenticateUser }, async (req) => {
    await auth.authenticateUser(req.body);
});
