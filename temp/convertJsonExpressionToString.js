/**
 * Function to convert a json expression to a set of contentated string literals suitable for initializing a text area to show
 * the same expression property formatted.
 * Fails if the input expression contains \n in a string literals or string literals that are '' delimited or contain '.
 */
var jsonToString = function(jsonExpression){

    var str = JSON.stringify(jsonExpression,
                             function(key, val) {
                                if (typeof val === 'function') {
                                   return val + ''; // implicitly `toString` it
                                }
                                return val;
                             },
                             4);

    // get the \n added to the text
    str = JSON.stringify(str);

    // drop the leading and trailing "
    str = str.substring(1, str.length-1);

    // replace any ' with " (dangerous)
    str = str.replace(/'/g, '"');

    // remove extra \\n
    str = str.replace(/\\\\n/g, "\\n");

    // re-break the string for readability and add closing '+
    str = str.replace(/\\n/g, "\\n'+\n");

    // remove the extra quoting of properties (we'll use singles quotes on the outside)
    str = str.replace(/\\"/g, '"');

    // add the leading ' to each line
    str = str.replace(/^/mg, "'");

    // add the final closing quote
    str += "'";

    return str;
};
