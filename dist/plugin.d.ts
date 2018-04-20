export default function loader(text: string): any;
export declare namespace convert {
    const illegalAccessModifier: RegExp;
    const legalAccessModifier: RegExp;
    const number: RegExp;
    const isGetterSetter: RegExp;
    const isClass: RegExp;
    interface IState {
        debugArray: any;
    }
    function pipe(source: string, state: IState, ...args: ((source: string, state: IState) => string)[]): string;
    function toClass(source: string, state: IState): string;
    function toProperty(source: string, state: IState): string;
}
