import { readFile } from "fs/promises";
import * as path from "path";

export const loadConfig = async <T>(...filePath: string[]): Promise<T> => {
    const file = await readFile(path.join("config", ...filePath));
    return JSON.parse(file.toString());
};

export const createConfigLoader = <T>(...filePath: string[]): () => Promise<T> => {
    const cache: { value?: T } = {};

    return async (): Promise<T> => {
        if (cache.value) {
            return cache.value;
        } else {
            const value: T = await loadConfig(...filePath);
            cache.value = value;
            return value;
        }
    }
};
