import { AuthenticatedUserResult, AuthenticateUser, CreateUser, DeleteUser, LoginResult, LoginUser, User } from "../models/auth";
import { client } from "../database/client";
import * as bcrypt from "bcrypt";
import { getSecretsConfig } from "../config/secrets";
import * as jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

const getJwtSecret = async () => {
    const secrets = await getSecretsConfig();
    return secrets.jwt.secret;
}

export const createUser = async (createUser: CreateUser): Promise<User> => {
    const hash = await bcrypt.hash(createUser.password, SALT_ROUNDS);

    const user = await client.user.create({
        data: {
            email: createUser.email,
            nickname: createUser.nickname
        }
    });
    
    await client.userAuth.create({
        data: {
            userId: user.id,
            username: createUser.username,
            passHash: hash
        }
    });

    return {
        id: user.id,
        nickname: user.nickname,
        email: user.email
    };
};

export const loginUser = async (user: LoginUser): Promise<LoginResult> => {
    const userAuth = await client.userAuth.findFirst({
        select: { passHash: true, userId: true },
        where: { username: user.username }
    });

    if (!userAuth) {
        return { success: false };
    }

    const { passHash, userId } = userAuth;
    const valid = await bcrypt.compare(user.password, passHash);
    if (valid) {
        // lasts for 1 day
        const expiry = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
        const data = { userId };
        const secret = await getJwtSecret();
        const token = jwt.sign({
            exp: expiry,
            data
        }, secret);

        return { token, success: true };
    } else {
        return { success: false };
    }
};

const decodeJwt = async (token: string) => {
    const secret = await getJwtSecret();
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    return decoded.userId;
}

export const authenticateUser = async (user: AuthenticateUser): Promise<boolean> => {
    const userAuth = await client.userAuth.findFirst({
        select: { userId: true },
        where: { username: user.username }
    });

    if (!userAuth) {
        return false;
    }
    
    try {
        const decodedUserId = await decodeJwt(user.token);
        return decodedUserId === userAuth.userId;
    } catch (err) {
        return false;
    }
};

export const authenticateAndGetUser = async (token: string): Promise<AuthenticatedUserResult> => {
    try {
        const decodedUserId = await decodeJwt(token);
        const user = await client.user.findFirst({
            where: { id: decodedUserId }
        });

        if (!user) {
            return { success: false };
        }

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname
            }
        }
    } catch (err) {
        return { success: false };
    }
}

export const deleteUser = async (user: DeleteUser): Promise<boolean> => {
    try {
        const decodedUserId = await decodeJwt(user.token);
        if (decodedUserId === user.userId) {
            await client.user.delete({
                where: { id: user.userId }
            });
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}
