import { loader } from 'webpack';
import { writeFile } from 'fs';
import ms from 'magic-string';

// Hack to get LoaderContext (awesome-typescript-loader@5.0.0 does the same thing).
export default function loader(text: string) {
    console.log('Called!');
	try {
		return compiler.call(undefined, this, text);
	} catch (e) {
		console.error(e, e.stack);
		throw e;
	}
}

function compiler(loader: loader.LoaderContext, text: string) {
    // if (loader.cacheable) {
	// 	loader.cacheable();
    // }

    let callback = loader.async();

    let state: convert.IState = {
        debugArray: [],
        importMoment: false
    };

    let transform = (text: string) => {


        return text.split('\r\n').map(v => convert.pipe(v, state, 
            convert.toClass,
            convert.toProperty
        )).join('\r\n');
    };
    // writeFile('./OUTPUT.json', JSON.stringify({ original: text, transformed: transform(text), state: state }), e => callback(null, text));
   writeFile('./ModelOne.ts', transform(text), e => callback(null, text));
}

export namespace convert {
    
    export const regexAny = (...reg: RegExp[]) =>
        new RegExp(`${reg.map(r => r.source).join('|')}`);

    export const illegalAccessModifier = /(?:internal|protected)/;
    export const legalAccessModifier = /(?:public|private|protected|static)/;
    export const number = /(?:sbyte|ushort|short|uint|int|ulong|long|float|double|decimal|byte)/;
    export const string = /(?:char|string)/;
    export const bool = /(?:bool)/;
    export const date = /(?:DateTime)/;
    export const isType = convert.regexAny(number, string, bool, date);
    export const isGetterSetter = /(?:{\s?get;\s?(set;)?\s?})/;
    export const isClass = /(?:class)/;

    export interface IState {
        debugArray: any,
        importMoment: boolean
    }

    export function pipe(source: string, state: IState, ...args:((source: string, state: IState) => string)[]): string {
        let result = source;
        for(let f of args) {
            result = f.call(undefined, result, state);
            if (result != source) {
                break;
            }
        };

        return result;
    }

    export function toClass(source: string, state: IState): string {
        let result = '';
        if (isClass.test(source)) {
            let inherited = new String(source.match(/(?=: )(.*)(?={)/g)).split(', ');
            if (inherited.length > 0) {
                result += new String(source).slice(0, source.indexOf(': ')) + ' ';
                result += `implements ${inherited.join(', ').slice(2)/*Remove ' :'*/}`;
            } else {
                // redundent but succinct
                result += source;
            }
            result += ' {';
        }
        return result.length <= 0 ? source : result;
    }

    export function toProperty(source: string, state: IState) {
        let result = '';
        
        let builder = {
            accessModifier: 'public',
            type: undefined as string,
            name: undefined as string
        };

        if(convert.isGetterSetter.test(source)) {
            let parts = source.trim().split(' ');

            for(let p of parts) {
                if(legalAccessModifier.test(p)) {
                    builder.accessModifier = p;
                } else if (!builder.type && isType.test(p)) {
                    builder.type = p;
                } else if (!builder.name) {
                    builder.name = p;
                }
            }

            let checkObj = {
                [+true]: ': Any',
                [+convert.number.test(builder.type)]: 'number',
                [+convert.string.test(builder.type)]: 'string',
                [+convert.bool.test(builder.type)]: 'boolean',
                [+convert.date.test(builder.type)]: 'moment.Moment',
            }
            
            if (convert.date.test(builder.type)) {
                state.importMoment = true
            }
            
            result = `${new ms(source).getIndentString()}${builder.accessModifier} ${builder.name}: ${checkObj[+true]};`;
            // state.debugArray = [...state.debugArray, convert.number.test(builder.type), checkObj, result];
        }

        return result.length <= 0 ? source : result;

    }
}

class ModelOne {
    protected name: string = '';
}
