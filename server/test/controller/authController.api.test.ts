import { anyString } from "jest-mock-extended";
import client from "../../src/database/client";
import { ApiCaller, createApiCaller } from "../api/api";

let api: ApiCaller;

beforeAll(async () => {
    const root = await createApiCaller();
    api = root.withPath('/auth');
})

test('Can create a user', async () => {
    const createUser = {
        nickname: 'api-nickname-create-1',
        username: 'api-username-create-1',
        password: 'password',
        email: 'api.create.1@example.com',
    };

    await expect(api.$.post('/create', createUser)).resolves.toMatchObject({
        status: 200,
        data: {
            email: createUser.email,
            nickname: createUser.nickname
        }
    });
});

test('Cannot create a user with an existing username', async () => {
    const createUser1 = {
        nickname: 'api-nickname-create-2',
        username: 'api-username-create-2',
        password: 'password',
        email: 'api.create.2@example.com',
    };

    const createUser2 = {
        nickname: 'api-nickname-create-3',
        username: 'api-username-create-2',
        password: 'password',
        email: 'api.create.3@example.com',
    };

    await expect(api.$.post('/create', createUser1)).resolves.toMatchObject({ status: 200 });
    await expect(api.$.post('/create', createUser2)).rejects.toMatchObject({ response: { status: 400 } });
});

test('Cannot create a user with an existing nickname', async () => {
    const createUser1 = {
        nickname: 'api-nickname-create-4',
        username: 'api-username-create-4',
        password: 'password',
        email: 'api.create.4@example.com',
    };

    const createUser2 = {
        nickname: 'api-nickname-create-4',
        username: 'api-username-create-5',
        password: 'password',
        email: 'api.create.5@example.com',
    };

    await expect(api.$.post('/create', createUser1)).resolves.toMatchObject({ status: 200 });
    await expect(api.$.post('/create', createUser2)).rejects.toMatchObject({ response: { status: 400 } });
});

test('Can login with valid password', async () => {
    const createUser = {
        nickname: 'api-nickname-login-1',
        username: 'api-username-login-1',
        password: 'password',
        email: 'api.login.1@example.com'
    };

    const loginUser = {
        username: createUser.username,
        password: createUser.password
    }

    const res = await api.$.post('/create', createUser);
    await expect(api.$.post('/login', loginUser)).resolves.toMatchObject({
        status: 200,
        data: {
            token: anyString()
        }
    });
});

test('Cannot login with invalid password', async () => {
    const createUser = {
        nickname: 'api-nickname-login-2',
        username: 'api-username-login-2',
        password: 'password',
        email: 'api.login.2@example.com'
    };

    const loginUser = {
        username: createUser.username,
        password: 'invalid'
    };

    await api.$.post('/create', createUser);
    await expect(api.$.post('/login', loginUser)).rejects.toMatchObject({
        response: {
            status: 401
        }
    });
});

test('Cannot login to a nonexistant username', async () => {
    const createUser = {
        nickname: 'api-nickname-login-3',
        username: 'api-username-login-3',
        password: 'password',
        email: 'api.login.2@example.com'
    };

    const loginUser = {
        username: createUser.username,
        password: createUser.password
    };

    await expect(api.$.post('/login', loginUser)).rejects.toMatchObject({
        response: {
            status: 404
        }
    });
})

test('Can authenticate with valid token', async () => {
    const createUser = {
        nickname: 'api-nickname-auth-1',
        username: 'api-username-auth-1',
        password: 'password',
        email: 'api.auth.1@example.com'
    };

    const loginUser = {
        username: createUser.username,
        password: createUser.password
    }

    await api.$.post('/create', createUser);
    const res = await api.$.post('/login', loginUser);

    const authenticateUser = {
        username: createUser.username,
        token: res.data.token
    };

    await expect(api.$.post('/authenticate', authenticateUser)).resolves.toMatchObject({
        status: 200
    })
});

test('Cannot authenticate with invalid token', async () => {
    const createUser = {
        nickname: 'api-nickname-auth-2',
        username: 'api-username-auth-2',
        password: 'password',
        email: 'api.auth.2@example.com'
    };
    
    const authenticateUser = {
        username: createUser.username,
        token: 'invalid'
    };

    await api.$.post('/create', createUser);
    await expect(api.$.post('/authenticate', authenticateUser)).rejects.toMatchObject({
        response: {
            status: 401
        }
    });
});

test('Cannot authenticate with valid token for another user', async () => {
    const createUser1 = {
        nickname: 'api-nickname-auth-3',
        username: 'api-username-auth-3',
        password: 'password',
        email: 'api.auth.3@example.com'
    };

    const loginUser1 = {
        username: createUser1.username,
        password: createUser1.password
    }

    const createUser2 = {
        nickname: 'api-nickname-auth-4',
        username: 'api-username-auth-4',
        password: 'password',
        email: 'api.auth.4@example.com'
    };
    

    await api.$.post('/create', createUser1);
    await api.$.post('/create', createUser2);

    const res = await api.$.post('/login', loginUser1);

    const authenticateUser2 = {
        username: createUser2.username,
        token: res.data.token
    };

    await expect(api.$.post('/authenticate', authenticateUser2)).rejects.toMatchObject({
        response: {
            status: 401
        }
    });
});

test('Can delete a user with a valid token', async () => {
    const createUser = {
        nickname: 'api-nickname-delete-1',
        username: 'api-username-delete-1',
        password: 'password',
        email: 'api.delete.1@example.com'
    };

    const loginUser = {
        username: createUser.username,
        password: createUser.password
    };

    const res1 = await api.$.post('/create', createUser);
    const res2 = await api.$.post('/login', loginUser);
    
    const deleteUser = {
        userId: res1.data.id,
        token: res2.data.token
    };

    await expect(api.$.post('/delete', deleteUser)).resolves.toMatchObject({ status: 200 });
});

test('Cannot delete a user with an invalid token', async () => {
    const createUser = {
        nickname: 'api-nickname-delete-2',
        username: 'api-username-delete-2',
        password: 'password',
        email: 'api.delete.2@example.com'
    };

    const res1 = await api.$.post('/create', createUser);
    
    const deleteUser = {
        userId: res1.data.id,
        token: 'invalid'
    };

    await expect(api.$.post('/delete', deleteUser)).rejects.toMatchObject({ response: { status: 401 } });
});

test('Cannot delete a user with a valid token for a different user', async () => {
    const createUser1 = {
        nickname: 'api-nickname-delete-3',
        username: 'api-username-delete-3',
        password: 'password',
        email: 'api.delete.3@example.com'
    };

    const loginUser1 = {
        username: createUser1.username,
        password: createUser1.password
    }

    const createUser2 = {
        nickname: 'api-nickname-delete-4',
        username: 'api-username-delete-4',
        password: 'password',
        email: 'api.delete.4@example.com'
    };

    await api.$.post('/create', createUser1);
    const res1 = await api.$.post('/create', createUser2);

    const res2 = await api.$.post('/login', loginUser1);
    
    const deleteUser = {
        userId: res1.data.id,
        token: res2.data.token
    };

    await expect(api.$.post('/delete', deleteUser)).rejects.toMatchObject({ response: { status: 403 } });
});
