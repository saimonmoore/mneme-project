import fs from 'fs';
import os from 'os';

export const env = () => {
    // @ts-ignore
    if (typeof global.Pear === 'undefined') {
        return process.env;
    } else {
        // @ts-ignore
        return Pear.config.env;
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