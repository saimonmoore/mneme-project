import fs from 'fs';
import os from 'os';
import process from 'process';

function getEnvVariable(key: string) {
    if (typeof process !== 'undefined' && process.env) {
        // Node.js environment
        return process.env[key];
        // @ts-ignore
    } else if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        return import.meta.env[key];
    } else {
        console.warn(`Unable to access environment variables. Key: ${key}`);
        return undefined;
    }
}

export const env = (key: string) => {
    // @ts-ignore
    if (typeof global.Pear === 'undefined') {
        return getEnvVariable(key);
    } else {
        // @ts-ignore
        return Pear.config.env[key];
    }
};

export const config = () => {
    // @ts-ignore
    if (typeof global.Pear === 'undefined') {
        return {
            storage: fs.mkdtempSync(os.tmpdir() + '/mneme'),
        };
    } else {
        // @ts-ignore
        return Pear.config.env;
    }
};

// TODO: Implement teardown for node
export const teardown = (cb: () => void) => {
    // @ts-ignore
    if (typeof global.Pear !== 'undefined') {
        // @ts-ignore
        return Pear.teardown(cb);
    }
}