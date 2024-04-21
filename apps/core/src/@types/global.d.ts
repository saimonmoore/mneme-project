declare module 'graceful-goodbye' {
    export default async function goodbye(fn: () => void): Promise<void>;
}