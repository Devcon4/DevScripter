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
        debugArray: []
    };

    let transform = (text: string) => {


        return text.split('\r\n').map(v => convert.pipe(v, state, 
            convert.toClass,
            convert.toProperty
        )).join('\r\n');
    };
    writeFile('./OUTPUT.json', JSON.stringify({ original: text, transformed: transform(text), state: state }), e => callback(null, text));
    return text;
}

export namespace convert {
    
    export const illegalAccessModifier = /(?:internal|protected)/g;
    export const legalAccessModifier = /(?:public|private|protected|static)/g;
    export const number = /(?:sbyte|ushort|short|uint|int|ulong|long|float|double|decimal)/g;
    export const isGetterSetter = /(?:{\s?get;\s?(set;)?\s?})/g;
    export const isClass = /(?:class)/g;

    export interface IState {
        debugArray: any
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
        
        let builder: {
            accessModifier?: string,
            type?: string,
            name?: string
        } = {};

        if(isGetterSetter.test(source)) {
            let parts = source.trim().split(' ');
            state.debugArray = [...state.debugArray, [source], parts];

            for(let p of parts) {
                if(!builder.accessModifier && legalAccessModifier.test(p)) {
                    builder.accessModifier = p;
                } else if (!builder.type && number.test(p)) {
                    builder.type = p;
                } else if (!builder.name) {
                    builder.name = p;
                }
            }

            result = `${new ms(source).getIndentString()}${builder.accessModifier} ${builder.name}: number;`;
        }

        return result.length <= 0 ? source : result;

    }
}

class ModelOne {
    protected name: string = '';
}
