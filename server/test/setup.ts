import client from "../src/database/client";

afterAll(async () => {
    const deleteUserAuths = client.userAuth.deleteMany();
    const deleteUsers = client.user.deleteMany();

    await client.$transaction([
        deleteUserAuths,
        deleteUsers,
    ]);

    await client.$disconnect();
});

