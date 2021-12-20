import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getServerConfig } from "../../src/config/server";

export class ApiCaller {
    private config: AxiosRequestConfig;
    public $: AxiosInstance;
    
    constructor(config: AxiosRequestConfig) {
        this.config = config;
        this.$ = axios.create(config);
    }

    withToken(token: string) {
        return new ApiCaller({
            ...this.config,
            headers: {
                ...(this.config?.headers || {}),
                "Authorization": `Bearer ${token}`
            }
        });
    }

    withPath(path: string) {
        return new ApiCaller({
            ...this.config,
            baseURL: `${this.config.baseURL}${path}`
        });
    }
}

export const createApiCaller = async () => {
    const serverConfig = await getServerConfig();
    const url = `http://${serverConfig.host}:${serverConfig.port}`;
    return new ApiCaller({
        baseURL: url,
        timeout: 5000
    });
}

