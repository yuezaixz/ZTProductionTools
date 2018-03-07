export function char2buf(str) {
    var out = new ArrayBuffer(str.length);
    var u16a = new Uint8Array(out);
    var strs = str.split("");
    for (var i = 0; i < strs.length; i++) {
        u16a[i] = strs[i].charCodeAt();
    }
    return out;
}

export function arrayBufferToBase64Str(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}
export function startWith(src, target){
    var reg=new RegExp("^"+target);
    return reg.test(src);
}