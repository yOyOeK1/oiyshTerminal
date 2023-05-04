
// convert a Unicode string to a string in which
// each 16-bit unit occupies only one byte
function toBinary(string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}

// a string that contains characters occupying > 1 byte
//let encoded = toBinary("✓ à la mode") // "EycgAOAAIABsAGEAIABtAG8AZABlAA=="


function fromBinary(encoded) {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

// our previous Base64-encoded string
//let decoded = fromBinary(encoded) // "✓ à la mode"




function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

//b64DecodeUnicode('UHl0aG9uIGlzIGZ1bg==')
// >'Python is fun'
//b64DecodeUnicode('4pyTIMOgIGxhIG1vZGU='); // "✓ à la mode"
//b64DecodeUnicode('Cg=='); // "\n"

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

//b64EncodeUnicode('✓ à la mode'); // "4pyTIMOgIGxhIG1vZGU="
//b64EncodeUnicode('\n'); // "Cg=="
