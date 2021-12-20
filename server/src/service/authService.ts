import { AuthenticatedUserResult, AuthenticateUser, CreateUser, DeleteUser, LoginResult, LoginUser, User } from "@common/models/auth";
import client from "../database/client";
import * as bcrypt from "bcrypt";
import { getSecretsConfig } from "../config/secrets";
import * as jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { InvalidAuthenticationException, NicknameAlreadyExistsException, UnauthorizedException, UserIdDoesntExistException, UsernameAlreadyExistsException, UsernameDoesntExistException } from "../exceptions/auth";

const PRISMA_UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

const SALT_ROUNDS = 10;

const getJwtSecret = async () => {
    const secrets = await getSecretsConfig();
    return secrets.jwt.secret;
}

export const createUser = async (createUser: CreateUser): Promise<User> => {
    const hash = await bcrypt.hash(createUser.password, SALT_ROUNDS);

    let user;
    try {
        user = await client.user.create({
            data: {
                email: createUser.email,
                nickname: createUser.nickname
            }
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === PRISMA_UNIQUE_CONSTRAINT_VIOLATION) {
            throw new NicknameAlreadyExistsException(createUser.nickname);
        }
        throw e;
    }
    
    try {
        await client.userAuth.create({
            data: {
                userId: user.id,
                username: createUser.username,
                passHash: hash
            }
        });
    } catch (e) {
        try {
            await client.user.delete({ where: { id: user.id } });
        } catch {
        } finally {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === PRISMA_UNIQUE_CONSTRAINT_VIOLATION) {
                throw new UsernameAlreadyExistsException(createUser.username);
            }
        }
        throw e;
    }

    return {
        id: user.id,
        nickname: user.nickname,
        email: user.email
    };
};

export const loginUser = async (user: LoginUser): Promise<LoginResult> => {
    const userAuth = await client.userAuth.findUnique({
        select: { passHash: true, userId: true },
        where: { username: user.username }
    });

    if (!userAuth) {
        throw new UsernameDoesntExistException(user.username);
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

        return { token };
    } else {
        throw new InvalidAuthenticationException();
    }
};

const decodeJwt = async (token: string) => {
    const secret = await getJwtSecret();
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    return decoded.data.userId;
}

export const authenticateUser = async (user: AuthenticateUser): Promise<void> => {
    const userAuth = await client.userAuth.findUnique({
        select: { userId: true },
        where: { username: user.username }
    });

    if (!userAuth) {
        throw new UsernameDoesntExistException(user.username);
    }
    
    try {
        const decodedUserId = await decodeJwt(user.token);
        if (decodedUserId !== userAuth.userId) {
            throw new InvalidAuthenticationException();
        }
    } catch (err) {
        throw new InvalidAuthenticationException();
    }
};

export const authenticateAndGetUser = async (token: string): Promise<AuthenticatedUserResult> => {
    let decodedUserId;
    try {
        decodedUserId = await decodeJwt(token);
    } catch (err) {
        throw new InvalidAuthenticationException();
    }
    const user = await client.user.findUnique({
        where: { id: decodedUserId }
    });

    if (!user) {
        throw new UserIdDoesntExistException(decodedUserId);
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname
        }
    }
}

export const deleteUser = async (user: DeleteUser): Promise<void> => {
    let decodedUserId;
    try {
        decodedUserId = await decodeJwt(user.token);
    } catch (err) {
        throw new InvalidAuthenticationException();
    }
    if (decodedUserId === user.userId) {
        const deleteUserAuth = client.userAuth.delete({
            where: { userId: user.userId }
        });
        const deleteUser = client.user.delete({
            where: { id: user.userId }
        })
        
        await client.$transaction([deleteUserAuth, deleteUser]);
    } else {
        throw new UnauthorizedException();
    }
}
