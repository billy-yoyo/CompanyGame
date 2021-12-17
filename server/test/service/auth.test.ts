import { User, UserAuth } from "@prisma/client";
import { captor, Matcher } from "jest-mock-extended";
import { CreateUser, LoginUser } from "../../src/models/auth";
import * as auth from "../../src/service/auth";
import { clientMock } from "../database/client";

test('should create new user', async () => {
    const createUser: CreateUser = {
        nickname: 'nickname',
        username: 'username',
        password: 'password',
        email: 'email'
    };

    const user: User = {
        id: 1,
        nickname: createUser.nickname,
        email: createUser.email
    };

    const userAuthCaptor = captor() as unknown as Matcher<any>;

    clientMock.user.create.mockResolvedValue(user);
    clientMock.userAuth.create.calledWith(userAuthCaptor).mockResolvedValue({} as UserAuth)

    await expect(auth.createUser(createUser)).resolves.toEqual(user);
});

test('should login to a created user', async () => {
    const cache: any = {};

    const createUser: CreateUser = {
        nickname: 'nickname',
        username: 'username',
        password: 'password',
        email: 'email'
    };

    const loginUser: LoginUser = {
        username: createUser.username,
        password: createUser.password
    };

    const user: User = {
        id: 1,
        nickname: createUser.nickname,
        email: createUser.email
    };

    const userAuthCaptor = captor();

    clientMock.user.create.mockResolvedValue(user);
    clientMock.userAuth.create.calledWith(userAuthCaptor as unknown as Matcher<any>).mockResolvedValue({} as UserAuth)
    clientMock.userAuth.findFirst.mockImplementation(() => userAuthCaptor.value)

    await expect(auth.createUser(createUser)).resolves.toEqual(user);
    await expect(auth.loginUser(loginUser)).resolves.toMatchObject({ success: true });
});
