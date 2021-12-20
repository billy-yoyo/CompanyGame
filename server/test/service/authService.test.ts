import { User } from "@prisma/client";
import client from "../../src/database/client";
import { AuthenticateUser, CreateUser, DeleteUser, LoginUser } from "@common/models/auth";
import * as auth from "../../src/service/authService";
import { anyString } from "jest-mock-extended";

test('should create new user', async () => {
    const createUser: CreateUser = {
        nickname: 'nickname-create-1',
        username: 'username-create-1',
        password: 'password',
        email: 'create.1@example.com'
    };

    const user: Partial<User> = {
        nickname: createUser.nickname,
        email: createUser.email
    };

    await expect(auth.createUser(createUser)).resolves.toMatchObject(user);
});

test('should fail to create a user with an existing username', async () => {
    const createUser1: CreateUser = {
        nickname: 'nickname-create-2',
        username: 'username-create-2',
        password: 'password',
        email: 'create.2@example.com'
    };
    const createUser2: CreateUser = {
        nickname: 'nickname-create-3',
        username: 'username-create-2',
        password: 'password',
        email: 'create.3@example.com'
    };

    await auth.createUser(createUser1);
    await expect(auth.createUser(createUser2)).rejects.toBeDefined();
});

test('should fail to create a user with an existing nickname', async () => {
    const createUser1: CreateUser = {
        nickname: 'nickname-create-4',
        username: 'username-create-4',
        password: 'password',
        email: 'create.4@example.com'
    };
    const createUser2: CreateUser = {
        nickname: 'nickname-create-4',
        username: 'username-create-5',
        password: 'password',
        email: 'create.5@example.com'
    };

    await auth.createUser(createUser1);
    await expect(auth.createUser(createUser2)).rejects.toBeDefined();
});

test('login should succeed with correct password', async () => {
    const createUser: CreateUser = {
        nickname: 'nickname-login-1',
        username: 'username-login-1',
        password: 'password',
        email: 'login.1@example.com'
    };

    const loginUser: LoginUser = {
        username: createUser.username,
        password: createUser.password
    };

    await auth.createUser(createUser);
    await expect(auth.loginUser(loginUser)).resolves.toMatchObject({ token: anyString() });
});

test('login should fail with incorrect password', async () => {
    const createUser: CreateUser = {
        nickname: 'nickname-login-2',
        username: 'username-login-2',
        password: 'password',
        email: 'login.2@example.com'
    };

    const loginUser: LoginUser = {
        username: createUser.username,
        password: 'incorrect'
    };

    await auth.createUser(createUser);
    await expect(auth.loginUser(loginUser)).rejects.toBeDefined();
});

test('login should fail with incorrect username', async () => {
    const createUser: CreateUser = {
        nickname: 'nickname-login-3',
        username: 'username-login-3',
        password: 'password',
        email: 'login.3@example.com'
    };

    const loginUser: LoginUser = {
        username: 'incorrect',
        password: createUser.password
    };

    await auth.createUser(createUser);
    await expect(auth.loginUser(loginUser)).rejects.toBeDefined();
});

test('authentication should succeed with valid token', async () => {
    const createUser: CreateUser = {
        nickname: 'nickname-auth-1',
        username: 'username-auth-1',
        password: 'password',
        email: 'auth.1@example.com'
    };

    const loginUser: LoginUser = {
        username: createUser.username,
        password: createUser.password
    };

    await auth.createUser(createUser)
    const result = await auth.loginUser(loginUser)
    
    expect(result.token).toBeDefined();

    const authenticateUser: AuthenticateUser = {
        username: createUser.username,
        token: result.token as string
    };

    await expect(auth.authenticateUser(authenticateUser)).resolves.toBeUndefined();
});

test('authentication should fail with invalid token', async () => {
    const createUser: CreateUser = {
        nickname: 'nickname-auth-2',
        username: 'username-auth-2',
        password: 'password',
        email: 'auth.2@example.com'
    };

    await auth.createUser(createUser);

    const authenticateUser: AuthenticateUser = {
        username: createUser.username,
        token: 'invalid'
    };

    await expect(auth.authenticateUser(authenticateUser)).rejects.toBeDefined();
});

test('authentication should fail with valid token for a different user', async () => {
    const createUser1: CreateUser = {
        nickname: 'nickname-auth-3',
        username: 'username-auth-3',
        password: 'password',
        email: 'auth.3@example.com'
    };

    const createUser2: CreateUser = {
        nickname: 'othernickname-auth-3',
        username: 'otherusername-auth-3',
        password: 'otherpassword',
        email: 'other.auth.3@example.com'
    }

    const loginUser1: LoginUser = {
        username: createUser1.username,
        password: createUser1.password
    };

    await auth.createUser(createUser1);
    await auth.createUser(createUser2);

    const result = await auth.loginUser(loginUser1)
    
    expect(result.token).toBeDefined();

    const authenticateUser: AuthenticateUser = {
        username: createUser2.username,
        token: result.token as string
    };

    await expect(auth.authenticateUser(authenticateUser)).rejects.toBeDefined();
});

test('deleteing a user should succeed with a valid token', async () => {
    const createUser: CreateUser = {
        nickname: 'nickname-delete-1',
        username: 'username-delete-1',
        password: 'password',
        email: 'delete.1@example.com'
    };

    const loginUser: LoginUser = {
        username: createUser.username,
        password: createUser.password
    };

    const user = await auth.createUser(createUser);
    const result = await auth.loginUser(loginUser)
    
    expect(result.token).toBeDefined();

    const deleteUser: DeleteUser = {
        userId: user.id,
        token: result.token as string
    };

    await expect(auth.deleteUser(deleteUser)).resolves.toBeUndefined();
    await expect(client.user.findUnique({ where: { id: user.id } })).resolves.toBeNull();
});

test('deleteing a user should fail with an invalid token', async () => {
    const createUser: CreateUser = {
        nickname: 'nickname-delete-2',
        username: 'username-delete-2',
        password: 'password',
        email: 'delete.2@example.com'
    };

    const user = await auth.createUser(createUser);

    const deleteUser: DeleteUser = {
        userId: user.id,
        token: 'invalid'
    };

    await expect(auth.deleteUser(deleteUser)).rejects.toBeDefined();
    await expect(client.user.findUnique({ where: { id: user.id } })).resolves.toBeTruthy();
});

test('deleteing a user should fail with an valid token for a different user', async () => {
    const createUser1: CreateUser = {
        nickname: 'nickname-delete-3',
        username: 'username-delete-3',
        password: 'password',
        email: 'delete.3@example.com'
    };

    const createUser2: CreateUser = {
        nickname: 'othernickname-delete-3',
        username: 'otherusername-delete-3',
        password: 'otherpassword',
        email: 'other.delete.3@example.com'
    }

    const loginUser1: LoginUser = {
        username: createUser1.username,
        password: createUser1.password
    };

    const user1 = await auth.createUser(createUser1);
    const user2 = await auth.createUser(createUser2);

    const result = await auth.loginUser(loginUser1)
    
    expect(result.token).toBeDefined();

    const deleteUser: DeleteUser = {
        userId: user2.id,
        token: result.token as string
    };

    await expect(auth.deleteUser(deleteUser)).rejects.toBeDefined();

    await expect(client.user.findUnique({ where: { id: user1.id } })).resolves.toBeTruthy();
    await expect(client.user.findUnique({ where: { id: user2.id } })).resolves.toBeTruthy();
});

test('authenticate and get user should return correct user for a valid token', async () => {
    const createUser: CreateUser = {
        nickname: 'nickname-authget-1',
        username: 'username-authget-1',
        password: 'password',
        email: 'authget.1@example.com'
    };

    const loginUser: LoginUser = {
        username: createUser.username,
        password: createUser.password
    };

    const user = await auth.createUser(createUser);
    const result = await auth.loginUser(loginUser)
    
    expect(result.token).toBeDefined();

    const authResult = await auth.authenticateAndGetUser(result.token as string);
    expect(authResult.user).toMatchObject(user);
});

test('authenticate and get user should fail for an invalid token', async () => {
    await expect(auth.authenticateAndGetUser('unvalid')).rejects.toBeDefined();
});
