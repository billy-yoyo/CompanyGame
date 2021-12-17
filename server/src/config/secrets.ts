import { createConfigLoader } from "./config";

export interface Secrets {
    jwt: {
        secret: string;
    }
}

export const getSecretsConfig = createConfigLoader<Secrets>("secrets", "secrets.json");
