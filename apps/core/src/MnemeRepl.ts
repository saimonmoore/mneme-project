// @ts-ignore
import { start } from 'bare-repl';
import { Mneme } from "@/Mneme/Mneme.js";

//@ts-ignore
type MnemeInstance = InstanceType<Mneme>;

export class MnemeRepl {
    repl: any;
    mneme: MnemeInstance;

    constructor(mneme: MnemeInstance) {
        this.mneme = mneme;
    }

    start() {
        this.repl = start({
            prompt: 'mneme >',
            useColors: true,
        });
        this.repl.context.mneme = this.mneme;

        this.repl.defineCommand('greet', { help: 'Greetings', action: () => console.log('hello') })
        this.getAsyncGeneratorFunctionNames().forEach((generatorFn) => {
            this.repl.defineCommand(`log:${generatorFn}`, { help: `Iterate over ${generatorFn}`, action: async () => this.runAsyncGenerator(generatorFn) });
        });

        this.getAsyncFunctionNames().forEach((asyncFn) => {
            this.repl.defineCommand(`async:${asyncFn}`, { help: `Execute async fn: ${asyncFn}`, action: async (args: string) => this.runAsyncFn(asyncFn, args) });
        });

        this.repl.defineCommand(`mneme`, { help: `Execute mneme fn...`, action: async (fn: string) => this.runMnemeFn(fn) });
        this.repl.defineCommand(`list`, { help: `List all commands`, action: () => console.log(Object.keys(this.repl.commands)) });
    }

    async runMnemeFn(fnString: string) {
        const result = eval.apply(this.mneme, [fnString]);
        console.log(result);
    }

    async runAsyncGenerator(fnString: string) {
        try {
            // @ts-ignore
            const iterable = Promise.resolve(this.mneme[fnString]());

            for await (const data of await iterable) {
                console.log(data);
            }
        } catch (error) {
            console.log("Error: ", error);
            console.log();
        }
    }

    async runAsyncFn(fnString: string, args: string) {
        try {
            // @ts-ignore
            const result = await this.mneme[fnString](eval(args));
            console.log(result);
        } catch (error) {
            console.log("Error: ", error);
            console.log();
        }
    }

    getAsyncGeneratorFunctionNames() {
        const classPrototype = Mneme.prototype;
        const propertyNames = Object.getOwnPropertyNames(classPrototype);

        return propertyNames.filter((name) => {
            const descriptor = Object.getOwnPropertyDescriptor(classPrototype, name);
            if (!descriptor) {
                console.log('No descriptor');
                return false;
            }
            return (
                typeof descriptor.value === 'function' &&
                descriptor.value.constructor.name === 'AsyncGeneratorFunction'
            );
        });
    }

    getAsyncFunctionNames() {
        const classPrototype = Mneme.prototype;
        const propertyNames = Object.getOwnPropertyNames(classPrototype);

        return propertyNames.filter((name) => {
            const descriptor = Object.getOwnPropertyDescriptor(classPrototype, name);
            if (!descriptor) {
                console.log('No descriptor');
                return false;
            }
            return (
                typeof descriptor.value === 'function' &&
                descriptor.value.constructor.name === 'AsyncFunction' &&
                !descriptor.value[Symbol.asyncIterator]
            );
        });
    }

}