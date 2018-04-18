import { writeFile } from 'fs';

function loader(text) {
    console.log('Called!');
    try {
        return compiler.call(undefined, this, text);
    }
    catch (e) {
        console.error(e, e.stack);
        throw e;
    }
}
function compiler(loader, text) {
    var callback = loader.async();
    var transform = function (text) {
        return text.split('\r\n').map(function (v) { return convert.pipe(v, convert.toClass, convert.toProperty); }).join('\r\n');
    };
    writeFile('./OUTPUT.json', JSON.stringify([text, transform(text)]), function (e) { return callback(null, text); });
    return text;
}
var convert;
(function (convert) {
    convert.illegalAccessModifier = /(?:internal|protected|short|uint|int|ulong|long|float|double|decimal)/g;
    convert.number = /(?:sbyte|ushort|short|uint|int|ulong|long|float|double|decimal)/g;
    convert.getterSetter = /(?:{\s?get;\s?(set;)?\s?})/g;
    convert.isClass = /(?:class)/g;
    function pipe(source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var result = source;
        args.forEach(function (f) {
            result = f.call(undefined, result);
        });
        return result;
    }
    convert.pipe = pipe;
    function toClass(source) {
        var result = '';
        if (convert.isClass.test(source)) {
            var inherited = /(?=: )(.*)(?={)/g.exec(source);
            if (!!inherited) {
                var interfaces = inherited.filter(function (v) { return v.includes(' I'); });
                var classes = inherited.filter(function (v) { return !v.includes(' I'); });
                result += new String(source).slice(0, source.indexOf(': '));
                if (!!classes) {
                    result += "extends " + classes.join(', ');
                }
                if (!!interfaces) {
                    result += "implements " + interfaces.join(', ');
                }
            }
            else {
                result += source;
            }
        }
        return result.length <= 0 ? source : result;
    }
    convert.toClass = toClass;
    function toProperty(source) {
        var result = '';
        var parts = source.split(' ');
        return result.length <= 0 ? source : result;
    }
    convert.toProperty = toProperty;
})(convert || (convert = {}));

export default loader;
export { convert };
