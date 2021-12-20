import { MappedException } from "./lib/handler";

export class UsernameAlreadyExistsException implements MappedException {
    public username: string;
    public statusCode = 400;
    public message = () => `A user with name ${this.username} already exists`;

    constructor(username: string) {
        this.username = username;
    }
}

export class NicknameAlreadyExistsException implements MappedException {
    public nickname: string;
    public statusCode = 400;
    public message = () => `A user with name ${this.nickname} already exists`;

    constructor(nickname: string) {
        this.nickname = nickname;
    }
}

export class UsernameDoesntExistException implements MappedException {
    public username: string;
    public statusCode = 404;
    public message = () => `No user with username ${this.username} exists`;

    constructor(username: string) {
        this.username = username;
    }
}

export class UserIdDoesntExistException implements MappedException {
    public userId: number;
    public statusCode = 404;
    public message = () => `No user with id ${this.userId} exists`;

    constructor(userId: number) {
        this.userId = userId;
    }
}

export class InvalidAuthenticationException implements MappedException {
    public statusCode = 401;
    public message = "Invalid authentication";
}

export class UnauthorizedException implements MappedException {
    public statusCode = 403;
    public message = "Unauthorized";
}
