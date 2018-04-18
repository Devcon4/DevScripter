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

        return text.split('\r\n').map(v => convert.pipe(v, 
            convert.toClass,
            convert.toProperty
        )).join('\r\n');
    };
    writeFile('./OUTPUT.json', JSON.stringify([text, transform(text)]), e => callback(null, text));
    return text;
}

export namespace convert {
    
    export const illegalAccessModifier = /(?:internal|protected)/g;
    export const number = /(?:sbyte|ushort|short|uint|int|ulong|long|float|double|decimal)/g;
    export const getterSetter = /(?:{\s?get;\s?(set;)?\s?})/g;
    export const isClass = /(?:class)/g;

    export function pipe(source: string, ...args:((source: string) => string)[]): string {
        let result = source;
        args.forEach(f => {
            result = f.call(undefined, result);
        });

        return result;
    }

    export function toClass(source: string): string {
        let result = '';
        if (isClass.test(source)) {
            let inherited = /(?=: )(.*)(?={)/g.exec(source);
            if (!!inherited) {
                let interfaces = inherited.filter(v => v.includes(' I'));
                let classes = inherited.filter(v => !v.includes(' I'));
                result += new String(source).slice(0, source.indexOf(': '));

                if (!!classes) {
                    result += ` extends ${classes.join(', ')}`;
                }
                
                if (!!interfaces) {
                    result += `implements ${interfaces.join(', ')}`;
                }
            } else {
                // redundent but succinct
                result += source;
            }
        }
        return result.length <= 0 ? source : result;
    }

    export function toProperty(source: string) {
        let result = '';
        let parts = source.split(' ');
        let name: string;

        // for(let p in parts) {
        //     let part = parts[p];
        //     if(illegalAccessModifier.test(part) || number.test(part)) {
        //         return;
        //     } else if (!name) {
        //         name = part;
        //         result += `${part}: number`;
        //     } else if (!!name && getterSetter.test(source)) {
        //         result += `;\n`;
        //         break;
        //     }
        //     result += `${part} `;
        // };
        return result.length <= 0 ? source : result;

    }
}

class ModelOne {
    protected name: string = '';
}