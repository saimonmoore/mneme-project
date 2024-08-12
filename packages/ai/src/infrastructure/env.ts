export function getEnvVariable(key: string) {
  if (typeof process !== 'undefined' && process.env) {
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
