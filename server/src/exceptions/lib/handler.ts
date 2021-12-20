import { ErrorRequestHandler, NextFunction, Response, Request } from "express";

const isFunction = (obj: any): obj is (...args: any[]) => any => {
    return Object.prototype.toString.call(obj) === '[object Function]';
}

export interface MappedException {
    statusCode: number | (() => number);
    message: string | (() => string);
}

const isMappedException = (obj: any): obj is MappedException => {
    return (typeof obj.statusCode === 'number' || isFunction(obj.statusCode))
        && (typeof obj.message === 'string' || isFunction(obj.message));
}

class ExceptionMapper {
    returnException(res: Response, exception: any) {
        if (isMappedException(exception)) {
            const statusCode = typeof exception.statusCode === 'number' ? exception.statusCode : exception.statusCode();
            const message = typeof exception.message === 'string' ? exception.message : exception.message();
            res.status(statusCode).send(message);
            return;
        } else {
            console.error('Unhandled error', exception);
            res.status(500).send('An unknown error occured');
        }
    }

    middleware(): ErrorRequestHandler {
        const mapper = this;
        return (err: any, req: Request, res: Response, next: NextFunction) => {
            mapper.returnException(res, err);
        };
    }
}

export default new ExceptionMapper();
