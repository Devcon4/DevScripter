export default function loader(text: string): any;
export declare namespace convert {
    const illegalAccessModifier: RegExp;
    const number: RegExp;
    const getterSetter: RegExp;
    function toClass(source: string): void;
    function getClosure(source: string, matchClosingChar?: '}' | ')'): void;
    function toProperty(source: string): string;
}
