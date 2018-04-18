export default function loader(text: string): any;
export declare namespace convert {
    const illegalAccessModifier: RegExp;
    const number: RegExp;
    const getterSetter: RegExp;
    const isClass: RegExp;
    function pipe(source: string, ...args: ((source: string) => string)[]): string;
    function toClass(source: string): string;
    function toProperty(source: string): string;
}
