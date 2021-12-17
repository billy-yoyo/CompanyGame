import { createConfigLoader } from "./config";

export interface Server {
    port: number;
    host: string;
}

export const getServerConfig = createConfigLoader<Server>("server.json");
