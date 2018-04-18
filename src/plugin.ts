import { loader } from 'webpack';
import { writeFile } from 'fs';
import ms from 'magic-string';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

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

    let transform = (text: string) => {
        return text.split('\n').map(v => convert.toProperty(v)).join('\n');
    };
    writeFile('./OUTPUT.txt', transform(text), e => callback(null, text));
    return text;
}

export namespace convert {
    
    export const illegalAccessModifier = /(?:internal|protected|short|uint|int|ulong|long|float|double|decimal)/g;
    export const number = /(?:sbyte|ushort|short|uint|int|ulong|long|float|double|decimal)/g;
    export const getterSetter = /(?:{\s?get;\s?(set;)?\s?})/g;

    export function toClass(source: string) {

    }

    export function getClosure(source: string, matchClosingChar: '}' | ')' = '}') {
        let parts = new String(source).replace(matchClosingChar, (match, index) => {
            return index;
        });
    }

    export function toProperty(source: string) {
        let result = '';
        let parts = source.split(' ');
        let name: string;

        for(let p in parts) {
            let part = parts[p];
            if(illegalAccessModifier.test(part) || number.test(part)) {
                return;
            } else if (!name) {
                name = part;
                result += `${part}: number`;
            } else if (!!name && getterSetter.test(source)) {
                result += `;\n`;
                break;
            }
            result += `${part} `;
        };
        return result;
    }
}

class ModelOne {
    protected name: string = '';
}