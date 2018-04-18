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
        return text.split('\n').map(function (v) { return convert.toProperty(v); }).join('\n');
    };
    writeFile('./OUTPUT.txt', transform(text), function (e) { return callback(null, text); });
    return text;
}
var convert;
(function (convert) {
    convert.illegalAccessModifier = /(?:internal|protected|short|uint|int|ulong|long|float|double|decimal)/g;
    convert.number = /(?:sbyte|ushort|short|uint|int|ulong|long|float|double|decimal)/g;
    convert.getterSetter = /(?:{\s?get;\s?(set;)?\s?})/g;
    function toClass(source) {
    }
    convert.toClass = toClass;
    function getClosure(source, matchClosingChar) {
        if (matchClosingChar === void 0) { matchClosingChar = '}'; }
        var parts = new String(source).replace(matchClosingChar, function (match, index) {
            return index;
        });
    }
    convert.getClosure = getClosure;
    function toProperty(source) {
        var result = '';
        var parts = source.split(' ');
        var name;
        for (var p in parts) {
            var part = parts[p];
            if (convert.illegalAccessModifier.test(part) || convert.number.test(part)) {
                return;
            }
            else if (!name) {
                name = part;
                result += part + ": number";
            }
            else if (!!name && convert.getterSetter.test(source)) {
                result += ";\n";
                break;
            }
            result += part + " ";
        }
        return result;
    }
    convert.toProperty = toProperty;
})(convert || (convert = {}));

export default loader;
export { convert };
