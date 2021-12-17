import T, { ModelType } from "tsplate";

export const TCreateUser = T.Object({
    nickname: T.String,
    username: T.String,
    password: T.String,
    email: T.String
});
export type CreateUser = ModelType<typeof TCreateUser>;

export const TLoginUser = T.Object({
    username: T.String,
    password: T.String
});
export type LoginUser = ModelType<typeof TLoginUser>;

export const TLoginResult = T.Object({
    token: T.Optional(T.String),
    success: T.Boolean
});
export type LoginResult = ModelType<typeof TLoginResult>;

export const TAuthenticateUser = T.Object({
    username: T.String,
    token: T.String
})
export type AuthenticateUser = ModelType<typeof TAuthenticateUser>;

export const TDeleteUser = T.Object({
    userId: T.Int,
    token: T.String
});
export type DeleteUser = ModelType<typeof TDeleteUser>;

export const TUser = T.Object({
    id: T.Int,
    nickname: T.String,
    email: T.String
});
export type User = ModelType<typeof TUser>;

export interface AuthenticatedUserResult {
    user?: User;
    success: boolean;
}
