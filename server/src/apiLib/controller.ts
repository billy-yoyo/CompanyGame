import { Router, Response, Request, NextFunction } from "express";
import { Template } from "tsplate";

interface Controller<B, Q, P, R> {
    body?: Template<B, any>;
    query?: Template<Q, any>;
    params?: Template<P, any>;
    response?: Template<R, any>;
}

interface ControllerRequest<B, Q, P> {
    req: Request,
    res: Response,
    body: B;
    query: Q;
    params: P;
}

type Handler<B, Q, P, R> = (request: ControllerRequest<B, Q, P>) => Promise<R>;
type Method = <B, Q, P, R>(path: string, controller: Controller<B, Q, P, R>, handler: Handler<B, Q, P, R>) => void;

const throwBadRequest = (res: Response, reason: string) => {
    res.status(400).send(reason);
};


export class ControllerRouter {
    public router: Router;

    public post: Method = this.createController("post");
    public get: Method = this.createController("get");
    public delete: Method = this.createController("delete");
    public patch: Method = this.createController("patch");
    public put: Method = this.createController("put");

    constructor(router: Router) {
        this.router = router;
    }

    private createController<B, Q, P, R>(
        method: keyof Router
    ): (path: string, controller: Controller<B, Q, P, R>, handler: Handler<B, Q, P, R>) => void {
        return (path, controller, handler) => {
            const route = (req: Request, res: Response, next: NextFunction) => {
                const request: ControllerRequest<B, Q, P> = {
                    req,
                    res,
                    body: {} as any,
                    params: {} as any,
                    query: {} as any
                };
                if (controller.body) {
                    if (controller.body.valid(req.body)) {
                        request.body = controller.body.toModel(req.body);
                    } else {
                        throwBadRequest(res, 'Request body does not match expected format');
                        return;
                    }
                }
                if (controller.query) {
                    if (controller.query.valid(req.query)) {
                        request.query = controller.query.toModel(req.query);
                    } else {
                        throwBadRequest(res, 'Request query does not match expected format');
                        return;
                    }
                }
                if (controller.params) {
                    if (controller.params.valid(req.params)) {
                        request.params = controller.params.toModel(req.params);
                    } else {
                        throwBadRequest(res, 'Request path parameters do not match expected format');
                        return;
                    }
                }
                handler(request).then(result => {
                    if (controller.response) {
                        result = controller.response.toTransit(result);
                        res.status(200).json(result);
                    } else {
                        res.status(200).send(result);
                    }
                }).catch((e) => {
                    next(e);
                });
            };
    
            return (this.router[method] as any)(path, route);
        };
    }
    
}


