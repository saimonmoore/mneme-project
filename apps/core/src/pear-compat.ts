import fs from 'fs';
import os from 'os';
import process from 'process';

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

// TODO: Implement teardown for node
export const teardown = (cb: () => void) => {
    // @ts-ignore
    if (typeof global.Pear !== 'undefined') {
        // @ts-ignore
        return Pear.teardown(cb);
    }
}