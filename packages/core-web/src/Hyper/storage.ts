// @ts-expect-error
import RAM from 'random-access-memory'
// @ts-expect-error
import RAW from 'random-access-web'

type StorageOptions = {
    name: string,
    storeName?: string, // random-access-idb
    size?: number, // internal chunk size to use (default 4096) random-access-idb
    maxSize?: number, // random-access-chrome-file
};

export const randomAccessStorage = (options: StorageOptions) => {
    return RAW(options)
}

export { RAM }
