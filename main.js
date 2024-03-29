(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$MainFunction$MainType$GetViewport = function (a) {
	return {$: 'GetViewport', a: a};
};
var $author$project$MainFunction$MainType$Menu = {$: 'Menu'};
var $elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var $author$project$MainFunction$MainType$Level1 = {$: 'Level1'};
var $author$project$MainFunction$MainType$Level2 = {$: 'Level2'};
var $author$project$Modules$Monster$ListenX = function (a) {
	return {$: 'ListenX', a: a};
};
var $author$project$Modules$Monster$ListenY = function (a) {
	return {$: 'ListenY', a: a};
};
var $author$project$Modules$Monster$MonsterA = F2(
	function (a, b) {
		return {$: 'MonsterA', a: a, b: b};
	});
var $author$project$Modules$Player$NoNextPropertyChange = {$: 'NoNextPropertyChange'};
var $author$project$GlobalFunction$GlobalBasics$blockSize = _Utils_Tuple2(40.0, 40.0);
var $author$project$GlobalFunction$GlobalBasics$blockPos = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	var _v1 = $author$project$GlobalFunction$GlobalBasics$blockSize;
	var blockX = _v1.a;
	var blockY = _v1.b;
	var posX = (x - 1.0) * blockX;
	var posY = (y - 1.0) * blockY;
	return _Utils_Tuple2(posX, posY);
};
var $author$project$GlobalFunction$GlobalBasics$blockPosFloat = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	var _v1 = $author$project$GlobalFunction$GlobalBasics$blockSize;
	var blockX = _v1.a;
	var blockY = _v1.b;
	var posX = (x - 1.0) * blockX;
	var posY = (y - 1.0) * blockY;
	return _Utils_Tuple2(posX, posY);
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Modules$Player$defPlayerProperty = {gravityAcce: 0.1, ifPlayerJumpOnTheGround: true, isGreen: false, playerHeight: 25.0, playerHorizontalSpeed: 1.93, playerJumpFrames: 20, playerJumpInitialAcce: 0.55, playerJumpInitialSpeed: -1.0, playerJumpNum: 1, playerWidth: 10.0};
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$GlobalFunction$GlobalBasics$Polygon = function (a) {
	return {$: 'Polygon', a: a};
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Modules$EndPoint$endPointHeight = $author$project$GlobalFunction$GlobalBasics$blockSize.b;
var $author$project$Modules$EndPoint$endPointWidth = $author$project$GlobalFunction$GlobalBasics$blockSize.a;
var $author$project$Modules$EndPoint$defEndBox = $author$project$GlobalFunction$GlobalBasics$Polygon(
	$elm$core$Array$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2(
				_Utils_Tuple2(0.0, 0.0),
				_Utils_Tuple2($author$project$Modules$EndPoint$endPointWidth, 0.0)),
				_Utils_Tuple2(
				_Utils_Tuple2($author$project$Modules$EndPoint$endPointWidth, 0.0),
				_Utils_Tuple2($author$project$Modules$EndPoint$endPointWidth, $author$project$Modules$EndPoint$endPointHeight)),
				_Utils_Tuple2(
				_Utils_Tuple2($author$project$Modules$EndPoint$endPointWidth, $author$project$Modules$EndPoint$endPointHeight),
				_Utils_Tuple2(0.0, $author$project$Modules$EndPoint$endPointHeight)),
				_Utils_Tuple2(
				_Utils_Tuple2(0.0, $author$project$Modules$EndPoint$endPointHeight),
				_Utils_Tuple2(0.0, 0.0))
			])));
var $author$project$Modules$EndPoint$init = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return {
		collisionBox: $author$project$Modules$EndPoint$defEndBox,
		pos: _Utils_Tuple2(x, y)
	};
};
var $author$project$Modules$GameControl$Normal = {$: 'Normal'};
var $author$project$MainFunction$MainConstant$buttonNormalColor = '#FFE6E8FF';
var $author$project$Modules$GameControl$init = F2(
	function (nextLevel, hint) {
		return {
			buttonState: $elm$core$Array$fromList(
				A2(
					$elm$core$List$map,
					function (i) {
						return $author$project$MainFunction$MainConstant$buttonNormalColor;
					},
					A2($elm$core$List$range, 0, 5))),
			controlStatus: $author$project$Modules$GameControl$Normal,
			hint: hint,
			hintLength: $elm$core$List$length(hint),
			nextLevel: nextLevel,
			soundLoudness: 1.0
		};
	});
var $author$project$Modules$Monster$monsterCollisionBox = function (monsterAppearance) {
	var width = monsterAppearance.a;
	var height = monsterAppearance.b;
	return $author$project$GlobalFunction$GlobalBasics$Polygon(
		$elm$core$Array$fromList(
			_List_fromArray(
				[
					_Utils_Tuple2(
					_Utils_Tuple2(0.0, 0.0),
					_Utils_Tuple2(width, 0.0)),
					_Utils_Tuple2(
					_Utils_Tuple2(width, 0.0),
					_Utils_Tuple2(width, height)),
					_Utils_Tuple2(
					_Utils_Tuple2(width, height),
					_Utils_Tuple2(0.0, height)),
					_Utils_Tuple2(
					_Utils_Tuple2(0.0, height),
					_Utils_Tuple2(0.0, 0.0))
				])));
};
var $author$project$Modules$Monster$init = F6(
	function (_v0, monsterAppearance, monsterX, monsterY, xSpeed, _v1) {
		var x = _v0.a;
		var y = _v0.b;
		var x1 = _v1.a;
		var x2 = _v1.b;
		return {
			appearance: monsterAppearance,
			collisionBox: $author$project$Modules$Monster$monsterCollisionBox(monsterAppearance),
			fixY: y,
			pos: _Utils_Tuple2(x, y),
			range: _Utils_Tuple2(x1, x2),
			xMode: monsterX,
			xSpeed: xSpeed,
			yMode: monsterY,
			ySpeed: 0
		};
	});
var $author$project$Modules$Player$FallFromHigh = {$: 'FallFromHigh'};
var $author$project$Modules$Player$Jump = F2(
	function (a, b) {
		return {$: 'Jump', a: a, b: b};
	});
var $author$project$Modules$Player$Live = {$: 'Live'};
var $author$project$Modules$Player$Right = {$: 'Right'};
var $author$project$Modules$Player$init = F3(
	function (pos, property, propertyChange) {
		return {
			collisionBox: $author$project$GlobalFunction$GlobalBasics$Polygon(
				$elm$core$Array$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(
							_Utils_Tuple2(0.0, 0.0),
							_Utils_Tuple2(property.playerWidth, 0.0)),
							_Utils_Tuple2(
							_Utils_Tuple2(property.playerWidth, 0.0),
							_Utils_Tuple2(property.playerWidth, property.playerHeight)),
							_Utils_Tuple2(
							_Utils_Tuple2(property.playerWidth, property.playerHeight),
							_Utils_Tuple2(0.0, property.playerHeight)),
							_Utils_Tuple2(
							_Utils_Tuple2(0.0, property.playerHeight),
							_Utils_Tuple2(0.0, 0.0))
						]))),
			deadTimes: _Utils_Tuple2(0, $author$project$Modules$Player$FallFromHigh),
			faceDirection: $author$project$Modules$Player$Right,
			ifChangeBackToLastPosX: false,
			ifChangeBackToLastPosY: false,
			ifThisFrameOnGround: false,
			jump: A2($author$project$Modules$Player$Jump, 2, -1),
			lastPos: pos,
			liveState: $author$project$Modules$Player$Live,
			pos: pos,
			property: property,
			propertyChange: propertyChange,
			saveNumber: -1,
			velocity: _Utils_Tuple2(0.0, 0.0)
		};
	});
var $author$project$Modules$SavePoint$Unsaved = {$: 'Unsaved'};
var $author$project$Modules$SavePoint$savePointHeight = $author$project$GlobalFunction$GlobalBasics$blockSize.b;
var $author$project$Modules$SavePoint$savePointWidth = $author$project$GlobalFunction$GlobalBasics$blockSize.a;
var $author$project$Modules$SavePoint$defSaveBox = $author$project$GlobalFunction$GlobalBasics$Polygon(
	$elm$core$Array$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2(
				_Utils_Tuple2(0.0, 0.0),
				_Utils_Tuple2($author$project$Modules$SavePoint$savePointWidth, 0.0)),
				_Utils_Tuple2(
				_Utils_Tuple2($author$project$Modules$SavePoint$savePointWidth, 0.0),
				_Utils_Tuple2($author$project$Modules$SavePoint$savePointWidth, $author$project$Modules$SavePoint$savePointHeight)),
				_Utils_Tuple2(
				_Utils_Tuple2($author$project$Modules$SavePoint$savePointWidth, $author$project$Modules$SavePoint$savePointHeight),
				_Utils_Tuple2(0.0, $author$project$Modules$SavePoint$savePointHeight)),
				_Utils_Tuple2(
				_Utils_Tuple2(0.0, $author$project$Modules$SavePoint$savePointHeight),
				_Utils_Tuple2(0.0, 0.0))
			])));
var $author$project$Modules$SavePoint$init = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return {
		appearance: $author$project$Modules$SavePoint$Unsaved,
		collisionBox: $author$project$Modules$SavePoint$defSaveBox,
		pos: _Utils_Tuple2(x, y)
	};
};
var $author$project$GlobalFunction$GlobalModule$CollideAfterEvent = F2(
	function (a, b) {
		return {$: 'CollideAfterEvent', a: a, b: b};
	});
var $author$project$GlobalFunction$GlobalModule$Invisible = function (a) {
	return {$: 'Invisible', a: a};
};
var $author$project$GlobalFunction$GlobalModule$NoCollide = function (a) {
	return {$: 'NoCollide', a: a};
};
var $author$project$GlobalFunction$GlobalModule$NoNextCollision = {$: 'NoNextCollision'};
var $author$project$GlobalFunction$GlobalModule$NoNextMove = {$: 'NoNextMove'};
var $author$project$GlobalFunction$GlobalModule$NoNextVisibility = {$: 'NoNextVisibility'};
var $author$project$Modules$Brick$Pill = function (a) {
	return {$: 'Pill', a: a};
};
var $author$project$GlobalFunction$GlobalModule$VisibleAfterEvent = F2(
	function (a, b) {
		return {$: 'VisibleAfterEvent', a: a, b: b};
	});
var $author$project$GlobalFunction$GlobalModule$Collide = function (a) {
	return {$: 'Collide', a: a};
};
var $author$project$Modules$Brick$Detailed = F3(
	function (a, b, c) {
		return {$: 'Detailed', a: a, b: b, c: c};
	});
var $author$project$GlobalFunction$GlobalModule$Visible = function (a) {
	return {$: 'Visible', a: a};
};
var $author$project$Modules$Brick$brickHeight = $author$project$GlobalFunction$GlobalBasics$blockSize.b;
var $author$project$Modules$Brick$brickWidth = $author$project$GlobalFunction$GlobalBasics$blockSize.a;
var $author$project$Modules$Brick$brickCollisionBox = function (brickAppearance) {
	if (brickAppearance.$ === 'Detailed') {
		var width = brickAppearance.a;
		var height = brickAppearance.b;
		return $author$project$GlobalFunction$GlobalBasics$Polygon(
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2(
						_Utils_Tuple2(0.0, 0.0),
						_Utils_Tuple2(width, 0.0)),
						_Utils_Tuple2(
						_Utils_Tuple2(width, 0.0),
						_Utils_Tuple2(width, height)),
						_Utils_Tuple2(
						_Utils_Tuple2(width, height),
						_Utils_Tuple2(0.0, height)),
						_Utils_Tuple2(
						_Utils_Tuple2(0.0, height),
						_Utils_Tuple2(0.0, 0.0))
					])));
	} else {
		return $author$project$GlobalFunction$GlobalBasics$Polygon(
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2(
						_Utils_Tuple2(0.0, 0.0),
						_Utils_Tuple2($author$project$Modules$Brick$brickWidth, 0.0)),
						_Utils_Tuple2(
						_Utils_Tuple2($author$project$Modules$Brick$brickWidth, 0.0),
						_Utils_Tuple2($author$project$Modules$Brick$brickWidth, $author$project$Modules$Brick$brickHeight)),
						_Utils_Tuple2(
						_Utils_Tuple2($author$project$Modules$Brick$brickWidth, $author$project$Modules$Brick$brickHeight),
						_Utils_Tuple2(0.0, $author$project$Modules$Brick$brickHeight)),
						_Utils_Tuple2(
						_Utils_Tuple2(0.0, $author$project$Modules$Brick$brickHeight),
						_Utils_Tuple2(0.0, 0.0))
					])));
	}
};
var $author$project$Modules$Brick$initPosVolumeColor = F3(
	function (_v0, _v1, color) {
		var x = _v0.a;
		var y = _v0.b;
		var width = _v1.a;
		var height = _v1.b;
		return {
			appearance: A3($author$project$Modules$Brick$Detailed, width, height, color),
			collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
			collisionBox: $author$project$Modules$Brick$brickCollisionBox(
				A3($author$project$Modules$Brick$Detailed, width, height, color)),
			move: $author$project$GlobalFunction$GlobalModule$NoNextMove,
			pos: _Utils_Tuple2(x, y),
			visibility: $author$project$GlobalFunction$GlobalModule$Visible($author$project$GlobalFunction$GlobalModule$NoNextVisibility)
		};
	});
var $author$project$Modules$NoticeBoard$boundary = F2(
	function (_v0, _v1) {
		var x = _v0.a;
		var y = _v0.b;
		var width = _v1.a;
		var height = _v1.b;
		var _v2 = $author$project$GlobalFunction$GlobalBasics$blockSize;
		var blockX = _v2.a;
		var blockY = _v2.b;
		var tempBrick = A3(
			$author$project$Modules$Brick$initPosVolumeColor,
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(x, y)),
			_Utils_Tuple2(width * blockX, height * blockY),
			'#F5F5F5');
		return _Utils_update(
			tempBrick,
			{
				collision: $author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision)
			});
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Modules$Brick$init = F5(
	function (_v0, brickAppearance, visibility, brickCollision, brickMove) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: brickAppearance,
			collision: brickCollision,
			collisionBox: $author$project$Modules$Brick$brickCollisionBox(brickAppearance),
			move: brickMove,
			pos: _Utils_Tuple2(x, y),
			visibility: visibility
		};
	});
var $author$project$Modules$Brick$NormalAppearance = {$: 'NormalAppearance'};
var $author$project$Modules$Brick$initCollideHidden = F2(
	function (_v0, id) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: $author$project$Modules$Brick$NormalAppearance,
			collision: $author$project$GlobalFunction$GlobalModule$NoCollide(
				A2($author$project$GlobalFunction$GlobalModule$CollideAfterEvent, id, $author$project$GlobalFunction$GlobalModule$NoNextCollision)),
			collisionBox: $author$project$Modules$Brick$brickCollisionBox($author$project$Modules$Brick$NormalAppearance),
			move: $author$project$GlobalFunction$GlobalModule$NoNextMove,
			pos: $author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(x, y)),
			visibility: $author$project$GlobalFunction$GlobalModule$Invisible(
				A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, id, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))
		};
	});
var $author$project$GlobalFunction$GlobalModule$Move = F4(
	function (a, b, c, d) {
		return {$: 'Move', a: a, b: b, c: c, d: d};
	});
var $author$project$Modules$Brick$initFallingBrick = F2(
	function (_v0, id) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: $author$project$Modules$Brick$NormalAppearance,
			collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
			collisionBox: $author$project$Modules$Brick$brickCollisionBox($author$project$Modules$Brick$NormalAppearance),
			move: A4(
				$author$project$GlobalFunction$GlobalModule$Move,
				$elm$core$Array$fromList(_List_Nil),
				0.0,
				id,
				A4(
					$author$project$GlobalFunction$GlobalModule$Move,
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(x, 700.0)
							])),
					5.0,
					-1,
					$author$project$GlobalFunction$GlobalModule$NoNextMove)),
			pos: _Utils_Tuple2(x, y),
			visibility: $author$project$GlobalFunction$GlobalModule$Visible($author$project$GlobalFunction$GlobalModule$NoNextVisibility)
		};
	});
var $author$project$Modules$Brick$initFallingRow = F4(
	function (n, x, y, id) {
		return A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$author$project$Modules$Brick$initFallingBrick,
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(i, n)),
					id);
			},
			A2($elm$core$List$range, x, y));
	});
var $author$project$Modules$Brick$initNoCollideHidden = F2(
	function (_v0, id) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: $author$project$Modules$Brick$NormalAppearance,
			collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
			collisionBox: $author$project$Modules$Brick$brickCollisionBox($author$project$Modules$Brick$NormalAppearance),
			move: $author$project$GlobalFunction$GlobalModule$NoNextMove,
			pos: $author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(x, y)),
			visibility: $author$project$GlobalFunction$GlobalModule$Invisible(
				A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, id, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))
		};
	});
var $author$project$Modules$Brick$initPos = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return {
		appearance: $author$project$Modules$Brick$NormalAppearance,
		collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
		collisionBox: $author$project$Modules$Brick$brickCollisionBox($author$project$Modules$Brick$NormalAppearance),
		move: $author$project$GlobalFunction$GlobalModule$NoNextMove,
		pos: _Utils_Tuple2(x, y),
		visibility: $author$project$GlobalFunction$GlobalModule$Visible($author$project$GlobalFunction$GlobalModule$NoNextVisibility)
	};
};
var $author$project$Modules$Brick$initRow = F3(
	function (n, x, y) {
		return A2(
			$elm$core$List$map,
			function (i) {
				return $author$project$Modules$Brick$initPos(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(i, n)));
			},
			A2($elm$core$List$range, x, y));
	});
var $author$project$Level1$Level1Init$initBricks = $elm$core$Array$fromList(
	$elm$core$List$concat(
		_List_fromArray(
			[
				_List_fromArray(
				[
					A2(
					$author$project$Modules$NoticeBoard$boundary,
					_Utils_Tuple2(2, 5),
					_Utils_Tuple2(7, 4))
				]),
				A3($author$project$Modules$Brick$initRow, 15, 1, 4),
				A4($author$project$Modules$Brick$initFallingRow, 15, 5, 8, 1),
				A3($author$project$Modules$Brick$initRow, 15, 9, 32),
				A3($author$project$Modules$Brick$initRow, 12, 22, 26),
				_List_fromArray(
				[
					A3(
					$author$project$Modules$Brick$initPosVolumeColor,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(15, 12)),
					_Utils_Tuple2(40, 40),
					'#FFFF00')
				]),
				_List_fromArray(
				[
					A3(
					$author$project$Modules$Brick$initPosVolumeColor,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(24, 9)),
					_Utils_Tuple2(40, 40),
					'#FFFF00')
				]),
				_List_fromArray(
				[
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(22, 8),
					4),
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(23, 8),
					4),
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(24, 8),
					4),
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(25, 8),
					4),
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(26, 8),
					4),
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(22, 9),
					4),
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(26, 9),
					4),
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(26, 10),
					4),
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(26, 11),
					4),
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(22, 10),
					4),
					A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(22, 11),
					4)
				]),
				_List_fromArray(
				[
					A2(
					$author$project$Modules$Brick$initNoCollideHidden,
					_Utils_Tuple2(4.5, 12),
					5),
					A2(
					$author$project$Modules$Brick$initNoCollideHidden,
					_Utils_Tuple2(5.5, 12),
					6)
				]),
				A3($author$project$Modules$Brick$initRow, 15, 36, 80),
				_List_fromArray(
				[
					A2(
					$author$project$Modules$NoticeBoard$boundary,
					_Utils_Tuple2(31, 5),
					_Utils_Tuple2(7, 4))
				]),
				_List_fromArray(
				[
					A2(
					$author$project$Modules$Brick$initNoCollideHidden,
					_Utils_Tuple2(32.5, 12),
					7),
					A2(
					$author$project$Modules$Brick$initNoCollideHidden,
					_Utils_Tuple2(33.5, 12),
					8)
				]),
				_List_fromArray(
				[
					A2(
					$author$project$Modules$Brick$initNoCollideHidden,
					_Utils_Tuple2(44, 12),
					10),
					A2(
					$author$project$Modules$Brick$initNoCollideHidden,
					_Utils_Tuple2(45, 12),
					11)
				]),
				_List_fromArray(
				[
					A3(
					$author$project$Modules$Brick$initPosVolumeColor,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(55, 11.5)),
					_Utils_Tuple2(2.0 * 40.0, 3.5 * 40.0),
					'#008000'),
					A3(
					$author$project$Modules$Brick$initPosVolumeColor,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(67, 11.5)),
					_Utils_Tuple2(2.0 * 40.0, 3.5 * 40.0),
					'#008000')
				]),
				_List_fromArray(
				[
					A5(
					$author$project$Modules$Brick$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(25, 11)),
					$author$project$Modules$Brick$Pill('#FF0000'),
					$author$project$GlobalFunction$GlobalModule$Invisible(
						A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, 4, $author$project$GlobalFunction$GlobalModule$NoNextVisibility)),
					$author$project$GlobalFunction$GlobalModule$NoCollide(
						A2($author$project$GlobalFunction$GlobalModule$CollideAfterEvent, 4, $author$project$GlobalFunction$GlobalModule$NoNextCollision)),
					$author$project$GlobalFunction$GlobalModule$NoNextMove)
				])
			])));
var $author$project$Modules$Event$AfterActEvent = function (a) {
	return {$: 'AfterActEvent', a: a};
};
var $author$project$Modules$Event$PlayerCollide = function (a) {
	return {$: 'PlayerCollide', a: a};
};
var $author$project$Modules$Event$StartActivated = {$: 'StartActivated'};
var $author$project$Modules$Event$Event = F5(
	function (info, ifStartAct, actType, duration, actCounter) {
		return {actCounter: actCounter, actType: actType, duration: duration, ifStartAct: ifStartAct, info: info};
	});
var $author$project$Modules$Event$EventNotAct = {$: 'EventNotAct'};
var $author$project$Modules$Event$init = F4(
	function (eventInfo, eventIfStartAct, eventActType, eventDuration) {
		return A5($author$project$Modules$Event$Event, eventInfo, eventIfStartAct, eventActType, eventDuration, $author$project$Modules$Event$EventNotAct);
	});
var $author$project$Modules$Event$EventDuration = F4(
	function (leftActTimes, actInterval, actDuration, nowInterval) {
		return {actDuration: actDuration, actInterval: actInterval, leftActTimes: leftActTimes, nowInterval: nowInterval};
	});
var $author$project$Modules$Event$quickDuration = function (duration) {
	return A4($author$project$Modules$Event$EventDuration, 1, 0, duration, 0);
};
var $author$project$Modules$Event$hitBlock = F4(
	function (id_, name_, _v0, _v1) {
		var x_ = _v0.a;
		var y_ = _v0.b;
		var width_ = _v1.a;
		var height_ = _v1.b;
		var _v2 = $author$project$GlobalFunction$GlobalBasics$blockPosFloat(
			_Utils_Tuple2(x_, y_));
		var x = _v2.a;
		var y = _v2.b;
		var _v3 = _Utils_Tuple2(40 * width_, 40 * height_);
		var width = _v3.a;
		var height = _v3.b;
		return A4(
			$author$project$Modules$Event$init,
			{id: id_, name: name_},
			$author$project$Modules$Event$StartActivated,
			$author$project$Modules$Event$PlayerCollide(
				$author$project$GlobalFunction$GlobalBasics$Polygon(
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								_Utils_Tuple2(x, y),
								_Utils_Tuple2(x + width, y)),
								_Utils_Tuple2(
								_Utils_Tuple2(x + width, y),
								_Utils_Tuple2(x + width, y + height)),
								_Utils_Tuple2(
								_Utils_Tuple2(x + width, y + height),
								_Utils_Tuple2(x, y + height)),
								_Utils_Tuple2(
								_Utils_Tuple2(x, y + height),
								_Utils_Tuple2(x, y))
							])))),
			$author$project$Modules$Event$quickDuration(10));
	});
var $author$project$Modules$Event$hitBlockAfter = F5(
	function (id_, name_, _v0, _v1, afterID) {
		var x_ = _v0.a;
		var y_ = _v0.b;
		var width_ = _v1.a;
		var height_ = _v1.b;
		var _v2 = $author$project$GlobalFunction$GlobalBasics$blockPosFloat(
			_Utils_Tuple2(x_, y_));
		var x = _v2.a;
		var y = _v2.b;
		var _v3 = _Utils_Tuple2(40 * width_, 40 * height_);
		var width = _v3.a;
		var height = _v3.b;
		return A4(
			$author$project$Modules$Event$init,
			{id: id_, name: name_},
			$author$project$Modules$Event$AfterActEvent(afterID),
			$author$project$Modules$Event$PlayerCollide(
				$author$project$GlobalFunction$GlobalBasics$Polygon(
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								_Utils_Tuple2(x, y),
								_Utils_Tuple2(x + width, y)),
								_Utils_Tuple2(
								_Utils_Tuple2(x + width, y),
								_Utils_Tuple2(x + width, y + height)),
								_Utils_Tuple2(
								_Utils_Tuple2(x + width, y + height),
								_Utils_Tuple2(x, y + height)),
								_Utils_Tuple2(
								_Utils_Tuple2(x, y + height),
								_Utils_Tuple2(x, y))
							])))),
			$author$project$Modules$Event$quickDuration(10));
	});
var $author$project$Modules$Event$hitLineSeg = F4(
	function (id_, name_, pos1_, pos2_) {
		return A4(
			$author$project$Modules$Event$init,
			{id: id_, name: name_},
			$author$project$Modules$Event$StartActivated,
			$author$project$Modules$Event$PlayerCollide(
				$author$project$GlobalFunction$GlobalBasics$Polygon(
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(pos1_, pos2_)
							])))),
			$author$project$Modules$Event$quickDuration(10));
	});
var $author$project$Level1$Level1Init$initEvent = $elm$core$Array$fromList(
	_List_fromArray(
		[
			A4(
			$author$project$Modules$Event$hitLineSeg,
			1,
			'first falling ground',
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(6, 12.5)),
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(6, 15))),
			A4(
			$author$project$Modules$Event$hitLineSeg,
			2,
			'first ?',
			_Utils_Tuple2(564, 491),
			_Utils_Tuple2(604, 491)),
			A4(
			$author$project$Modules$Event$hitLineSeg,
			3,
			'first falling needles',
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(23, 13)),
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(23, 20))),
			A4(
			$author$project$Modules$Event$hitLineSeg,
			4,
			'second ?',
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(24.1, 10)),
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(24.9, 10))),
			A4(
			$author$project$Modules$Event$hitBlock,
			5,
			'first hidden brick',
			_Utils_Tuple2(4.5, 12),
			_Utils_Tuple2(1, 1)),
			A4(
			$author$project$Modules$Event$hitBlock,
			6,
			'second hidden brick',
			_Utils_Tuple2(5.5, 12),
			_Utils_Tuple2(1, 1)),
			A4(
			$author$project$Modules$Event$hitBlock,
			7,
			'third hidden brick',
			_Utils_Tuple2(32.5, 12),
			_Utils_Tuple2(1, 1)),
			A4(
			$author$project$Modules$Event$hitBlock,
			8,
			'fourth hidden brick',
			_Utils_Tuple2(33.5, 12),
			_Utils_Tuple2(1, 1)),
			A4(
			$author$project$Modules$Event$hitLineSeg,
			9,
			'first hidden needles',
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(31, 9.26)),
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(37, 9.26))),
			A4(
			$author$project$Modules$Event$hitLineSeg,
			9,
			'first hidden needles',
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(31, 8.99)),
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(37, 8.99))),
			A4(
			$author$project$Modules$Event$hitBlock,
			10,
			'fifth hidden brick',
			_Utils_Tuple2(44, 12),
			_Utils_Tuple2(1, 1)),
			A4(
			$author$project$Modules$Event$hitBlock,
			11,
			'sixth hidden brick',
			_Utils_Tuple2(45, 12),
			_Utils_Tuple2(1, 1)),
			A4(
			$author$project$Modules$Event$init,
			{id: 12, name: 'sword'},
			$author$project$Modules$Event$AfterActEvent(10),
			$author$project$Modules$Event$PlayerCollide(
				$author$project$GlobalFunction$GlobalBasics$Polygon(
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
									_Utils_Tuple2(46, 1)),
								$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
									_Utils_Tuple2(46, 15)))
							])))),
			$author$project$Modules$Event$quickDuration(10)),
			A4(
			$author$project$Modules$Event$init,
			{id: 12, name: 'sword'},
			$author$project$Modules$Event$AfterActEvent(11),
			$author$project$Modules$Event$PlayerCollide(
				$author$project$GlobalFunction$GlobalBasics$Polygon(
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
									_Utils_Tuple2(46, 1)),
								$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
									_Utils_Tuple2(46, 15)))
							])))),
			$author$project$Modules$Event$quickDuration(10)),
			A5(
			$author$project$Modules$Event$hitBlockAfter,
			13,
			'get pill',
			_Utils_Tuple2(25, 11),
			_Utils_Tuple2(1, 1),
			4)
		]));
var $author$project$Modules$Needle$Downwards = {$: 'Downwards'};
var $author$project$Modules$Needle$Upwards = {$: 'Upwards'};
var $author$project$Modules$Needle$NormalNeedle = F3(
	function (a, b, c) {
		return {$: 'NormalNeedle', a: a, b: b, c: c};
	});
var $author$project$Modules$Needle$needleCollisionBox = function (needleAppearance) {
	var width = needleAppearance.a;
	var height = needleAppearance.b;
	return $author$project$GlobalFunction$GlobalBasics$Polygon(
		$elm$core$Array$fromList(
			_List_fromArray(
				[
					_Utils_Tuple2(
					_Utils_Tuple2(0.0, 0.0),
					_Utils_Tuple2(width, 0.0)),
					_Utils_Tuple2(
					_Utils_Tuple2(width, 0.0),
					_Utils_Tuple2(width, height)),
					_Utils_Tuple2(
					_Utils_Tuple2(width, height),
					_Utils_Tuple2(0.0, height)),
					_Utils_Tuple2(
					_Utils_Tuple2(0.0, height),
					_Utils_Tuple2(0.0, 0.0))
				])));
};
var $author$project$Modules$Needle$normalNeedleHeight = $author$project$GlobalFunction$GlobalBasics$blockSize.b / 20.0;
var $author$project$Modules$Needle$normalNeedleWidth = $author$project$GlobalFunction$GlobalBasics$blockSize.a;
var $author$project$Modules$Needle$initFalling = F3(
	function (_v0, id, needleType) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType),
			collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
			collisionBox: $author$project$Modules$Needle$needleCollisionBox(
				A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType)),
			move: A4(
				$author$project$GlobalFunction$GlobalModule$Move,
				$elm$core$Array$fromList(_List_Nil),
				0.0,
				id,
				A4(
					$author$project$GlobalFunction$GlobalModule$Move,
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$GlobalFunction$GlobalBasics$blockPos(
								_Utils_Tuple2(x, 20))
							])),
					5.0,
					-1,
					$author$project$GlobalFunction$GlobalModule$NoNextMove)),
			pos: $author$project$GlobalFunction$GlobalBasics$blockPos(
				_Utils_Tuple2(x, y)),
			visibility: $author$project$GlobalFunction$GlobalModule$Visible($author$project$GlobalFunction$GlobalModule$NoNextVisibility)
		};
	});
var $author$project$Modules$Needle$initFallingRow = F5(
	function (n, n1, n2, id, needleType) {
		return A2(
			$elm$core$List$map,
			function (i) {
				return A3(
					$author$project$Modules$Needle$initFalling,
					_Utils_Tuple2(i, n),
					id,
					needleType);
			},
			A2($elm$core$List$range, n1, n2));
	});
var $author$project$Modules$Needle$initHidden = F3(
	function (_v0, id, needleType) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType),
			collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
			collisionBox: $author$project$Modules$Needle$needleCollisionBox(
				A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType)),
			move: $author$project$GlobalFunction$GlobalModule$NoNextMove,
			pos: $author$project$GlobalFunction$GlobalBasics$blockPos(
				_Utils_Tuple2(x, y)),
			visibility: $author$project$GlobalFunction$GlobalModule$Invisible(
				A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, id, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))
		};
	});
var $author$project$Modules$Needle$initHiddenFloat = F3(
	function (_v0, id, needleType) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType),
			collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
			collisionBox: $author$project$Modules$Needle$needleCollisionBox(
				A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType)),
			move: $author$project$GlobalFunction$GlobalModule$NoNextMove,
			pos: $author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(x, y)),
			visibility: $author$project$GlobalFunction$GlobalModule$Invisible(
				A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, id, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))
		};
	});
var $author$project$Modules$Needle$initHiddenRow = F5(
	function (n, n1, n2, id, needleType) {
		return A2(
			$elm$core$List$map,
			function (i) {
				return A3(
					$author$project$Modules$Needle$initHiddenFloat,
					_Utils_Tuple2(i, n),
					id,
					needleType);
			},
			A2($elm$core$List$range, n1, n2));
	});
var $author$project$Modules$Needle$init = F5(
	function (_v0, needleAppearance, visibility, collision, move) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: needleAppearance,
			collision: collision,
			collisionBox: $author$project$Modules$Needle$needleCollisionBox(needleAppearance),
			move: move,
			pos: _Utils_Tuple2(x, y),
			visibility: visibility
		};
	});
var $author$project$Modules$Needle$sword = F6(
	function (startPos, chargePos, _v0, speed, id, needleType) {
		var width = _v0.a;
		var height = _v0.b;
		return A5(
			$author$project$Modules$Needle$init,
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(startPos),
			A3($author$project$Modules$Needle$NormalNeedle, width * 40, height * 40, needleType),
			$author$project$GlobalFunction$GlobalModule$Invisible(
				A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, id, $author$project$GlobalFunction$GlobalModule$NoNextVisibility)),
			$author$project$GlobalFunction$GlobalModule$NoCollide(
				A2($author$project$GlobalFunction$GlobalModule$CollideAfterEvent, id, $author$project$GlobalFunction$GlobalModule$NoNextCollision)),
			A4(
				$author$project$GlobalFunction$GlobalModule$Move,
				$elm$core$Array$fromList(_List_Nil),
				0.0,
				id,
				A4(
					$author$project$GlobalFunction$GlobalModule$Move,
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$GlobalFunction$GlobalBasics$blockPosFloat(chargePos)
							])),
					speed,
					-1,
					$author$project$GlobalFunction$GlobalModule$NoNextMove)));
	});
var $author$project$Level1$Level1Init$initNeedles = $elm$core$Array$fromList(
	$elm$core$List$concat(
		_List_fromArray(
			[
				_List_fromArray(
				[
					A3(
					$author$project$Modules$Needle$initHidden,
					_Utils_Tuple2(15, 13),
					2,
					$author$project$Modules$Needle$Downwards)
				]),
				A5($author$project$Modules$Needle$initFallingRow, 13, 22, 26, 3, $author$project$Modules$Needle$Downwards),
				A5($author$project$Modules$Needle$initHiddenRow, 9, 31, 37, 9, $author$project$Modules$Needle$Downwards),
				function () {
				var tempSword = A6(
					$author$project$Modules$Needle$sword,
					_Utils_Tuple2(46, 14.75),
					_Utils_Tuple2(46, -2),
					_Utils_Tuple2(4, 0.25),
					6.0,
					12,
					$author$project$Modules$Needle$Upwards);
				return _List_fromArray(
					[
						_Utils_update(
						tempSword,
						{
							collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
							visibility: $author$project$GlobalFunction$GlobalModule$Visible($author$project$GlobalFunction$GlobalModule$NoNextVisibility)
						})
					]);
			}()
			])));
var $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility = {$: 'NoNextNoticeBoardVisibility'};
var $author$project$Modules$NoticeBoard$Visible = F2(
	function (a, b) {
		return {$: 'Visible', a: a, b: b};
	});
var $author$project$Modules$NoticeBoard$quickInit = F3(
	function (pos, info, fontSize) {
		return {
			fontSize: fontSize,
			move: $author$project$GlobalFunction$GlobalModule$NoNextMove,
			noticeBoardVisibility: A2($author$project$Modules$NoticeBoard$Visible, info, $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility),
			pos: pos
		};
	});
var $author$project$Level1$Level1Init$initNoticeBoards = $elm$core$Array$fromList(
	_List_fromArray(
		[
			A3(
			$author$project$Modules$NoticeBoard$quickInit,
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(5.5, 7.5)),
			'Welcome!',
			40),
			A3(
			$author$project$Modules$NoticeBoard$quickInit,
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(34.5, 7.5)),
			'Caution!',
			40),
			A3(
			$author$project$Modules$NoticeBoard$quickInit,
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(15.5, 12.85)),
			'?',
			40),
			A3(
			$author$project$Modules$NoticeBoard$quickInit,
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(24.5, 9.85)),
			'?',
			40),
			A3(
			$author$project$Modules$NoticeBoard$quickInit,
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(15.0, 7.0)),
			'Press R to respawn',
			40)
		]));
var $author$project$Modules$Sound$Event = F2(
	function (a, b) {
		return {$: 'Event', a: a, b: b};
	});
var $author$project$Modules$Sound$Needle = {$: 'Needle'};
var $author$project$Modules$Sound$RandomBox = {$: 'RandomBox'};
var $author$project$Modules$Sound$Sound = function (soundTrigger) {
	return {soundTrigger: soundTrigger};
};
var $author$project$Modules$Sound$init = function (soundTriggerList) {
	return $author$project$Modules$Sound$Sound(soundTriggerList);
};
var $author$project$Level1$Level1Init$initSound = $author$project$Modules$Sound$init(
	_List_fromArray(
		[
			A2($author$project$Modules$Sound$Event, 2, $author$project$Modules$Sound$RandomBox),
			A2($author$project$Modules$Sound$Event, 3, $author$project$Modules$Sound$Needle),
			A2($author$project$Modules$Sound$Event, 4, $author$project$Modules$Sound$RandomBox),
			A2($author$project$Modules$Sound$Event, 5, $author$project$Modules$Sound$RandomBox),
			A2($author$project$Modules$Sound$Event, 6, $author$project$Modules$Sound$RandomBox),
			A2($author$project$Modules$Sound$Event, 7, $author$project$Modules$Sound$RandomBox),
			A2($author$project$Modules$Sound$Event, 8, $author$project$Modules$Sound$RandomBox),
			A2($author$project$Modules$Sound$Event, 9, $author$project$Modules$Sound$Needle),
			A2($author$project$Modules$Sound$Event, 10, $author$project$Modules$Sound$RandomBox),
			A2($author$project$Modules$Sound$Event, 11, $author$project$Modules$Sound$RandomBox)
		]));
var $author$project$Modules$Boundary$Boundary = F4(
	function (upBoundary, downBoundary, leftBoundary, rightBoundary) {
		return {downBoundary: downBoundary, leftBoundary: leftBoundary, rightBoundary: rightBoundary, upBoundary: upBoundary};
	});
var $author$project$Modules$Boundary$BoundaryCollide = {$: 'BoundaryCollide'};
var $author$project$Modules$Boundary$BoundaryDeath = {$: 'BoundaryDeath'};
var $author$project$Modules$Boundary$normalInit = A4($author$project$Modules$Boundary$Boundary, $author$project$Modules$Boundary$BoundaryCollide, $author$project$Modules$Boundary$BoundaryDeath, $author$project$Modules$Boundary$BoundaryCollide, $author$project$Modules$Boundary$BoundaryCollide);
var $author$project$Level1$Level1Init$init = function (_v0) {
	var newModel = {
		actEvent: $elm$core$Array$fromList(_List_Nil),
		boundary: $author$project$Modules$Boundary$normalInit,
		bricks: $author$project$Level1$Level1Init$initBricks,
		endPoint: $author$project$Modules$EndPoint$init(
			$author$project$GlobalFunction$GlobalBasics$blockPos(
				_Utils_Tuple2(76, 14))),
		event: $author$project$Level1$Level1Init$initEvent,
		gameControl: A2(
			$author$project$Modules$GameControl$init,
			$author$project$MainFunction$MainType$Level2,
			_List_fromArray(
				[
					_List_fromArray(
					['To circumvent the moonster,', 'jump back onto the first tunnel', 'and then jump over the monster.'])
				])),
		keyPressed: _List_Nil,
		levelBoundary: _Utils_Tuple2(80 * 40, 680.0),
		mainScene: $author$project$MainFunction$MainType$Level1,
		monsters: $elm$core$Array$fromList(
			_List_fromArray(
				[
					A6(
					$author$project$Modules$Monster$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(66, 14)),
					A2($author$project$Modules$Monster$MonsterA, 40, 40),
					$author$project$Modules$Monster$ListenX(300),
					$author$project$Modules$Monster$ListenY(300),
					1,
					_Utils_Tuple2(56 * 40, 65 * 40))
				])),
		needles: $author$project$Level1$Level1Init$initNeedles,
		noticeBoards: $author$project$Level1$Level1Init$initNoticeBoards,
		player: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50.0, 490.0),
			$author$project$Modules$Player$defPlayerProperty,
			$author$project$Modules$Player$NoNextPropertyChange),
		playerAtLastSavePoint: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50.0, 490.0),
			$author$project$Modules$Player$defPlayerProperty,
			$author$project$Modules$Player$NoNextPropertyChange),
		savePoints: $elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(2, 14))),
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(41, 14)))
				])),
		sound: $author$project$Level1$Level1Init$initSound,
		windowBoundary: _Utils_Tuple2(1000.0, 800.0)
	};
	return _Utils_Tuple2(
		newModel,
		A2($elm$core$Task$perform, $author$project$MainFunction$MainType$GetViewport, $elm$browser$Browser$Dom$getViewport));
};
var $author$project$Modules$Player$ChangeTo = F3(
	function (a, b, c) {
		return {$: 'ChangeTo', a: a, b: b, c: c};
	});
var $author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent = F2(
	function (a, b) {
		return {$: 'InvisibleAfterEvent', a: a, b: b};
	});
var $author$project$Modules$NoticeBoard$InvisibleAfterEvent = F2(
	function (a, b) {
		return {$: 'InvisibleAfterEvent', a: a, b: b};
	});
var $author$project$Modules$Needle$Laser = {$: 'Laser'};
var $author$project$MainFunction$MainType$Level3 = {$: 'Level3'};
var $author$project$Modules$Brick$Switch = function (a) {
	return {$: 'Switch', a: a};
};
var $author$project$Modules$Event$TimeAfterStart = function (a) {
	return {$: 'TimeAfterStart', a: a};
};
var $author$project$Modules$NoticeBoard$boundaryCollide = F2(
	function (_v0, _v1) {
		var x = _v0.a;
		var y = _v0.b;
		var width = _v1.a;
		var height = _v1.b;
		var _v2 = $author$project$GlobalFunction$GlobalBasics$blockSize;
		var blockX = _v2.a;
		var blockY = _v2.b;
		var tempBrick = A3(
			$author$project$Modules$Brick$initPosVolumeColor,
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(x, y)),
			_Utils_Tuple2(width * blockX, height * blockY),
			'#F5F5F5');
		return _Utils_update(
			tempBrick,
			{
				collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision)
			});
	});
var $author$project$Modules$Brick$initCollideHiddenRow = F4(
	function (n, x, y, id) {
		return A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$author$project$Modules$Brick$initCollideHidden,
					_Utils_Tuple2(i, n),
					id);
			},
			A2($elm$core$List$range, x, y));
	});
var $author$project$Modules$Needle$initHiddenFalling = F3(
	function (_v0, id, needleType) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType),
			collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
			collisionBox: $author$project$Modules$Needle$needleCollisionBox(
				A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType)),
			move: A4(
				$author$project$GlobalFunction$GlobalModule$Move,
				$elm$core$Array$fromList(_List_Nil),
				0.0,
				id,
				A4(
					$author$project$GlobalFunction$GlobalModule$Move,
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$GlobalFunction$GlobalBasics$blockPos(
								_Utils_Tuple2(x, 20))
							])),
					5.0,
					-1,
					$author$project$GlobalFunction$GlobalModule$NoNextMove)),
			pos: $author$project$GlobalFunction$GlobalBasics$blockPos(
				_Utils_Tuple2(x, y)),
			visibility: $author$project$GlobalFunction$GlobalModule$Invisible($author$project$GlobalFunction$GlobalModule$NoNextVisibility)
		};
	});
var $author$project$Modules$Needle$initHiddenFallingRow = F5(
	function (n, n1, n2, id, needleType) {
		return A2(
			$elm$core$List$map,
			function (i) {
				return A3(
					$author$project$Modules$Needle$initHiddenFalling,
					_Utils_Tuple2(i, n),
					id,
					needleType);
			},
			A2($elm$core$List$range, n1, n2));
	});
var $author$project$Modules$Brick$quickTunnel = function (pos) {
	return A3(
		$author$project$Modules$Brick$initPosVolumeColor,
		$author$project$GlobalFunction$GlobalBasics$blockPosFloat(pos),
		_Utils_Tuple2(2 * 40, 3.5 * 40),
		'#008000');
};
var $author$project$Level2$Level2Init$init = function (a) {
	var newModel = {
		actEvent: $elm$core$Array$fromList(_List_Nil),
		boundary: $author$project$Modules$Boundary$normalInit,
		bricks: $elm$core$Array$fromList(
			$elm$core$List$concat(
				_List_fromArray(
					[
						A3($author$project$Modules$Brick$initRow, 15, 1, 14),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Brick$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(8, 14)),
							$author$project$Modules$Brick$Switch(true),
							$author$project$GlobalFunction$GlobalModule$Visible(
								A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 1, $author$project$GlobalFunction$GlobalModule$NoNextVisibility)),
							$author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Brick$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(8, 14)),
							$author$project$Modules$Brick$Switch(false),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, 1, $author$project$GlobalFunction$GlobalModule$NoNextVisibility)),
							$author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						]),
						function () {
						var tempBoard1 = A2(
							$author$project$Modules$NoticeBoard$boundaryCollide,
							_Utils_Tuple2(7, 5),
							_Utils_Tuple2(8, 3));
						return _List_fromArray(
							[
								_Utils_update(
								tempBoard1,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0.0,
										1,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(7, 12))
													])),
											5.0,
											-1,
											$author$project$GlobalFunction$GlobalModule$NoNextMove))
								})
							]);
					}(),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$Brick$initCollideHidden,
							_Utils_Tuple2(15, 8.5),
							2)
						]),
						A3($author$project$Modules$Brick$initRow, 15, 22, 22),
						A4($author$project$Modules$Brick$initFallingRow, 15, 23, 25, 3),
						A3($author$project$Modules$Brick$initRow, 15, 26, 36),
						A4($author$project$Modules$Brick$initFallingRow, 12, 38, 39, 5),
						function () {
						var tempBoard2 = A2(
							$author$project$Modules$NoticeBoard$boundaryCollide,
							_Utils_Tuple2(42, 9),
							_Utils_Tuple2(4, 1.5));
						return _List_fromArray(
							[
								_Utils_update(
								tempBoard2,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0.0,
										6,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(52.5, 9))
													])),
											2.0,
											-1,
											$author$project$GlobalFunction$GlobalModule$NoNextMove))
								})
							]);
					}(),
						A3($author$project$Modules$Brick$initRow, 15, 60, 71),
						A3($author$project$Modules$Brick$initRow, 15, 78, 90),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$NoticeBoard$boundary,
							_Utils_Tuple2(57, 6),
							_Utils_Tuple2(3, 2))
						]),
						_List_fromArray(
						[
							$author$project$Modules$Brick$quickTunnel(
							_Utils_Tuple2(70, 11.5)),
							$author$project$Modules$Brick$quickTunnel(
							_Utils_Tuple2(78, 11.5))
						]),
						A4($author$project$Modules$Brick$initFallingRow, 15, 72, 77, 13),
						A4($author$project$Modules$Brick$initCollideHiddenRow, 12, 72, 77, 14),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$NoticeBoard$boundary,
							_Utils_Tuple2(72, 6.5),
							_Utils_Tuple2(6, 3.5))
						]),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$Brick$initCollideHidden,
							_Utils_Tuple2(71.5, 8.5),
							10),
							A2(
							$author$project$Modules$Brick$initCollideHidden,
							_Utils_Tuple2(72.5, 8.5),
							11)
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Brick$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(78.125, 11.5 - 1.75)),
							A3($author$project$Modules$Brick$Detailed, 70, 70, '#FFFF00'),
							$author$project$GlobalFunction$GlobalModule$Visible(
								A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 15, $author$project$GlobalFunction$GlobalModule$NoNextVisibility)),
							$author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						])
					]))),
		endPoint: $author$project$Modules$EndPoint$init(
			$author$project$GlobalFunction$GlobalBasics$blockPos(
				_Utils_Tuple2(89, 14))),
		event: $elm$core$Array$fromList(
			_List_fromArray(
				[
					A4(
					$author$project$Modules$Event$hitBlock,
					1,
					'first switch',
					_Utils_Tuple2(8, 14),
					_Utils_Tuple2(1, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					2,
					'first hidden brick',
					_Utils_Tuple2(15, 8.5),
					_Utils_Tuple2(1, 1)),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					3,
					'first falling ground',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(23, 1)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(23, 15))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					4,
					'second falling groud',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(38, 12)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(40, 12))),
					A4(
					$author$project$Modules$Event$init,
					{id: 5, name: 'second falling ground'},
					$author$project$Modules$Event$AfterActEvent(4),
					$author$project$Modules$Event$TimeAfterStart(60),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					6,
					'first transporting board',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(42, 9)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(46, 9))),
					A4(
					$author$project$Modules$Event$hitBlock,
					7,
					'second hidden brick',
					_Utils_Tuple2(57.5, 6.5),
					_Utils_Tuple2(1, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					8,
					'first hidden needles',
					_Utils_Tuple2(57, 5.8),
					_Utils_Tuple2(3, 0.21)),
					A4(
					$author$project$Modules$Event$hitBlock,
					9,
					'first hidden needles',
					_Utils_Tuple2(57, 8),
					_Utils_Tuple2(3, 0.21)),
					A4(
					$author$project$Modules$Event$hitBlock,
					10,
					'third hidden brick',
					_Utils_Tuple2(71.5, 8.5),
					_Utils_Tuple2(1, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					11,
					'third hidden brick',
					_Utils_Tuple2(72.5, 8.5),
					_Utils_Tuple2(1, 1)),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					12,
					'enter between tunnels',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(72, 14.9)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(78, 14.9))),
					A4(
					$author$project$Modules$Event$init,
					{id: 13, name: 'falling ground between tunnels'},
					$author$project$Modules$Event$AfterActEvent(12),
					$author$project$Modules$Event$TimeAfterStart(60),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 14, name: 'hidden bricks between tunnels'},
					$author$project$Modules$Event$AfterActEvent(12),
					$author$project$Modules$Event$PlayerCollide(
						$author$project$GlobalFunction$GlobalBasics$Polygon(
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										_Utils_Tuple2(
										$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
											_Utils_Tuple2(72, 13.1)),
										$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
											_Utils_Tuple2(78, 13.1)))
									])))),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$hitBlock,
					15,
					'Reverse direction',
					_Utils_Tuple2(78.125, 11.5 - 1.75),
					_Utils_Tuple2(1.75, 1.75))
				])),
		gameControl: A2(
			$author$project$Modules$GameControl$init,
			$author$project$MainFunction$MainType$Level3,
			_List_fromArray(
				[
					_List_fromArray(
					['To circumvent the first NoticeBoard,', 'triger the switch and back off quickly,', 'then jump onto the NoticeBoard']),
					_List_fromArray(
					['The big \"?\" will disturb', 'your direction control'])
				])),
		keyPressed: _List_Nil,
		levelBoundary: _Utils_Tuple2(90 * 40, 680.0),
		mainScene: $author$project$MainFunction$MainType$Level2,
		needles: $elm$core$Array$fromList(
			$elm$core$List$concat(
				_List_fromArray(
					[
						A5($author$project$Modules$Needle$initHiddenFallingRow, 8, 7, 14, 1, $author$project$Modules$Needle$Downwards),
						A5($author$project$Modules$Needle$initHiddenRow, 6, 57, 59, 8, $author$project$Modules$Needle$Laser),
						A5($author$project$Modules$Needle$initHiddenRow, 8, 57, 59, 9, $author$project$Modules$Needle$Laser)
					]))),
		noticeBoards: $elm$core$Array$fromList(
			_List_fromArray(
				[
					function () {
					var tempBoard1 = A3(
						$author$project$Modules$NoticeBoard$quickInit,
						$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
							_Utils_Tuple2(10.8, 6.8)),
						'It\'s a trap!',
						60);
					return _Utils_update(
						tempBoard1,
						{
							move: A4(
								$author$project$GlobalFunction$GlobalModule$Move,
								$elm$core$Array$fromList(_List_Nil),
								0.0,
								1,
								A4(
									$author$project$GlobalFunction$GlobalModule$Move,
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
												_Utils_Tuple2(10.8, 13.8))
											])),
									5.0,
									-1,
									$author$project$GlobalFunction$GlobalModule$NoNextMove))
						});
				}(),
					function () {
					var tempBoard2 = A3(
						$author$project$Modules$NoticeBoard$quickInit,
						$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
							_Utils_Tuple2(44, 10)),
						'Let\'s go!',
						40);
					return _Utils_update(
						tempBoard2,
						{
							move: A4(
								$author$project$GlobalFunction$GlobalModule$Move,
								$elm$core$Array$fromList(_List_Nil),
								0.0,
								6,
								A4(
									$author$project$GlobalFunction$GlobalModule$Move,
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
												_Utils_Tuple2(54.5, 10))
											])),
									2.0,
									-1,
									$author$project$GlobalFunction$GlobalModule$NoNextMove))
						});
				}(),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(58.5, 7.2)),
					':)',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(75, 8)),
					'Danger!',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(75, 9.2)),
					'↓',
					40),
					function () {
					var tempBoard3 = A3(
						$author$project$Modules$NoticeBoard$quickInit,
						$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
							_Utils_Tuple2(79, 11.2)),
						'?',
						60);
					return _Utils_update(
						tempBoard3,
						{
							noticeBoardVisibility: A2(
								$author$project$Modules$NoticeBoard$Visible,
								'?',
								A2($author$project$Modules$NoticeBoard$InvisibleAfterEvent, 15, $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility))
						});
				}()
				])),
		player: function () {
			var defPlayerProperty = $author$project$Modules$Player$defPlayerProperty;
			return A3(
				$author$project$Modules$Player$init,
				_Utils_Tuple2(50.0, 490.0),
				$author$project$Modules$Player$defPlayerProperty,
				A3(
					$author$project$Modules$Player$ChangeTo,
					_Utils_update(
						defPlayerProperty,
						{playerHorizontalSpeed: -1.93}),
					15,
					$author$project$Modules$Player$NoNextPropertyChange));
		}(),
		playerAtLastSavePoint: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50.0, 490.0),
			$author$project$Modules$Player$defPlayerProperty,
			$author$project$Modules$Player$NoNextPropertyChange),
		savePoints: $elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(2, 14))),
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(30, 14))),
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(65, 14)))
				])),
		sound: $author$project$Modules$Sound$init(
			_List_fromArray(
				[
					A2($author$project$Modules$Sound$Event, 2, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 7, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 10, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 11, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 14, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 15, $author$project$Modules$Sound$RandomBox)
				])),
		windowBoundary: _Utils_Tuple2(1000.0, 800.0)
	};
	return _Utils_Tuple2(
		newModel,
		A2($elm$core$Task$perform, $author$project$MainFunction$MainType$GetViewport, $elm$browser$Browser$Dom$getViewport));
};
var $author$project$Modules$Needle$BombUp = {$: 'BombUp'};
var $author$project$MainFunction$MainType$Level4 = {$: 'Level4'};
var $author$project$Modules$Sound$Sword = {$: 'Sword'};
var $author$project$Modules$EndPoint$initDetailed = F2(
	function (_v0, _v1) {
		var x = _v0.a;
		var y = _v0.b;
		var width = _v1.a;
		var height = _v1.b;
		return {
			collisionBox: $author$project$GlobalFunction$GlobalBasics$Polygon(
				$elm$core$Array$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(
							_Utils_Tuple2(0.0, 0.0),
							_Utils_Tuple2(width, 0.0)),
							_Utils_Tuple2(
							_Utils_Tuple2(width, 0.0),
							_Utils_Tuple2(width, height)),
							_Utils_Tuple2(
							_Utils_Tuple2(width, height),
							_Utils_Tuple2(0.0, height)),
							_Utils_Tuple2(
							_Utils_Tuple2(0.0, height),
							_Utils_Tuple2(0.0, 0.0))
						]))),
			pos: _Utils_Tuple2(x, y)
		};
	});
var $author$project$Level3$Level3Init$init = function (a) {
	var newModel = {
		actEvent: $elm$core$Array$fromList(_List_Nil),
		boundary: $author$project$Modules$Boundary$normalInit,
		bricks: $elm$core$Array$fromList(
			$elm$core$List$concat(
				_List_fromArray(
					[
						A3($author$project$Modules$Brick$initRow, 15, 1, 12),
						A3($author$project$Modules$Brick$initRow, 15, 17, 54),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$NoticeBoard$boundary,
							_Utils_Tuple2(2, 4.2),
							_Utils_Tuple2(7, 5.2))
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(2, 11)),
							_Utils_Tuple2(40, 40),
							'#FFFF00'),
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(4, 11)),
							_Utils_Tuple2(40, 40),
							'#FFFF00'),
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(6, 11)),
							_Utils_Tuple2(40, 40),
							'#FFFF00'),
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(8, 11)),
							_Utils_Tuple2(40, 40),
							'#FFFF00')
						]),
						A4($author$project$Modules$Brick$initFallingRow, 15, 13, 16, 5),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$NoticeBoard$boundary,
							_Utils_Tuple2(46, 8),
							_Utils_Tuple2(6.5, 4))
						])
					]))),
		endPoint: A2(
			$author$project$Modules$EndPoint$initDetailed,
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(47, 10.5)),
			_Utils_Tuple2(5 * 40, 1 * 40)),
		event: $elm$core$Array$fromList(
			_List_fromArray(
				[
					A4(
					$author$project$Modules$Event$hitLineSeg,
					1,
					'A',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(2, 12.1)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(3, 12.1))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					2,
					'B',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(4, 12.1)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(5, 12.1))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					3,
					'C',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(6, 12.1)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(7, 12.1))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					4,
					'D',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(8, 12.1)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(9, 12.1))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					5,
					'first falling ground',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(12.7, 1)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(12.7, 15))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					6,
					'first sword',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(14, 1)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(14, 14)))
				])),
		gameControl: A2(
			$author$project$Modules$GameControl$init,
			$author$project$MainFunction$MainType$Level4,
			_List_fromArray(
				[
					_List_fromArray(
					['Go right and then hit \"Silver Dog\"'])
				])),
		keyPressed: _List_Nil,
		levelBoundary: _Utils_Tuple2(54 * 40, 680.0),
		mainScene: $author$project$MainFunction$MainType$Level3,
		needles: $elm$core$Array$fromList(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Needle$initHidden,
							_Utils_Tuple2(2, 12),
							1,
							$author$project$Modules$Needle$Downwards)
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Needle$initHidden,
							_Utils_Tuple2(4, 12),
							2,
							$author$project$Modules$Needle$Downwards)
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Needle$initHidden,
							_Utils_Tuple2(6, 12),
							3,
							$author$project$Modules$Needle$Downwards)
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Needle$initHidden,
							_Utils_Tuple2(8, 12),
							4,
							$author$project$Modules$Needle$Downwards)
						]),
						_List_fromArray(
						[
							A6(
							$author$project$Modules$Needle$sword,
							_Utils_Tuple2(14, 16),
							_Utils_Tuple2(14, -3),
							_Utils_Tuple2(2, 3),
							8.0,
							6,
							$author$project$Modules$Needle$BombUp)
						])
					]))),
		noticeBoards: $elm$core$Array$fromList(
			_List_fromArray(
				[
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(5.5, 5)),
					'Which game studio do you',
					20),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(3.8, 5.8)),
					'think is best?',
					20),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(4.5, 6.6)),
					'A. Ubisoft （育碧）',
					20),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(4.6, 7.4)),
					'B. Rockstar （R星）',
					20),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(4.5, 8.2)),
					'C. Paradox （P社）',
					20),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(5.1, 9.0)),
					'D. Electronic Arts（EA）',
					20),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(2.5, 11.8)),
					'A',
					35),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(4.5, 11.8)),
					'B',
					35),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(6.5, 11.8)),
					'C',
					35),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(8.5, 11.8)),
					'D',
					35),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(49.2, 8.6)),
					'Thanks for support!',
					25),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(49.2, 9.4)),
					'\"Easy Challenges\" is',
					25),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(48, 10.2)),
					'created by:',
					25),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(49.2, 11.3)),
					'Silver Dog',
					30)
				])),
		player: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50.0, 490.0),
			$author$project$Modules$Player$defPlayerProperty,
			$author$project$Modules$Player$NoNextPropertyChange),
		playerAtLastSavePoint: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50.0, 490.0),
			$author$project$Modules$Player$defPlayerProperty,
			$author$project$Modules$Player$NoNextPropertyChange),
		savePoints: $elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(2, 14)))
				])),
		sound: $author$project$Modules$Sound$init(
			_List_fromArray(
				[
					A2($author$project$Modules$Sound$Event, 6, $author$project$Modules$Sound$Sword)
				])),
		windowBoundary: _Utils_Tuple2(1000.0, 800.0)
	};
	return _Utils_Tuple2(
		newModel,
		A2($elm$core$Task$perform, $author$project$MainFunction$MainType$GetViewport, $elm$browser$Browser$Dom$getViewport));
};
var $author$project$Modules$Needle$BombLeft = {$: 'BombLeft'};
var $author$project$Modules$Brick$Helmet = {$: 'Helmet'};
var $author$project$Modules$NoticeBoard$Invisible = function (a) {
	return {$: 'Invisible', a: a};
};
var $author$project$MainFunction$MainType$Level5 = {$: 'Level5'};
var $author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent = F2(
	function (a, b) {
		return {$: 'NoCollideAfterEvent', a: a, b: b};
	});
var $author$project$Modules$NoticeBoard$VisibleAfterEvent = F3(
	function (a, b, c) {
		return {$: 'VisibleAfterEvent', a: a, b: b, c: c};
	});
var $author$project$Modules$NoticeBoard$init = F4(
	function (pos, noticeBoardVisibility, noticeBoardMove, fontSize) {
		return {fontSize: fontSize, move: noticeBoardMove, noticeBoardVisibility: noticeBoardVisibility, pos: pos};
	});
var $author$project$Level4$Level4Init$init = function (a) {
	var newModel = {
		actEvent: $elm$core$Array$fromList(_List_Nil),
		boundary: $author$project$Modules$Boundary$normalInit,
		bricks: $elm$core$Array$fromList(
			$elm$core$List$concat(
				_List_fromArray(
					[
						A3($author$project$Modules$Brick$initRow, 15, 1, 10),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(3, 11.5)),
							_Utils_Tuple2(40, 40),
							'#FFFF00'),
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(6, 11.5)),
							_Utils_Tuple2(40, 40),
							'#FFFF00'),
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(9, 11.5)),
							_Utils_Tuple2(40, 40),
							'#FFFF00'),
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(17, 11.5)),
							_Utils_Tuple2(40, 40),
							'#FFFF00'),
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(20, 11.5)),
							_Utils_Tuple2(40, 40),
							'#FFFF00'),
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(23, 11.5)),
							_Utils_Tuple2(40, 40),
							'#FFFF00'),
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(26, 11.5)),
							_Utils_Tuple2(40, 40),
							'#FFFF00')
						]),
						A3($author$project$Modules$Brick$initRow, 15, 16, 30),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$NoticeBoard$boundary,
							_Utils_Tuple2(19, 7),
							_Utils_Tuple2(6, 3))
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Brick$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(20, 14)),
							$author$project$Modules$Brick$Helmet,
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									8,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 9, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						])
					]))),
		endPoint: $author$project$Modules$EndPoint$init(
			$author$project$GlobalFunction$GlobalBasics$blockPos(
				_Utils_Tuple2(89, 14))),
		event: $elm$core$Array$fromList(
			_List_fromArray(
				[
					A4(
					$author$project$Modules$Event$hitBlock,
					1,
					'first ?',
					_Utils_Tuple2(3.1, 11.6),
					_Utils_Tuple2(0.8, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					2,
					'second ?',
					_Utils_Tuple2(6.1, 11.6),
					_Utils_Tuple2(0.8, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					3,
					'third ?',
					_Utils_Tuple2(9.1, 11.6),
					_Utils_Tuple2(0.8, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					4,
					'fourth ?',
					_Utils_Tuple2(17.1, 11.6),
					_Utils_Tuple2(0.8, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					5,
					'fifth ?',
					_Utils_Tuple2(20.1, 11.6),
					_Utils_Tuple2(0.8, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					6,
					'sixth ?',
					_Utils_Tuple2(23.1, 11.6),
					_Utils_Tuple2(0.8, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					7,
					'seventh ?',
					_Utils_Tuple2(26.1, 11.6),
					_Utils_Tuple2(0.8, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					8,
					'eighth ?',
					_Utils_Tuple2(23.7, 8.1),
					_Utils_Tuple2(1, 1)),
					function () {
					var tempEvent1 = A4(
						$author$project$Modules$Event$hitBlock,
						9,
						'get helmet',
						_Utils_Tuple2(20, 14),
						_Utils_Tuple2(1, 1));
					return _Utils_update(
						tempEvent1,
						{
							ifStartAct: $author$project$Modules$Event$AfterActEvent(8)
						});
				}(),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					10,
					'needle',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(26.1, 12.6)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(26.9, 12.6))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					11,
					'first sword',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(12, 1)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(12, 15))),
					A4(
					$author$project$Modules$Event$hitBlock,
					12,
					'second sword',
					_Utils_Tuple2(22.5, 11.5),
					_Utils_Tuple2(2, 2))
				])),
		gameControl: A2(
			$author$project$Modules$GameControl$init,
			$author$project$MainFunction$MainType$Level5,
			_List_fromArray(
				[
					_List_fromArray(
					['Note that the \"?\"', 'on the NoticeBoard also counts']),
					_List_fromArray(
					['The helmet can protect', 'you from the last \"?\"'])
				])),
		keyPressed: _List_Nil,
		levelBoundary: _Utils_Tuple2(30 * 40, 680.0),
		mainScene: $author$project$MainFunction$MainType$Level4,
		needles: $elm$core$Array$fromList(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(26.1, 12.5)),
							A3($author$project$Modules$Needle$NormalNeedle, 32, 4, $author$project$Modules$Needle$Downwards),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, 10, $author$project$GlobalFunction$GlobalModule$NoNextVisibility)),
							$author$project$GlobalFunction$GlobalModule$Collide(
								A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 9, $author$project$GlobalFunction$GlobalModule$NoNextCollision)),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						]),
						_List_fromArray(
						[
							A6(
							$author$project$Modules$Needle$sword,
							_Utils_Tuple2(12, 15),
							_Utils_Tuple2(12, -10),
							_Utils_Tuple2(3, 5),
							7.0,
							11,
							$author$project$Modules$Needle$BombUp)
						]),
						_List_fromArray(
						[
							A6(
							$author$project$Modules$Needle$sword,
							_Utils_Tuple2(28, 12),
							_Utils_Tuple2(-10, 12),
							_Utils_Tuple2(4, 2),
							7.0,
							12,
							$author$project$Modules$Needle$BombLeft)
						])
					]))),
		noticeBoards: $elm$core$Array$fromList(
			_List_fromArray(
				[
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(3.5, 12.3)),
					'?',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(6.5, 12.3)),
					'?',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(9.5, 12.3)),
					'?',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(17.5, 12.3)),
					'?',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(20.5, 12.3)),
					'?',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(23.5, 12.3)),
					'?',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(26.5, 12.3)),
					'?',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(22, 9)),
					'Hit all the \"?\"',
					35),
					A4(
					$author$project$Modules$NoticeBoard$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(20, 14)),
					$author$project$Modules$NoticeBoard$Invisible(
						A3($author$project$Modules$NoticeBoard$VisibleAfterEvent, 9, 'Your head is full of power!', $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility)),
					$author$project$GlobalFunction$GlobalModule$NoNextMove,
					30)
				])),
		number: _List_Nil,
		player: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50.0, 490.0),
			$author$project$Modules$Player$defPlayerProperty,
			$author$project$Modules$Player$NoNextPropertyChange),
		playerAtLastSavePoint: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50.0, 490.0),
			$author$project$Modules$Player$defPlayerProperty,
			$author$project$Modules$Player$NoNextPropertyChange),
		savePoints: $elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(2, 14)))
				])),
		sound: $author$project$Modules$Sound$init(
			_List_fromArray(
				[
					A2($author$project$Modules$Sound$Event, 1, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 2, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 3, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 4, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 5, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 6, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 7, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 8, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 10, $author$project$Modules$Sound$Needle),
					A2($author$project$Modules$Sound$Event, 11, $author$project$Modules$Sound$Sword),
					A2($author$project$Modules$Sound$Event, 12, $author$project$Modules$Sound$Sword)
				])),
		windowBoundary: _Utils_Tuple2(1000.0, 800.0)
	};
	return _Utils_Tuple2(
		newModel,
		A2($elm$core$Task$perform, $author$project$MainFunction$MainType$GetViewport, $elm$browser$Browser$Dom$getViewport));
};
var $author$project$MainFunction$MainType$Level6 = {$: 'Level6'};
var $author$project$Modules$Brick$Wings = {$: 'Wings'};
var $author$project$Modules$Needle$deadlyBlock = F2(
	function (pos, _v0) {
		var width = _v0.a;
		var height = _v0.b;
		return A5(
			$author$project$Modules$Needle$init,
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(pos),
			A3($author$project$Modules$Needle$NormalNeedle, width * 40, height * 40, $author$project$Modules$Needle$Laser),
			$author$project$GlobalFunction$GlobalModule$Visible($author$project$GlobalFunction$GlobalModule$NoNextVisibility),
			$author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
			$author$project$GlobalFunction$GlobalModule$NoNextMove);
	});
var $author$project$Modules$Event$hitLineSegAfter = F5(
	function (id_, name_, pos1_, pos2_, afterID) {
		return A4(
			$author$project$Modules$Event$init,
			{id: id_, name: name_},
			$author$project$Modules$Event$AfterActEvent(afterID),
			$author$project$Modules$Event$PlayerCollide(
				$author$project$GlobalFunction$GlobalBasics$Polygon(
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(pos1_, pos2_)
							])))),
			$author$project$Modules$Event$quickDuration(10));
	});
var $author$project$Modules$Needle$initHiddenCollideAfter = F3(
	function (_v0, id, needleType) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType),
			collision: $author$project$GlobalFunction$GlobalModule$NoCollide(
				A2($author$project$GlobalFunction$GlobalModule$CollideAfterEvent, id, $author$project$GlobalFunction$GlobalModule$NoNextCollision)),
			collisionBox: $author$project$Modules$Needle$needleCollisionBox(
				A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType)),
			move: $author$project$GlobalFunction$GlobalModule$NoNextMove,
			pos: $author$project$GlobalFunction$GlobalBasics$blockPos(
				_Utils_Tuple2(x, y)),
			visibility: $author$project$GlobalFunction$GlobalModule$Invisible(
				A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, id, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))
		};
	});
var $author$project$Level5$Level5Init$init = function (a) {
	var tempProperty = $author$project$Modules$Player$defPlayerProperty;
	var newProperty = _Utils_update(
		tempProperty,
		{ifPlayerJumpOnTheGround: false, playerJumpNum: 999999});
	var newnewProperty = _Utils_update(
		newProperty,
		{isGreen: true});
	var newModel = {
		actEvent: $elm$core$Array$fromList(_List_Nil),
		boundary: $author$project$Modules$Boundary$normalInit,
		bricks: $elm$core$Array$fromList(
			$elm$core$List$concat(
				_List_fromArray(
					[
						A3($author$project$Modules$Brick$initRow, 10, 1, 5),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(13, 10)),
							_Utils_Tuple2(40 * 40, 10 * 40),
							'#00000050')
						]),
						A3($author$project$Modules$Brick$initRow, 40, 1, 70),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(3, 37)),
							_Utils_Tuple2(40, 40),
							'#FFFF00')
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Brick$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(3, 36)),
							$author$project$Modules$Brick$Wings,
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									3,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 1, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						]),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$NoticeBoard$boundary,
							_Utils_Tuple2(6, 2),
							_Utils_Tuple2(6, 4))
						]),
						function () {
						var tempBoard1 = A2(
							$author$project$Modules$NoticeBoard$boundary,
							_Utils_Tuple2(5.8, 32),
							_Utils_Tuple2(6.2, 2.2));
						return _List_fromArray(
							[
								_Utils_update(
								tempBoard1,
								{
									visibility: $author$project$GlobalFunction$GlobalModule$Invisible(
										A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, 2, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))
								})
							]);
					}(),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(56, 37)),
							_Utils_Tuple2(40, 40),
							'#FFFF00')
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(58, 37)),
							_Utils_Tuple2(40, 40),
							'#FFFF00')
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Brick$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(56, 36)),
							$author$project$Modules$Brick$Pill('#1E90FF'),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									4,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 6, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
							A4(
								$author$project$GlobalFunction$GlobalModule$Move,
								$elm$core$Array$fromList(_List_Nil),
								5.0,
								11,
								A4(
									$author$project$GlobalFunction$GlobalModule$Move,
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
												_Utils_Tuple2(66, 39))
											])),
									5.0,
									-1,
									$author$project$GlobalFunction$GlobalModule$NoNextMove)))
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Brick$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(58, 36)),
							$author$project$Modules$Brick$Pill('#FF0000'),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									5,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 7, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
							A4(
								$author$project$GlobalFunction$GlobalModule$Move,
								$elm$core$Array$fromList(_List_Nil),
								5.0,
								12,
								A4(
									$author$project$GlobalFunction$GlobalModule$Move,
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
												_Utils_Tuple2(66, 39))
											])),
									5.0,
									-1,
									$author$project$GlobalFunction$GlobalModule$NoNextMove)))
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Brick$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(66, 39)),
							$author$project$Modules$Brick$Pill('\t#3CB371'),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									14,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 15, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						]),
						A3($author$project$Modules$Brick$initRow, 10, 63, 70),
						A3($author$project$Modules$Brick$initRow, 11, 63, 70)
					]))),
		endPoint: $author$project$Modules$EndPoint$init(
			$author$project$GlobalFunction$GlobalBasics$blockPos(
				_Utils_Tuple2(69, 9))),
		event: $elm$core$Array$fromList(
			_List_fromArray(
				[
					A5(
					$author$project$Modules$Event$hitBlockAfter,
					1,
					'wings',
					_Utils_Tuple2(3, 36),
					_Utils_Tuple2(1, 1),
					3),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					2,
					'first needle',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(5, 39.9)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(47, 39.9))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					3,
					'first ?',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(3.05, 38.01)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(3.95, 38.01))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					4,
					'second ?',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(56.05, 38.01)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(56.95, 38.01))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					5,
					'third ?',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(58.05, 38.01)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(58.95, 38.01))),
					A5(
					$author$project$Modules$Event$hitBlockAfter,
					6,
					'get blue',
					_Utils_Tuple2(56, 36),
					_Utils_Tuple2(1, 1),
					4),
					A5(
					$author$project$Modules$Event$hitBlockAfter,
					7,
					'get red',
					_Utils_Tuple2(58, 36),
					_Utils_Tuple2(1, 1),
					5),
					A5(
					$author$project$Modules$Event$hitLineSegAfter,
					8,
					'hit red then blue',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(56.05, 38.01)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(56.95, 38.01)),
					5),
					A5(
					$author$project$Modules$Event$hitLineSegAfter,
					8,
					'hit blue then red',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(58.05, 38.01)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(58.95, 38.01)),
					4),
					A5(
					$author$project$Modules$Event$hitLineSegAfter,
					9,
					'hit blue then land',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(1, 39.9)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(70, 39.9)),
					8),
					A5(
					$author$project$Modules$Event$hitLineSegAfter,
					10,
					'hit red then land',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(1, 39.9)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(70, 39.9)),
					8),
					A5(
					$author$project$Modules$Event$hitLineSegAfter,
					11,
					'second ? again',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(56.05, 38.01)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(56.95, 38.01)),
					9),
					A5(
					$author$project$Modules$Event$hitLineSegAfter,
					12,
					'third ? again',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(58.05, 38.01)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(58.95, 38.01)),
					10),
					A5(
					$author$project$Modules$Event$hitLineSegAfter,
					13,
					'hit again red then blue',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(56.05, 38.01)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(56.95, 38.01)),
					12),
					A5(
					$author$project$Modules$Event$hitLineSegAfter,
					13,
					'hit again blue then red',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(58.05, 38.01)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(58.95, 38.01)),
					11),
					A4(
					$author$project$Modules$Event$init,
					{id: 14, name: 'blue-red mix'},
					$author$project$Modules$Event$AfterActEvent(13),
					$author$project$Modules$Event$TimeAfterStart(100),
					$author$project$Modules$Event$quickDuration(10)),
					A5(
					$author$project$Modules$Event$hitBlockAfter,
					15,
					'get green',
					_Utils_Tuple2(66, 39),
					_Utils_Tuple2(1, 1),
					14),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					16,
					'second needle',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(53, 11)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(63, 11))),
					A4(
					$author$project$Modules$Event$hitLineSeg,
					17,
					'jump down',
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(6, 11.1)),
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(12, 11.1)))
				])),
		gameControl: A2(
			$author$project$Modules$GameControl$init,
			$author$project$MainFunction$MainType$Level6,
			_List_fromArray(
				[
					_List_fromArray(
					['Hit the first\"?\"', 'to get the wings']),
					_List_fromArray(
					['Hit the last two \"?\" again', 'to mix blue with red'])
				])),
		keyPressed: _List_Nil,
		levelBoundary: _Utils_Tuple2(70 * 40, 40 * 40.0),
		mainScene: $author$project$MainFunction$MainType$Level5,
		needles: $elm$core$Array$fromList(
			$elm$core$List$concat(
				_List_fromArray(
					[
						A2(
						$elm$core$List$map,
						function (i) {
							return A3(
								$author$project$Modules$Needle$initHiddenCollideAfter,
								_Utils_Tuple2(i, 10),
								17,
								$author$project$Modules$Needle$Laser);
						},
						A2($elm$core$List$range, 6, 12)),
						A5($author$project$Modules$Needle$initHiddenRow, 39.9, 5, 46, 2, $author$project$Modules$Needle$Upwards),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(20, 20),
							_Utils_Tuple2(2, 7)),
							A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(20, 32),
							_Utils_Tuple2(2, 8))
						]),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(26, 20),
							_Utils_Tuple2(2, 4)),
							A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(26, 29),
							_Utils_Tuple2(2, 11))
						]),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(32, 20),
							_Utils_Tuple2(2, 5)),
							A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(32, 30),
							_Utils_Tuple2(2, 10))
						]),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(38, 20),
							_Utils_Tuple2(2, 7)),
							A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(38, 32),
							_Utils_Tuple2(2, 8))
						]),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(44, 20),
							_Utils_Tuple2(2, 9)),
							A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(44, 34),
							_Utils_Tuple2(2, 6))
						]),
						function () {
						var tempNeedle = A2(
							$author$project$Modules$Needle$deadlyBlock,
							_Utils_Tuple2(53, 10.5),
							_Utils_Tuple2(10, 1));
						return _List_fromArray(
							[
								_Utils_update(
								tempNeedle,
								{
									collision: $author$project$GlobalFunction$GlobalModule$Collide(
										A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 15, $author$project$GlobalFunction$GlobalModule$NoNextCollision))
								})
							]);
					}()
					]))),
		noticeBoards: $elm$core$Array$fromList(
			_List_fromArray(
				[
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(3.5, 37.8)),
					'?',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(9, 3.8)),
					'Do not',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(9, 4.8)),
					'jump down',
					40),
					function () {
					var tempNotice1 = A3(
						$author$project$Modules$NoticeBoard$quickInit,
						$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
							_Utils_Tuple2(9, 33.2)),
						'As I said ^_^',
						40);
					return _Utils_update(
						tempNotice1,
						{
							noticeBoardVisibility: $author$project$Modules$NoticeBoard$Invisible(
								A3($author$project$Modules$NoticeBoard$VisibleAfterEvent, 2, 'As I said ^_^', $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility))
						});
				}(),
					function () {
					var tempNotice2 = A3(
						$author$project$Modules$NoticeBoard$quickInit,
						$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
							_Utils_Tuple2(5, 33)),
						'',
						40);
					return _Utils_update(
						tempNotice2,
						{
							noticeBoardVisibility: $author$project$Modules$NoticeBoard$Invisible(
								A3($author$project$Modules$NoticeBoard$VisibleAfterEvent, 1, 'If I were a bird...', $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility))
						});
				}(),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(56.5, 37.8)),
					'?',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(58.5, 37.8)),
					'?',
					40),
					function () {
					var tempNotice3 = A3(
						$author$project$Modules$NoticeBoard$quickInit,
						$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
							_Utils_Tuple2(58, 33)),
						'',
						40);
					return _Utils_update(
						tempNotice3,
						{
							noticeBoardVisibility: $author$project$Modules$NoticeBoard$Invisible(
								A3(
									$author$project$Modules$NoticeBoard$VisibleAfterEvent,
									8,
									'Blue Pill or Red Pill?',
									A3($author$project$Modules$NoticeBoard$VisibleAfterEvent, 15, 'Green protects you', $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility)))
						});
				}()
				])),
		number: _List_Nil,
		player: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50, 290.0),
			$author$project$Modules$Player$defPlayerProperty,
			A3(
				$author$project$Modules$Player$ChangeTo,
				newProperty,
				1,
				A3($author$project$Modules$Player$ChangeTo, newnewProperty, 15, $author$project$Modules$Player$NoNextPropertyChange))),
		playerAtLastSavePoint: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50, 290.0),
			$author$project$Modules$Player$defPlayerProperty,
			A3(
				$author$project$Modules$Player$ChangeTo,
				newProperty,
				1,
				A3($author$project$Modules$Player$ChangeTo, newnewProperty, 15, $author$project$Modules$Player$NoNextPropertyChange))),
		savePoints: $elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(2, 9))),
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(53, 39)))
				])),
		sound: $author$project$Modules$Sound$init(
			_List_fromArray(
				[
					A2($author$project$Modules$Sound$Event, 3, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 4, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 5, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 11, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 12, $author$project$Modules$Sound$RandomBox)
				])),
		windowBoundary: _Utils_Tuple2(1000.0, 800.0)
	};
	return _Utils_Tuple2(
		newModel,
		A2($elm$core$Task$perform, $author$project$MainFunction$MainType$GetViewport, $elm$browser$Browser$Dom$getViewport));
};
var $author$project$Modules$Needle$initPos = F2(
	function (_v0, needleType) {
		var x = _v0.a;
		var y = _v0.b;
		return {
			appearance: A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType),
			collision: $author$project$GlobalFunction$GlobalModule$Collide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
			collisionBox: $author$project$Modules$Needle$needleCollisionBox(
				A3($author$project$Modules$Needle$NormalNeedle, $author$project$Modules$Needle$normalNeedleWidth, $author$project$Modules$Needle$normalNeedleHeight, needleType)),
			move: $author$project$GlobalFunction$GlobalModule$NoNextMove,
			pos: _Utils_Tuple2(x, y),
			visibility: $author$project$GlobalFunction$GlobalModule$Visible($author$project$GlobalFunction$GlobalModule$NoNextVisibility)
		};
	});
var $author$project$Level6$Level6Init$init = function (a) {
	var newModel = {
		actEvent: $elm$core$Array$fromList(_List_Nil),
		boundary: $author$project$Modules$Boundary$normalInit,
		bricks: $elm$core$Array$fromList(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(1, 13)),
							_Utils_Tuple2(120, 120),
							'#3834ED')
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(5.5, 6)),
							_Utils_Tuple2(80, 80),
							'#00000050')
						]),
						function () {
						var tempBrick1 = A2(
							$author$project$Modules$Brick$initFallingBrick,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(5.5, 12)),
							1);
						return _List_fromArray(
							[
								_Utils_update(
								tempBrick1,
								{
									appearance: A3($author$project$Modules$Brick$Detailed, 80, 80, '#3834ED'),
									collisionBox: $author$project$Modules$Brick$brickCollisionBox(
										A3($author$project$Modules$Brick$Detailed, 80, 80, '#3834ED'))
								})
							]);
					}(),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(8.5, 11)),
							_Utils_Tuple2(160, 80),
							'#3834ED')
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(8.5, 4)),
							_Utils_Tuple2(160, 80),
							'#3834ED')
						]),
						A3($author$project$Modules$Brick$initRow, 12, 15, 18),
						function () {
						var ship = A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(21, 10)),
							_Utils_Tuple2(120, 80),
							'#EE82EE');
						return _List_fromArray(
							[
								_Utils_update(
								ship,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0,
										5,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(21, 12))
													])),
											3,
											6,
											A4(
												$author$project$GlobalFunction$GlobalModule$Move,
												$elm$core$Array$fromList(
													_List_fromArray(
														[
															$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
															_Utils_Tuple2(25, 12))
														])),
												1.5,
												-1,
												$author$project$GlobalFunction$GlobalModule$NoNextMove)))
								})
							]);
					}(),
						A4($author$project$Modules$Brick$initFallingRow, 12, 28, 34, 10),
						A3($author$project$Modules$Brick$initRow, 12, 35, 39),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(40, 10)),
							_Utils_Tuple2(120, 320),
							'#00cdcd')
						]),
						function () {
						var base2 = A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(40.1, 9.8)),
							_Utils_Tuple2(32, 8),
							'#700000');
						return _List_fromArray(
							[
								_Utils_update(
								base2,
								{
									collision: $author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
									visibility: $author$project$GlobalFunction$GlobalModule$Invisible(
										A2(
											$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
											9,
											A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 30, $author$project$GlobalFunction$GlobalModule$NoNextVisibility)))
								})
							]);
					}(),
						function () {
						var base1 = A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(39.8, 11.1)),
							_Utils_Tuple2(8, 32),
							'#700000');
						return _List_fromArray(
							[
								_Utils_update(
								base1,
								{
									collision: $author$project$GlobalFunction$GlobalModule$NoCollide($author$project$GlobalFunction$GlobalModule$NoNextCollision),
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0.0,
										15,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(39.8, 11.1)),
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(39.8, 10.1))
													])),
											1.5,
											19,
											A4(
												$author$project$GlobalFunction$GlobalModule$Move,
												$elm$core$Array$fromList(
													_List_fromArray(
														[
															$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
															_Utils_Tuple2(39.8, 10.1)),
															$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
															_Utils_Tuple2(39.8, 11.1))
														])),
												1.5,
												-1,
												$author$project$GlobalFunction$GlobalModule$NoNextMove))),
									visibility: $author$project$GlobalFunction$GlobalModule$Invisible(
										A2(
											$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
											9,
											A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 30, $author$project$GlobalFunction$GlobalModule$NoNextVisibility)))
								})
							]);
					}(),
						_List_fromArray(
						[
							$author$project$Modules$Brick$initPos(
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(25, 9.5)))
						]),
						_List_fromArray(
						[
							$author$project$Modules$Brick$initPos(
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(27, 9.5)))
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(26, 9.5)),
							_Utils_Tuple2(40, 40),
							'#FFFF00')
						]),
						function () {
						var base0 = A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(26.1, 9.3)),
							_Utils_Tuple2(32, 8),
							'#700000');
						return _List_fromArray(
							[
								_Utils_update(
								base0,
								{
									collision: $author$project$GlobalFunction$GlobalModule$Collide(
										A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 34, $author$project$GlobalFunction$GlobalModule$NoNextCollision)),
									visibility: $author$project$GlobalFunction$GlobalModule$Visible(
										A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 34, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))
								})
							]);
					}(),
						function () {
						var hidden = A2(
							$author$project$Modules$Brick$initCollideHidden,
							_Utils_Tuple2(28, 8.5),
							35);
						return _List_fromArray(
							[
								_Utils_update(
								hidden,
								{
									appearance: A3($author$project$Modules$Brick$Detailed, 80, 80, '#00000050'),
									collisionBox: $author$project$Modules$Brick$brickCollisionBox(
										A3($author$project$Modules$Brick$Detailed, 80, 80, '#00000050'))
								})
							]);
					}(),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(48, 13)),
							_Utils_Tuple2(320, 200),
							'#cd00cd')
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(50, 10)),
							_Utils_Tuple2(40, 40),
							'#FFFF00')
						]),
						function () {
						var laser3 = A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(52.1, 4.8)),
							_Utils_Tuple2(32, 8),
							'#700000');
						return _List_fromArray(
							[
								_Utils_update(
								laser3,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0.0,
										62,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(72.3, 4.8))
													])),
											1.5,
											-1,
											$author$project$GlobalFunction$GlobalModule$NoNextMove))
								})
							]);
					}(),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(60, 13)),
							_Utils_Tuple2(520, 200),
							'#cd00cd')
						]),
						A4($author$project$Modules$Brick$initCollideHiddenRow, 10, 55, 56, 52),
						function () {
						var magic2 = A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(63.3, 10)),
							_Utils_Tuple2(40, 40),
							'#FFFF00');
						return _List_fromArray(
							[
								_Utils_update(
								magic2,
								{
									collision: $author$project$GlobalFunction$GlobalModule$Collide(
										A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 57, $author$project$GlobalFunction$GlobalModule$NoNextCollision)),
									visibility: $author$project$GlobalFunction$GlobalModule$Visible(
										A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 57, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))
								})
							]);
					}(),
						function () {
						var laser0 = A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(66.1, 4.8)),
							_Utils_Tuple2(32, 8),
							'#700000');
						return _List_fromArray(
							[
								_Utils_update(
								laser0,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0.0,
										58,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(20, 4.8))
													])),
											2,
											-1,
											$author$project$GlobalFunction$GlobalModule$NoNextMove)),
									visibility: $author$project$GlobalFunction$GlobalModule$Visible(
										A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 61, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))
								})
							]);
					}(),
						function () {
						var laser1a = A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(69.1, 7.8)),
							_Utils_Tuple2(32, 8),
							'#700000');
						return _List_fromArray(
							[
								_Utils_update(
								laser1a,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0.0,
										56,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(20, 7.8))
													])),
											5,
											-1,
											$author$project$GlobalFunction$GlobalModule$NoNextMove))
								})
							]);
					}(),
						function () {
						var laser2a = A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(69.1, 12.8)),
							_Utils_Tuple2(32, 8),
							'#700000');
						return _List_fromArray(
							[
								_Utils_update(
								laser2a,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0.0,
										56,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(20, 12.8))
													])),
											5,
											-1,
											$author$project$GlobalFunction$GlobalModule$NoNextMove))
								})
							]);
					}(),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$Brick$initCollideHidden,
							_Utils_Tuple2(68, 12),
							64)
						]),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$Brick$initCollideHidden,
							_Utils_Tuple2(68, 11),
							64)
						]),
						function () {
						var ship2 = A3(
							$author$project$Modules$Brick$initPosVolumeColor,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(73, 13)),
							_Utils_Tuple2(120, 80),
							'#EE82EE');
						return _List_fromArray(
							[
								_Utils_update(
								ship2,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0,
										68,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(84, 13))
													])),
											1.2,
											-1,
											$author$project$GlobalFunction$GlobalModule$NoNextMove))
								})
							]);
					}()
					]))),
		endPoint: $author$project$Modules$EndPoint$init(
			$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
				_Utils_Tuple2(85, 12))),
		event: $elm$core$Array$fromList(
			_List_fromArray(
				[
					A4(
					$author$project$Modules$Event$hitBlock,
					1,
					'A',
					_Utils_Tuple2(5.5, 12),
					_Utils_Tuple2(2, 2)),
					A4(
					$author$project$Modules$Event$hitBlock,
					2,
					'B',
					_Utils_Tuple2(11.5, 10),
					_Utils_Tuple2(1, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					3,
					'C',
					_Utils_Tuple2(8.5, 4),
					_Utils_Tuple2(1, 10)),
					A4(
					$author$project$Modules$Event$hitBlock,
					31,
					'D',
					_Utils_Tuple2(9.5, 4),
					_Utils_Tuple2(1, 10)),
					A4(
					$author$project$Modules$Event$hitBlock,
					4,
					'ship1',
					_Utils_Tuple2(21, 10),
					_Utils_Tuple2(3, 2)),
					A4(
					$author$project$Modules$Event$init,
					{id: 5, name: 'ship2'},
					$author$project$Modules$Event$AfterActEvent(4),
					$author$project$Modules$Event$TimeAfterStart(200),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 6, name: 'ship3'},
					$author$project$Modules$Event$AfterActEvent(5),
					$author$project$Modules$Event$TimeAfterStart(100),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$hitBlock,
					7,
					'needle',
					_Utils_Tuple2(26.2, 5.5),
					_Utils_Tuple2(0.6, 4.8)),
					A4(
					$author$project$Modules$Event$hitBlock,
					9,
					'finaltrap',
					_Utils_Tuple2(36, 6),
					_Utils_Tuple2(1, 7)),
					A4(
					$author$project$Modules$Event$init,
					{id: 10, name: 'Falling'},
					$author$project$Modules$Event$AfterActEvent(9),
					$author$project$Modules$Event$PlayerCollide(
						$author$project$GlobalFunction$GlobalBasics$Polygon(
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										_Utils_Tuple2(
										$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
											_Utils_Tuple2(28, 12)),
										$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
											_Utils_Tuple2(34.5, 12)))
									])))),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 11, name: 'a1'},
					$author$project$Modules$Event$AfterActEvent(9),
					$author$project$Modules$Event$TimeAfterStart(180),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 12, name: 'a2'},
					$author$project$Modules$Event$AfterActEvent(11),
					$author$project$Modules$Event$TimeAfterStart(1),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 13, name: 'a3'},
					$author$project$Modules$Event$AfterActEvent(12),
					$author$project$Modules$Event$TimeAfterStart(30),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 14, name: 'ship2'},
					$author$project$Modules$Event$AfterActEvent(4),
					$author$project$Modules$Event$TimeAfterStart(120),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 15, name: 'b1'},
					$author$project$Modules$Event$AfterActEvent(13),
					$author$project$Modules$Event$TimeAfterStart(150),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 16, name: 'b2'},
					$author$project$Modules$Event$AfterActEvent(15),
					$author$project$Modules$Event$TimeAfterStart(50),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 17, name: 'b3'},
					$author$project$Modules$Event$AfterActEvent(16),
					$author$project$Modules$Event$TimeAfterStart(1),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 18, name: 'b4'},
					$author$project$Modules$Event$AfterActEvent(17),
					$author$project$Modules$Event$TimeAfterStart(150),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 19, name: 'c1'},
					$author$project$Modules$Event$AfterActEvent(18),
					$author$project$Modules$Event$TimeAfterStart(100),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 20, name: 'c2'},
					$author$project$Modules$Event$AfterActEvent(19),
					$author$project$Modules$Event$TimeAfterStart(1),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 21, name: 'c3'},
					$author$project$Modules$Event$AfterActEvent(20),
					$author$project$Modules$Event$TimeAfterStart(30),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 22, name: 'hint1'},
					$author$project$Modules$Event$AfterActEvent(9),
					$author$project$Modules$Event$TimeAfterStart(100),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 23, name: 'hint1'},
					$author$project$Modules$Event$AfterActEvent(9),
					$author$project$Modules$Event$TimeAfterStart(130),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 24, name: 'hint2'},
					$author$project$Modules$Event$AfterActEvent(13),
					$author$project$Modules$Event$TimeAfterStart(70),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 25, name: 'hint2'},
					$author$project$Modules$Event$AfterActEvent(13),
					$author$project$Modules$Event$TimeAfterStart(100),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 26, name: 'hint3'},
					$author$project$Modules$Event$AfterActEvent(18),
					$author$project$Modules$Event$TimeAfterStart(20),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 27, name: 'hint3'},
					$author$project$Modules$Event$AfterActEvent(18),
					$author$project$Modules$Event$TimeAfterStart(50),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 30, name: 'finish'},
					$author$project$Modules$Event$AfterActEvent(21),
					$author$project$Modules$Event$TimeAfterStart(50),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 32, name: 'ship4'},
					$author$project$Modules$Event$AfterActEvent(6),
					$author$project$Modules$Event$TimeAfterStart(110),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 33, name: 'ship5'},
					$author$project$Modules$Event$AfterActEvent(32),
					$author$project$Modules$Event$TimeAfterStart(2),
					$author$project$Modules$Event$quickDuration(10)),
					function () {
					var temp = A4(
						$author$project$Modules$Event$hitLineSeg,
						34,
						'g',
						$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
							_Utils_Tuple2(26, 10.5)),
						$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
							_Utils_Tuple2(27, 10.5)));
					return _Utils_update(
						temp,
						{
							duration: $author$project$Modules$Event$quickDuration(10)
						});
				}(),
					A4(
					$author$project$Modules$Event$hitBlock,
					35,
					'hidden',
					_Utils_Tuple2(28, 8.5),
					_Utils_Tuple2(2, 2)),
					A4(
					$author$project$Modules$Event$hitBlock,
					36,
					'sword',
					_Utils_Tuple2(28.2, 11),
					_Utils_Tuple2(1, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					51,
					'magicbox',
					_Utils_Tuple2(50, 9.9),
					_Utils_Tuple2(1, 1.2)),
					A4(
					$author$project$Modules$Event$hitBlock,
					52,
					'hidden',
					_Utils_Tuple2(55, 10),
					_Utils_Tuple2(2, 1)),
					A4(
					$author$project$Modules$Event$hitBlock,
					53,
					'sword',
					_Utils_Tuple2(56.8, 5),
					_Utils_Tuple2(2, 5)),
					A4(
					$author$project$Modules$Event$hitBlock,
					54,
					'hiddenlaser',
					_Utils_Tuple2(69.3, 8),
					_Utils_Tuple2(0.4, 5)),
					A4(
					$author$project$Modules$Event$hitBlock,
					55,
					'magicbox2',
					_Utils_Tuple2(63.3, 10),
					_Utils_Tuple2(1, 1)),
					A4(
					$author$project$Modules$Event$init,
					{id: 56, name: 'laser1'},
					$author$project$Modules$Event$AfterActEvent(55),
					$author$project$Modules$Event$TimeAfterStart(40),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 57, name: 'disappear1'},
					$author$project$Modules$Event$AfterActEvent(56),
					$author$project$Modules$Event$TimeAfterStart(41),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 58, name: 'laser2'},
					$author$project$Modules$Event$AfterActEvent(57),
					$author$project$Modules$Event$TimeAfterStart(120),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 59, name: 'change1'},
					$author$project$Modules$Event$AfterActEvent(58),
					$author$project$Modules$Event$TimeAfterStart(188),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 60, name: 'change2'},
					$author$project$Modules$Event$AfterActEvent(59),
					$author$project$Modules$Event$TimeAfterStart(44),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 61, name: 'change3'},
					$author$project$Modules$Event$AfterActEvent(59),
					$author$project$Modules$Event$TimeAfterStart(92),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 62, name: 'start'},
					$author$project$Modules$Event$AfterActEvent(61),
					$author$project$Modules$Event$TimeAfterStart(120),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 63, name: 'falling'},
					$author$project$Modules$Event$AfterActEvent(61),
					$author$project$Modules$Event$PlayerCollide(
						$author$project$GlobalFunction$GlobalBasics$Polygon(
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										_Utils_Tuple2(
										$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
											_Utils_Tuple2(61, 5)),
										$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
											_Utils_Tuple2(61, 15)))
									])))),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 64, name: 'hidden'},
					$author$project$Modules$Event$AfterActEvent(62),
					$author$project$Modules$Event$PlayerCollide(
						$author$project$GlobalFunction$GlobalBasics$Polygon(
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										_Utils_Tuple2(
										$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
											_Utils_Tuple2(68, 7)),
										$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
											_Utils_Tuple2(68, 13)))
									])))),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 65, name: 'hint'},
					$author$project$Modules$Event$AfterActEvent(62),
					$author$project$Modules$Event$PlayerCollide(
						$author$project$GlobalFunction$GlobalBasics$Polygon(
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										_Utils_Tuple2(
										$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
											_Utils_Tuple2(64, 7)),
										$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
											_Utils_Tuple2(64, 13)))
									])))),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 66, name: 'hint2'},
					$author$project$Modules$Event$AfterActEvent(65),
					$author$project$Modules$Event$TimeAfterStart(50),
					$author$project$Modules$Event$quickDuration(10)),
					A4(
					$author$project$Modules$Event$init,
					{id: 68, name: 'ship2move'},
					$author$project$Modules$Event$AfterActEvent(62),
					$author$project$Modules$Event$TimeAfterStart(600),
					$author$project$Modules$Event$quickDuration(10))
				])),
		gameControl: A2(
			$author$project$Modules$GameControl$init,
			$author$project$MainFunction$MainType$Level1,
			_List_fromArray(
				[
					_List_fromArray(
					['At the beginning of the level, ', 'you can just rush to the right ', 'and ignore the two falling needles']),
					_List_fromArray(
					['Before the second savepoint, ', 'you have to dodge three attacks from ', 'the horizontal laser, jump ', 'before the first and the third attacks']),
					_List_fromArray(
					['In the final part, ', ' jump onto the inverse magic box ', 'and jump again to dodge the first laser']),
					_List_fromArray(
					['You can hide under the bricks ', 'to dodge the second laser'])
				])),
		keyPressed: _List_Nil,
		levelBoundary: _Utils_Tuple2(90 * 40, 680.0),
		mainScene: $author$project$MainFunction$MainType$Level6,
		needles: $elm$core$Array$fromList(
			$elm$core$List$concat(
				_List_fromArray(
					[
						function () {
						var needle0 = A3(
							$author$project$Modules$Needle$initFalling,
							_Utils_Tuple2(9, 6),
							3,
							$author$project$Modules$Needle$Downwards);
						return _List_fromArray(
							[
								_Utils_update(
								needle0,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0.0,
										3,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(8.5, 25))
													])),
											1.8,
											-1,
											$author$project$GlobalFunction$GlobalModule$NoNextMove)),
									pos: $author$project$GlobalFunction$GlobalBasics$blockPosFloat(
										_Utils_Tuple2(8.5, 6))
								})
							]);
					}(),
						function () {
						var needle1 = A3(
							$author$project$Modules$Needle$initFalling,
							_Utils_Tuple2(9, 6),
							31,
							$author$project$Modules$Needle$Downwards);
						return _List_fromArray(
							[
								_Utils_update(
								needle1,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0.0,
										31,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(9.5, 25))
													])),
											1.8,
											-1,
											$author$project$GlobalFunction$GlobalModule$NoNextMove)),
									pos: $author$project$GlobalFunction$GlobalBasics$blockPosFloat(
										_Utils_Tuple2(9.5, 6))
								})
							]);
					}(),
						_List_fromArray(
						[
							A2(
							$author$project$Modules$Needle$initPos,
							_Utils_Tuple2(181, 280),
							$author$project$Modules$Needle$Downwards),
							A2(
							$author$project$Modules$Needle$initPos,
							_Utils_Tuple2(221, 280),
							$author$project$Modules$Needle$Downwards)
						]),
						function () {
						var tempNeedle1 = A2(
							$author$project$Modules$Needle$initPos,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(10.5, 10.9)),
							$author$project$Modules$Needle$Upwards);
						return _List_fromArray(
							[
								_Utils_update(
								tempNeedle1,
								{
									move: A4(
										$author$project$GlobalFunction$GlobalModule$Move,
										$elm$core$Array$fromList(_List_Nil),
										0.0,
										2,
										A4(
											$author$project$GlobalFunction$GlobalModule$Move,
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(10.5, 10.9)),
														$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
														_Utils_Tuple2(11.5, 10.9))
													])),
											2.0,
											-1,
											$author$project$GlobalFunction$GlobalModule$NoNextMove))
								})
							]);
					}(),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(22, 11.35)),
							A3($author$project$Modules$Needle$NormalNeedle, 711, 12, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									11,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 13, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2(
									$author$project$GlobalFunction$GlobalModule$CollideAfterEvent,
									12,
									A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 13, $author$project$GlobalFunction$GlobalModule$NoNextCollision))),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(40, 1)),
							A3($author$project$Modules$Needle$NormalNeedle, 40, 351, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									9,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 30, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2(
									$author$project$GlobalFunction$GlobalModule$CollideAfterEvent,
									9,
									A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 30, $author$project$GlobalFunction$GlobalModule$NoNextCollision))),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(22, 10.35)),
							A3($author$project$Modules$Needle$NormalNeedle, 711, 12, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									16,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 18, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2(
									$author$project$GlobalFunction$GlobalModule$CollideAfterEvent,
									17,
									A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 18, $author$project$GlobalFunction$GlobalModule$NoNextCollision))),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(22, 10.35)),
							A3($author$project$Modules$Needle$NormalNeedle, 711, 12, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									19,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 21, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2(
									$author$project$GlobalFunction$GlobalModule$CollideAfterEvent,
									20,
									A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 21, $author$project$GlobalFunction$GlobalModule$NoNextCollision))),
							A4(
								$author$project$GlobalFunction$GlobalModule$Move,
								$elm$core$Array$fromList(_List_Nil),
								0.0,
								19,
								A4(
									$author$project$GlobalFunction$GlobalModule$Move,
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
												_Utils_Tuple2(22, 10.35)),
												$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
												_Utils_Tuple2(22, 11.35))
											])),
									1.5,
									-1,
									$author$project$GlobalFunction$GlobalModule$NoNextMove)))
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(26.35, 0.5)),
							A3($author$project$Modules$Needle$NormalNeedle, 12, 351, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									7,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 34, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2(
									$author$project$GlobalFunction$GlobalModule$CollideAfterEvent,
									7,
									A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 34, $author$project$GlobalFunction$GlobalModule$NoNextCollision))),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						]),
						_List_fromArray(
						[
							A6(
							$author$project$Modules$Needle$sword,
							_Utils_Tuple2(55, 10.5),
							_Utils_Tuple2(19, 10.5),
							_Utils_Tuple2(4, 2),
							20,
							36,
							$author$project$Modules$Needle$BombLeft)
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Needle$initHidden,
							_Utils_Tuple2(50, 11),
							51,
							$author$project$Modules$Needle$Downwards)
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Needle$initHidden,
							_Utils_Tuple2(50, 10),
							51,
							$author$project$Modules$Needle$Downwards)
						]),
						_List_fromArray(
						[
							A6(
							$author$project$Modules$Needle$sword,
							_Utils_Tuple2(57, 20),
							_Utils_Tuple2(57, -4),
							_Utils_Tuple2(2, 3),
							12,
							53,
							$author$project$Modules$Needle$BombUp)
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(69.35, 8)),
							A3($author$project$Modules$Needle$NormalNeedle, 12, 191, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									54,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 55, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2(
									$author$project$GlobalFunction$GlobalModule$CollideAfterEvent,
									54,
									A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 55, $author$project$GlobalFunction$GlobalModule$NoNextCollision))),
							$author$project$GlobalFunction$GlobalModule$NoNextMove)
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(69.35, 8)),
							A3($author$project$Modules$Needle$NormalNeedle, 12, 191, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, 55, $author$project$GlobalFunction$GlobalModule$NoNextVisibility)),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2($author$project$GlobalFunction$GlobalModule$CollideAfterEvent, 55, $author$project$GlobalFunction$GlobalModule$NoNextCollision)),
							A4(
								$author$project$GlobalFunction$GlobalModule$Move,
								$elm$core$Array$fromList(_List_Nil),
								0.0,
								56,
								A4(
									$author$project$GlobalFunction$GlobalModule$Move,
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$GlobalFunction$GlobalBasics$blockPos(
												_Utils_Tuple2(20, 8))
											])),
									5,
									-1,
									$author$project$GlobalFunction$GlobalModule$NoNextMove)))
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(66.4, 5)),
							A3($author$project$Modules$Needle$NormalNeedle, 8, 320, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									55,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 59, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2(
									$author$project$GlobalFunction$GlobalModule$CollideAfterEvent,
									55,
									A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 59, $author$project$GlobalFunction$GlobalModule$NoNextCollision))),
							A4(
								$author$project$GlobalFunction$GlobalModule$Move,
								$elm$core$Array$fromList(_List_Nil),
								0.0,
								58,
								A4(
									$author$project$GlobalFunction$GlobalModule$Move,
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$GlobalFunction$GlobalBasics$blockPos(
												_Utils_Tuple2(20, 5))
											])),
									2,
									-1,
									$author$project$GlobalFunction$GlobalModule$NoNextMove)))
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(66.4, 5)),
							A3($author$project$Modules$Needle$NormalNeedle, 8, 200, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									59,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 60, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2(
									$author$project$GlobalFunction$GlobalModule$CollideAfterEvent,
									59,
									A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 60, $author$project$GlobalFunction$GlobalModule$NoNextCollision))),
							A4(
								$author$project$GlobalFunction$GlobalModule$Move,
								$elm$core$Array$fromList(_List_Nil),
								0.0,
								58,
								A4(
									$author$project$GlobalFunction$GlobalModule$Move,
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$GlobalFunction$GlobalBasics$blockPos(
												_Utils_Tuple2(20, 5))
											])),
									2,
									-1,
									$author$project$GlobalFunction$GlobalModule$NoNextMove)))
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(66.4, 5)),
							A3($author$project$Modules$Needle$NormalNeedle, 8, 320, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2(
									$author$project$GlobalFunction$GlobalModule$VisibleAfterEvent,
									60,
									A2($author$project$GlobalFunction$GlobalModule$InvisibleAfterEvent, 61, $author$project$GlobalFunction$GlobalModule$NoNextVisibility))),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2(
									$author$project$GlobalFunction$GlobalModule$CollideAfterEvent,
									60,
									A2($author$project$GlobalFunction$GlobalModule$NoCollideAfterEvent, 61, $author$project$GlobalFunction$GlobalModule$NoNextCollision))),
							A4(
								$author$project$GlobalFunction$GlobalModule$Move,
								$elm$core$Array$fromList(_List_Nil),
								0.0,
								58,
								A4(
									$author$project$GlobalFunction$GlobalModule$Move,
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$GlobalFunction$GlobalBasics$blockPos(
												_Utils_Tuple2(20, 5))
											])),
									2,
									-1,
									$author$project$GlobalFunction$GlobalModule$NoNextMove)))
						]),
						_List_fromArray(
						[
							A5(
							$author$project$Modules$Needle$init,
							$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
								_Utils_Tuple2(52.2, 5.025)),
							A3($author$project$Modules$Needle$NormalNeedle, 24, 318, $author$project$Modules$Needle$Laser),
							$author$project$GlobalFunction$GlobalModule$Invisible(
								A2($author$project$GlobalFunction$GlobalModule$VisibleAfterEvent, 55, $author$project$GlobalFunction$GlobalModule$NoNextVisibility)),
							$author$project$GlobalFunction$GlobalModule$NoCollide(
								A2($author$project$GlobalFunction$GlobalModule$CollideAfterEvent, 55, $author$project$GlobalFunction$GlobalModule$NoNextCollision)),
							A4(
								$author$project$GlobalFunction$GlobalModule$Move,
								$elm$core$Array$fromList(_List_Nil),
								0.0,
								62,
								A4(
									$author$project$GlobalFunction$GlobalModule$Move,
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
												_Utils_Tuple2(72.4, 5.025))
											])),
									1.5,
									-1,
									$author$project$GlobalFunction$GlobalModule$NoNextMove)))
						]),
						_List_fromArray(
						[
							A3(
							$author$project$Modules$Needle$initFalling,
							_Utils_Tuple2(62, 7),
							63,
							$author$project$Modules$Needle$Downwards)
						])
					]))),
		noticeBoards: $elm$core$Array$fromList(
			_List_fromArray(
				[
					A4(
					$author$project$Modules$NoticeBoard$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(38.8, 11.75)),
					$author$project$Modules$NoticeBoard$Invisible(
						A3(
							$author$project$Modules$NoticeBoard$VisibleAfterEvent,
							22,
							'!',
							A2($author$project$Modules$NoticeBoard$InvisibleAfterEvent, 23, $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility))),
					$author$project$GlobalFunction$GlobalModule$NoNextMove,
					60),
					A4(
					$author$project$Modules$NoticeBoard$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(38.8, 11.25)),
					$author$project$Modules$NoticeBoard$Invisible(
						A3(
							$author$project$Modules$NoticeBoard$VisibleAfterEvent,
							24,
							'!',
							A2($author$project$Modules$NoticeBoard$InvisibleAfterEvent, 25, $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility))),
					$author$project$GlobalFunction$GlobalModule$NoNextMove,
					60),
					A4(
					$author$project$Modules$NoticeBoard$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(38.8, 11.5)),
					$author$project$Modules$NoticeBoard$Invisible(
						A3(
							$author$project$Modules$NoticeBoard$VisibleAfterEvent,
							26,
							'!',
							A2($author$project$Modules$NoticeBoard$InvisibleAfterEvent, 27, $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility))),
					$author$project$GlobalFunction$GlobalModule$NoNextMove,
					60),
					A4(
					$author$project$Modules$NoticeBoard$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(22.5, 11)),
					$author$project$Modules$NoticeBoard$Invisible(
						A3(
							$author$project$Modules$NoticeBoard$VisibleAfterEvent,
							4,
							'Follow me ^_^',
							A2($author$project$Modules$NoticeBoard$InvisibleAfterEvent, 14, $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility))),
					$author$project$GlobalFunction$GlobalModule$NoNextMove,
					16),
					A4(
					$author$project$Modules$NoticeBoard$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(26.5, 13)),
					$author$project$Modules$NoticeBoard$Invisible(
						A3(
							$author$project$Modules$NoticeBoard$VisibleAfterEvent,
							32,
							'Jump',
							A2($author$project$Modules$NoticeBoard$InvisibleAfterEvent, 33, $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility))),
					$author$project$GlobalFunction$GlobalModule$NoNextMove,
					16),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(6.5, 7.4)),
					'↓',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(26.5, 10.35)),
					'?',
					40),
					A3(
					$author$project$Modules$NoticeBoard$quickInit,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(50.5, 10.85)),
					'?',
					40),
					A4(
					$author$project$Modules$NoticeBoard$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(63.8, 10.65)),
					A2(
						$author$project$Modules$NoticeBoard$Visible,
						'¿',
						A2($author$project$Modules$NoticeBoard$InvisibleAfterEvent, 57, $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility)),
					$author$project$GlobalFunction$GlobalModule$NoNextMove,
					40),
					A4(
					$author$project$Modules$NoticeBoard$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(74.5, 14)),
					A2(
						$author$project$Modules$NoticeBoard$Visible,
						'Come here!',
						A2($author$project$Modules$NoticeBoard$InvisibleAfterEvent, 68, $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility)),
					$author$project$GlobalFunction$GlobalModule$NoNextMove,
					16),
					A4(
					$author$project$Modules$NoticeBoard$init,
					$author$project$GlobalFunction$GlobalBasics$blockPosFloat(
						_Utils_Tuple2(68.5, 11.85)),
					$author$project$Modules$NoticeBoard$Invisible(
						A3(
							$author$project$Modules$NoticeBoard$VisibleAfterEvent,
							65,
							'!',
							A2($author$project$Modules$NoticeBoard$InvisibleAfterEvent, 66, $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility))),
					$author$project$GlobalFunction$GlobalModule$NoNextMove,
					60)
				])),
		player: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50.0, 440.0),
			$author$project$Modules$Player$defPlayerProperty,
			$author$project$Modules$Player$NoNextPropertyChange),
		playerAtLastSavePoint: A3(
			$author$project$Modules$Player$init,
			_Utils_Tuple2(50.0, 440.0),
			$author$project$Modules$Player$defPlayerProperty,
			$author$project$Modules$Player$NoNextPropertyChange),
		savePoints: $elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(2, 12))),
					$author$project$Modules$SavePoint$init(
					$author$project$GlobalFunction$GlobalBasics$blockPos(
						_Utils_Tuple2(41, 9)))
				])),
		sound: $author$project$Modules$Sound$init(
			_List_fromArray(
				[
					A2($author$project$Modules$Sound$Event, 34, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 55, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 36, $author$project$Modules$Sound$Sword),
					A2($author$project$Modules$Sound$Event, 53, $author$project$Modules$Sound$Sword),
					A2($author$project$Modules$Sound$Event, 35, $author$project$Modules$Sound$RandomBox),
					A2($author$project$Modules$Sound$Event, 52, $author$project$Modules$Sound$RandomBox)
				])),
		windowBoundary: _Utils_Tuple2(1000.0, 800.0)
	};
	return _Utils_Tuple2(
		newModel,
		A2($elm$core$Task$perform, $author$project$MainFunction$MainType$GetViewport, $elm$browser$Browser$Dom$getViewport));
};
var $author$project$Menu$MenuType$MainMenu = {$: 'MainMenu'};
var $author$project$Menu$MenuInit$init = function (_v0) {
	return _Utils_Tuple2(
		{
			buttonState: $elm$core$Array$fromList(
				A2(
					$elm$core$List$map,
					function (_v1) {
						return $author$project$MainFunction$MainConstant$buttonNormalColor;
					},
					A2($elm$core$List$range, 0, 100))),
			keyPressed: _List_Nil,
			mainStatus: $author$project$MainFunction$MainType$Menu,
			menuStatus: $author$project$Menu$MenuType$MainMenu,
			windowBoundary: _Utils_Tuple2(1000.0, 800.0)
		},
		A2($elm$core$Task$perform, $author$project$MainFunction$MainType$GetViewport, $elm$browser$Browser$Dom$getViewport));
};
var $author$project$MainFunction$MainInit$init = function (a) {
	var mainModel = {
		level1Model: $author$project$Level1$Level1Init$init(_Utils_Tuple0).a,
		level2Model: $author$project$Level2$Level2Init$init(_Utils_Tuple0).a,
		level3Model: $author$project$Level3$Level3Init$init(_Utils_Tuple0).a,
		level4Model: $author$project$Level4$Level4Init$init(_Utils_Tuple0).a,
		level5Model: $author$project$Level5$Level5Init$init(_Utils_Tuple0).a,
		level6Model: $author$project$Level6$Level6Init$init(_Utils_Tuple0).a,
		mainScene: $author$project$MainFunction$MainType$Menu,
		menuModel: $author$project$Menu$MenuInit$init(_Utils_Tuple0).a
	};
	return _Utils_Tuple2(
		mainModel,
		A2($elm$core$Task$perform, $author$project$MainFunction$MainType$GetViewport, $elm$browser$Browser$Dom$getViewport));
};
var $author$project$MainFunction$MainType$Resize = F2(
	function (a, b) {
		return {$: 'Resize', a: a, b: b};
	});
var $author$project$MainFunction$MainType$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 'Nothing') {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.processes;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $author$project$MainFunction$MainType$KeyDown = function (a) {
	return {$: 'KeyDown', a: a};
};
var $author$project$MainFunction$MainSubscriptions$keyDown = function (keyCode) {
	return $author$project$MainFunction$MainType$KeyDown(keyCode);
};
var $author$project$MainFunction$MainType$KeyUp = function (a) {
	return {$: 'KeyUp', a: a};
};
var $author$project$MainFunction$MainSubscriptions$keyUp = function (keyCode) {
	return $author$project$MainFunction$MainType$KeyUp(keyCode);
};
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keydown');
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keyup');
var $elm$browser$Browser$Events$Window = {$: 'Window'};
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		$elm$browser$Browser$Events$Window,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$MainFunction$MainSubscriptions$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2($elm$time$Time$every, 8, $author$project$MainFunction$MainType$Tick),
				$elm$browser$Browser$Events$onKeyDown(
				A2($elm$json$Json$Decode$map, $author$project$MainFunction$MainSubscriptions$keyDown, $elm$html$Html$Events$keyCode)),
				$elm$browser$Browser$Events$onKeyUp(
				A2($elm$json$Json$Decode$map, $author$project$MainFunction$MainSubscriptions$keyUp, $elm$html$Html$Events$keyCode)),
				$elm$browser$Browser$Events$onResize($author$project$MainFunction$MainType$Resize)
			]));
};
var $author$project$MainFunction$MainUpdate$changeToLevel = F2(
	function (newScene, _v0) {
		var model = _v0.a;
		var cmd = _v0.b;
		var newModel = _Utils_update(
			model,
			{mainScene: newScene});
		switch (newScene.$) {
			case 'Level1':
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{
							level1Model: $author$project$Level1$Level1Init$init(_Utils_Tuple0).a
						}),
					cmd);
			case 'Level2':
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{
							level2Model: $author$project$Level2$Level2Init$init(_Utils_Tuple0).a
						}),
					cmd);
			case 'Level3':
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{
							level3Model: $author$project$Level3$Level3Init$init(_Utils_Tuple0).a
						}),
					cmd);
			case 'Level4':
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{
							level4Model: $author$project$Level4$Level4Init$init(_Utils_Tuple0).a
						}),
					cmd);
			case 'Level6':
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{
							level6Model: $author$project$Level6$Level6Init$init(_Utils_Tuple0).a
						}),
					cmd);
			case 'Level5':
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{
							level5Model: $author$project$Level5$Level5Init$init(_Utils_Tuple0).a
						}),
					cmd);
			default:
				return _Utils_Tuple2(newModel, cmd);
		}
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Modules$Player$Dead = {$: 'Dead'};
var $author$project$Modules$Event$ActEventAct = {$: 'ActEventAct'};
var $author$project$Modules$Player$StepOnNeedle = {$: 'StepOnNeedle'};
var $author$project$Modules$Event$ActEventNotAct = {$: 'ActEventNotAct'};
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $author$project$Modules$Event$sumActEventById = F3(
	function (id, actEvent, sum) {
		return _Utils_eq(actEvent.id, id) ? (sum + 1) : sum;
	});
var $author$project$Modules$Event$ifActEventById = F2(
	function (model, id) {
		return (!A3(
			$elm$core$Array$foldl,
			$author$project$Modules$Event$sumActEventById(id),
			0,
			model.actEvent)) ? $author$project$Modules$Event$ActEventNotAct : $author$project$Modules$Event$ActEventAct;
	});
var $author$project$Modules$Player$playerKill = F2(
	function (model, deadType) {
		var oldPlayer = model.player;
		var _v0 = model.player.deadTimes;
		var oldDeadTimes = _v0.a;
		var oldDeadType = _v0.b;
		var newPlayer = _Utils_update(
			oldPlayer,
			{
				deadTimes: _Utils_Tuple2(oldDeadTimes + 1, deadType),
				liveState: $author$project$Modules$Player$Dead
			});
		return _Utils_update(
			model,
			{player: newPlayer});
	});
var $author$project$Level1$Level1Update$checkPill = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	return _Utils_eq(
		A2($author$project$Modules$Event$ifActEventById, model, 13),
		$author$project$Modules$Event$ActEventAct) ? _Utils_Tuple2(
		A2($author$project$Modules$Player$playerKill, model, $author$project$Modules$Player$StepOnNeedle),
		cmd) : _Utils_Tuple2(model, cmd);
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Modules$Boundary$boundaryWidth = 2.0;
var $author$project$GlobalFunction$GlobalBasics$Collided = {$: 'Collided'};
var $author$project$GlobalFunction$GlobalBasics$NotCollided = {$: 'NotCollided'};
var $author$project$GlobalFunction$GlobalBasics$addPosPos = F2(
	function (p1, p2) {
		var _v0 = p2;
		var p2X = _v0.a;
		var p2Y = _v0.b;
		var _v1 = p1;
		var p1X = _v1.a;
		var p1Y = _v1.b;
		return _Utils_Tuple2(p1X + p2X, p1Y + p2Y);
	});
var $author$project$GlobalFunction$GlobalBasics$addLSPos = F2(
	function (ls, p) {
		var _v0 = ls;
		var p1 = _v0.a;
		var p2 = _v0.b;
		return _Utils_Tuple2(
			A2($author$project$GlobalFunction$GlobalBasics$addPosPos, p1, p),
			A2($author$project$GlobalFunction$GlobalBasics$addPosPos, p2, p));
	});
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $author$project$GlobalFunction$GlobalBasics$addPolyPos = F2(
	function (poly, p) {
		return A2(
			$elm$core$Array$map,
			function (ls) {
				return A2($author$project$GlobalFunction$GlobalBasics$addLSPos, ls, p);
			},
			poly);
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Array$filter = F2(
	function (isGood, array) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$GlobalFunction$GlobalBasics$minusPosPos = F2(
	function (p1, p2) {
		var _v0 = p2;
		var p2X = _v0.a;
		var p2Y = _v0.b;
		var _v1 = p1;
		var p1X = _v1.a;
		var p1Y = _v1.b;
		return _Utils_Tuple2(p1X - p2X, p1Y - p2Y);
	});
var $author$project$GlobalFunction$GlobalBasics$vecCrossProd = F2(
	function (p1, p2) {
		var _v0 = p2;
		var p2X = _v0.a;
		var p2Y = _v0.b;
		var _v1 = p1;
		var p1X = _v1.a;
		var p1Y = _v1.b;
		return (p1X * p2Y) - (p2X * p1Y);
	});
var $author$project$GlobalFunction$GlobalBasics$ifPosOnLs = F2(
	function (p, ls) {
		var _v0 = p;
		var pX = _v0.a;
		var pY = _v0.b;
		var _v1 = ls;
		var lsP1 = _v1.a;
		var lsP2 = _v1.b;
		var _v2 = ls;
		var _v3 = _v2.a;
		var ls1X = _v3.a;
		var ls1Y = _v3.b;
		var _v4 = _v2.b;
		var ls2X = _v4.a;
		var ls2Y = _v4.b;
		var maxLSX = A2($elm$core$Basics$max, ls1X, ls2X);
		var minLSX = A2($elm$core$Basics$min, ls1X, ls2X);
		var maxLSY = A2($elm$core$Basics$max, ls1Y, ls2Y);
		var minLSY = A2($elm$core$Basics$min, ls1Y, ls2Y);
		return ((_Utils_cmp(minLSX, pX) < 1) && ((_Utils_cmp(pX, maxLSX) < 1) && ((_Utils_cmp(minLSY, pY) < 1) && (_Utils_cmp(pY, maxLSY) < 1)))) ? ((A2(
			$author$project$GlobalFunction$GlobalBasics$vecCrossProd,
			A2($author$project$GlobalFunction$GlobalBasics$minusPosPos, p, lsP1),
			A2($author$project$GlobalFunction$GlobalBasics$minusPosPos, p, lsP2)) === 0.0) ? true : false) : false;
	});
var $author$project$GlobalFunction$GlobalBasics$ifCollideLSLS = F2(
	function (ls1, ls2) {
		var _v0 = ls2;
		var ls2P1 = _v0.a;
		var ls2P2 = _v0.b;
		var _v1 = ls1;
		var ls1P1 = _v1.a;
		var ls1P2 = _v1.b;
		if (A2($author$project$GlobalFunction$GlobalBasics$ifPosOnLs, ls1P1, ls2) || (A2($author$project$GlobalFunction$GlobalBasics$ifPosOnLs, ls1P2, ls2) || (A2($author$project$GlobalFunction$GlobalBasics$ifPosOnLs, ls2P1, ls1) || A2($author$project$GlobalFunction$GlobalBasics$ifPosOnLs, ls2P2, ls1)))) {
			return $author$project$GlobalFunction$GlobalBasics$Collided;
		} else {
			var v2P1_2P2 = A2($author$project$GlobalFunction$GlobalBasics$minusPosPos, ls2P1, ls2P2);
			var v1P2_2P1 = A2($author$project$GlobalFunction$GlobalBasics$minusPosPos, ls1P2, ls2P1);
			var v1P1_2P2 = A2($author$project$GlobalFunction$GlobalBasics$minusPosPos, ls1P1, ls2P2);
			var v1P1_2P1 = A2($author$project$GlobalFunction$GlobalBasics$minusPosPos, ls1P1, ls2P1);
			var v1P1_1P2 = A2($author$project$GlobalFunction$GlobalBasics$minusPosPos, ls1P1, ls1P2);
			var if2P1 = (A2($author$project$GlobalFunction$GlobalBasics$vecCrossProd, v1P2_2P1, v2P1_2P2) * A2($author$project$GlobalFunction$GlobalBasics$vecCrossProd, v1P1_2P1, v2P1_2P2)) < 0;
			var if1P1 = (A2($author$project$GlobalFunction$GlobalBasics$vecCrossProd, v1P1_2P1, v1P1_1P2) * A2($author$project$GlobalFunction$GlobalBasics$vecCrossProd, v1P1_2P2, v1P1_1P2)) < 0;
			return (if1P1 && if2P1) ? $author$project$GlobalFunction$GlobalBasics$Collided : $author$project$GlobalFunction$GlobalBasics$NotCollided;
		}
	});
var $elm$core$Array$isEmpty = function (_v0) {
	var len = _v0.a;
	return !len;
};
var $author$project$GlobalFunction$GlobalBasics$ifCollideLSPoly = F2(
	function (ls, poly) {
		var ifNotCollided = $elm$core$Array$isEmpty(
			A2(
				$elm$core$Array$filter,
				function (polyLS) {
					return _Utils_eq(
						A2($author$project$GlobalFunction$GlobalBasics$ifCollideLSLS, ls, polyLS),
						$author$project$GlobalFunction$GlobalBasics$Collided);
				},
				poly));
		return ifNotCollided ? $author$project$GlobalFunction$GlobalBasics$NotCollided : $author$project$GlobalFunction$GlobalBasics$Collided;
	});
var $author$project$GlobalFunction$GlobalBasics$ifCollidePolyPoly = F2(
	function (poly1, poly2) {
		var ifNotCollided = $elm$core$Array$isEmpty(
			A2(
				$elm$core$Array$filter,
				function (poly1LS) {
					return _Utils_eq(
						A2($author$project$GlobalFunction$GlobalBasics$ifCollideLSPoly, poly1LS, poly2),
						$author$project$GlobalFunction$GlobalBasics$Collided);
				},
				poly1));
		return ifNotCollided ? $author$project$GlobalFunction$GlobalBasics$NotCollided : $author$project$GlobalFunction$GlobalBasics$Collided;
	});
var $author$project$Modules$Player$playerHorizontalCollide = function (model) {
	var oldPlayer = model.player;
	var newPlayerChangeVelocity = _Utils_update(
		oldPlayer,
		{
			ifChangeBackToLastPosX: true,
			velocity: _Utils_Tuple2(0.0, oldPlayer.velocity.b)
		});
	var newModel = _Utils_update(
		model,
		{player: newPlayerChangeVelocity});
	return newModel;
};
var $author$project$Modules$Player$playerIfCollidePoly = F2(
	function (model, unit) {
		var _v0 = model.player.collisionBox;
		var playerPoly = _v0.a;
		var _v1 = unit.collisionBox;
		var unitPoly = _v1.a;
		var unitCollisionBox = A2($author$project$GlobalFunction$GlobalBasics$addPolyPos, unitPoly, unit.pos);
		var playerPosCollisionBox = A2($author$project$GlobalFunction$GlobalBasics$addPolyPos, playerPoly, model.player.pos);
		return A2($author$project$GlobalFunction$GlobalBasics$ifCollidePolyPoly, playerPosCollisionBox, unitCollisionBox);
	});
var $author$project$Modules$Player$playerVerticalCollide = function (model) {
	var oldPlayer = model.player;
	var newPlayerChangeVelocity = _Utils_update(
		oldPlayer,
		{
			ifChangeBackToLastPosY: true,
			velocity: _Utils_Tuple2(oldPlayer.velocity.a, 0.0)
		});
	var newModel = _Utils_update(
		model,
		{player: newPlayerChangeVelocity});
	return newModel;
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Modules$Player$playerCollideRigidBody = F2(
	function (model, unit) {
		var _v0 = model.player.collisionBox;
		var playerPoly = _v0.a;
		var _v1 = unit.collisionBox;
		var unitPoly = _v1.a;
		if (!_Utils_eq(
			A2($author$project$Modules$Player$playerIfCollidePoly, model, unit),
			$author$project$GlobalFunction$GlobalBasics$Collided)) {
			return model;
		} else {
			var unitPolyNow = A2($author$project$GlobalFunction$GlobalBasics$addPolyPos, unitPoly, unit.pos);
			var playerPolyNow = A2($author$project$GlobalFunction$GlobalBasics$addPolyPos, playerPoly, model.player.pos);
			var playerCollideStatusNow = A2(
				$elm$core$Array$map,
				function (ls) {
					return A2($author$project$GlobalFunction$GlobalBasics$ifCollideLSPoly, ls, unitPolyNow);
				},
				playerPolyNow);
			var playerCollideSum = A3(
				$elm$core$Array$foldl,
				F2(
					function (collideStatus, sum) {
						return _Utils_eq(collideStatus, $author$project$GlobalFunction$GlobalBasics$Collided) ? (sum + 1) : sum;
					}),
				0,
				playerCollideStatusNow);
			switch (playerCollideSum) {
				case 1:
					return (_Utils_eq(
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$GlobalFunction$GlobalBasics$NotCollided,
							A2($elm$core$Array$get, 0, playerCollideStatusNow)),
						$author$project$GlobalFunction$GlobalBasics$Collided) || _Utils_eq(
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$GlobalFunction$GlobalBasics$NotCollided,
							A2($elm$core$Array$get, 2, playerCollideStatusNow)),
						$author$project$GlobalFunction$GlobalBasics$Collided)) ? $author$project$Modules$Player$playerVerticalCollide(model) : $author$project$Modules$Player$playerHorizontalCollide(model);
				case 2:
					if (_Utils_eq(
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$GlobalFunction$GlobalBasics$NotCollided,
							A2($elm$core$Array$get, 0, playerCollideStatusNow)),
						$author$project$GlobalFunction$GlobalBasics$Collided) && _Utils_eq(
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$GlobalFunction$GlobalBasics$NotCollided,
							A2($elm$core$Array$get, 2, playerCollideStatusNow)),
						$author$project$GlobalFunction$GlobalBasics$Collided)) {
						return $author$project$Modules$Player$playerHorizontalCollide(model);
					} else {
						if (_Utils_eq(
							A2(
								$elm$core$Maybe$withDefault,
								$author$project$GlobalFunction$GlobalBasics$NotCollided,
								A2($elm$core$Array$get, 1, playerCollideStatusNow)),
							$author$project$GlobalFunction$GlobalBasics$Collided) && _Utils_eq(
							A2(
								$elm$core$Maybe$withDefault,
								$author$project$GlobalFunction$GlobalBasics$NotCollided,
								A2($elm$core$Array$get, 3, playerCollideStatusNow)),
							$author$project$GlobalFunction$GlobalBasics$Collided)) {
							return $author$project$Modules$Player$playerVerticalCollide(model);
						} else {
							var playerPolyYNow = A2(
								$author$project$GlobalFunction$GlobalBasics$addPolyPos,
								playerPoly,
								_Utils_Tuple2(model.player.lastPos.a, model.player.pos.b));
							var playerPolyXNow = A2(
								$author$project$GlobalFunction$GlobalBasics$addPolyPos,
								playerPoly,
								_Utils_Tuple2(model.player.pos.a, model.player.lastPos.b));
							var collideXModel = _Utils_eq(
								A2($author$project$GlobalFunction$GlobalBasics$ifCollidePolyPoly, playerPolyXNow, unitPolyNow),
								$author$project$GlobalFunction$GlobalBasics$Collided) ? $author$project$Modules$Player$playerHorizontalCollide(model) : model;
							var collideYModel = _Utils_eq(
								A2($author$project$GlobalFunction$GlobalBasics$ifCollidePolyPoly, playerPolyYNow, unitPolyNow),
								$author$project$GlobalFunction$GlobalBasics$Collided) ? $author$project$Modules$Player$playerVerticalCollide(collideXModel) : collideXModel;
							if ((!collideYModel.player.ifChangeBackToLastPosX) && (!collideYModel.player.ifChangeBackToLastPosX)) {
								var oldPlayer = collideYModel.player;
								var newPlayer = _Utils_update(
									oldPlayer,
									{ifChangeBackToLastPosY: true});
								var newCollideYModel = _Utils_update(
									collideYModel,
									{player: newPlayer});
								return newCollideYModel;
							} else {
								return collideYModel;
							}
						}
					}
				case 3:
					return (_Utils_eq(
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$GlobalFunction$GlobalBasics$NotCollided,
							A2($elm$core$Array$get, 0, playerCollideStatusNow)),
						$author$project$GlobalFunction$GlobalBasics$Collided) && _Utils_eq(
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$GlobalFunction$GlobalBasics$NotCollided,
							A2($elm$core$Array$get, 2, playerCollideStatusNow)),
						$author$project$GlobalFunction$GlobalBasics$Collided)) ? $author$project$Modules$Player$playerHorizontalCollide(model) : $author$project$Modules$Player$playerVerticalCollide(model);
				default:
					return model;
			}
		}
	});
var $author$project$Modules$Sound$Dead = {$: 'Dead'};
var $author$project$Modules$Sound$Activated = F3(
	function (a, b, c) {
		return {$: 'Activated', a: a, b: b, c: c};
	});
var $author$project$Modules$Sound$BackGround = {$: 'BackGround'};
var $author$project$Modules$Sound$Jump = {$: 'Jump'};
var $author$project$Modules$Sound$None = {$: 'None'};
var $author$project$Modules$Sound$backGroundLength = 10;
var $author$project$Modules$Sound$deadLength = 200;
var $author$project$Modules$Sound$jumpLength = 30;
var $author$project$Modules$Sound$needleLength = 30;
var $author$project$Modules$Sound$randomBoxLength = 60;
var $author$project$Modules$Sound$swordLength = 200;
var $author$project$Modules$Sound$trigger = F2(
	function (model, soundEffect) {
		var oldSound = model.sound;
		var newSoundTrigger = function () {
			switch (soundEffect.$) {
				case 'BackGround':
					return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$backGroundLength, $author$project$Modules$Sound$BackGround, $author$project$Modules$Sound$None);
				case 'Jump':
					return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$jumpLength, $author$project$Modules$Sound$Jump, $author$project$Modules$Sound$None);
				case 'RandomBox':
					return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$randomBoxLength, $author$project$Modules$Sound$RandomBox, $author$project$Modules$Sound$None);
				case 'Needle':
					return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$needleLength, $author$project$Modules$Sound$Needle, $author$project$Modules$Sound$None);
				case 'Dead':
					return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$deadLength, $author$project$Modules$Sound$Dead, $author$project$Modules$Sound$None);
				default:
					return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$swordLength, $author$project$Modules$Sound$Sword, $author$project$Modules$Sound$None);
			}
		}();
		var newSoundTriggerList = A2($elm$core$List$cons, newSoundTrigger, oldSound.soundTrigger);
		var newSound = _Utils_update(
			oldSound,
			{soundTrigger: newSoundTriggerList});
		return _Utils_update(
			model,
			{sound: newSound});
	});
var $author$project$Modules$Player$playerDead = F2(
	function (model, deadType) {
		var oldPlayer = model.player;
		var _v0 = model.player.deadTimes;
		var oldDeadTimes = _v0.a;
		var newPlayer = _Utils_update(
			oldPlayer,
			{
				deadTimes: _Utils_Tuple2(oldDeadTimes + 1, deadType),
				liveState: $author$project$Modules$Player$Dead
			});
		return A2(
			$author$project$Modules$Sound$trigger,
			_Utils_update(
				model,
				{player: newPlayer}),
			$author$project$Modules$Sound$Dead);
	});
var $author$project$Modules$Player$playerRefreshJump = function (model) {
	var oldPlayer = model.player;
	var newPlayer = _Utils_update(
		oldPlayer,
		{
			ifThisFrameOnGround: true,
			jump: A2($author$project$Modules$Player$Jump, model.player.property.playerJumpNum, -1)
		});
	return _Utils_update(
		model,
		{player: newPlayer});
};
var $author$project$Modules$Boundary$updateOneBoundary = F4(
	function (anchor, area, boundaryType, _v0) {
		var model = _v0.a;
		var cmd = _v0.b;
		var _v1 = area;
		var areaX = _v1.a;
		var areaY = _v1.b;
		var _v2 = anchor;
		var anchorX = _v2.a;
		var anchorY = _v2.b;
		var collisionBox = $author$project$GlobalFunction$GlobalBasics$Polygon(
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2(
						_Utils_Tuple2(anchorX, anchorY),
						_Utils_Tuple2(anchorX + areaX, anchorY)),
						_Utils_Tuple2(
						_Utils_Tuple2(anchorX + areaX, anchorY),
						_Utils_Tuple2(anchorX + areaX, anchorY + areaY)),
						_Utils_Tuple2(
						_Utils_Tuple2(anchorX + areaX, anchorY + areaY),
						_Utils_Tuple2(anchorX, anchorY + areaY)),
						_Utils_Tuple2(
						_Utils_Tuple2(anchorX, anchorY + areaY),
						_Utils_Tuple2(anchorX, anchorY))
					])));
		switch (boundaryType.$) {
			case 'BoundaryNoCollide':
				return _Utils_Tuple2(model, cmd);
			case 'BoundaryCollide':
				return _Utils_Tuple2(
					A2(
						$author$project$Modules$Player$playerCollideRigidBody,
						model,
						{
							collisionBox: collisionBox,
							pos: _Utils_Tuple2(0.0, 0.0)
						}),
					cmd);
			case 'BoundaryCollideGround':
				if (_Utils_eq(
					A2(
						$author$project$Modules$Player$playerIfCollidePoly,
						model,
						{
							collisionBox: collisionBox,
							pos: _Utils_Tuple2(0.0, 0.0)
						}),
					$author$project$GlobalFunction$GlobalBasics$Collided)) {
					var refreshJumpModel = $author$project$Modules$Player$playerRefreshJump(model);
					var newModel = A2(
						$author$project$Modules$Player$playerCollideRigidBody,
						refreshJumpModel,
						{
							collisionBox: collisionBox,
							pos: _Utils_Tuple2(0.0, 0.0)
						});
					return _Utils_Tuple2(newModel, cmd);
				} else {
					return _Utils_Tuple2(model, cmd);
				}
			default:
				var ifCollide = A2(
					$author$project$Modules$Player$playerIfCollidePoly,
					model,
					{
						collisionBox: collisionBox,
						pos: _Utils_Tuple2(0.0, 0.0)
					});
				var newModel = _Utils_eq(ifCollide, $author$project$GlobalFunction$GlobalBasics$Collided) ? A2($author$project$Modules$Player$playerDead, model, $author$project$Modules$Player$StepOnNeedle) : model;
				return _Utils_Tuple2(
					A2(
						$author$project$Modules$Player$playerCollideRigidBody,
						newModel,
						{
							collisionBox: collisionBox,
							pos: _Utils_Tuple2(0.0, 0.0)
						}),
					cmd);
		}
	});
var $author$project$Modules$Boundary$update = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var _v1 = model.levelBoundary;
	var levelBoundaryX = _v1.a;
	var levelBoundaryY = _v1.b;
	return A4(
		$author$project$Modules$Boundary$updateOneBoundary,
		_Utils_Tuple2(levelBoundaryX, 0),
		_Utils_Tuple2($author$project$Modules$Boundary$boundaryWidth, levelBoundaryY),
		model.boundary.rightBoundary,
		A4(
			$author$project$Modules$Boundary$updateOneBoundary,
			_Utils_Tuple2(0, 0),
			_Utils_Tuple2($author$project$Modules$Boundary$boundaryWidth, levelBoundaryY),
			model.boundary.leftBoundary,
			A4(
				$author$project$Modules$Boundary$updateOneBoundary,
				_Utils_Tuple2(0, levelBoundaryY),
				_Utils_Tuple2(levelBoundaryX, $author$project$Modules$Boundary$boundaryWidth),
				model.boundary.downBoundary,
				A4(
					$author$project$Modules$Boundary$updateOneBoundary,
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(levelBoundaryX, $author$project$Modules$Boundary$boundaryWidth),
					model.boundary.upBoundary,
					_Utils_Tuple2(model, cmd)))));
};
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $author$project$Modules$Brick$defBrick = $author$project$Modules$Brick$initPos(
	_Utils_Tuple2(0, 0));
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$GlobalFunction$GlobalBasics$defPos = _Utils_Tuple2(0.0, 0.0);
var $author$project$GlobalFunction$GlobalBasics$defLineSeg = _Utils_Tuple2($author$project$GlobalFunction$GlobalBasics$defPos, $author$project$GlobalFunction$GlobalBasics$defPos);
var $author$project$GlobalFunction$GlobalModule$updateOneCollision = F2(
	function (model, myModule) {
		var nextCollision = function () {
			var _v1 = myModule.collision;
			switch (_v1.$) {
				case 'Collide':
					var tempNextCollision = _v1.a;
					return tempNextCollision;
				case 'NoCollide':
					var tempNextCollision = _v1.a;
					return tempNextCollision;
				default:
					return $author$project$GlobalFunction$GlobalModule$NoNextCollision;
			}
		}();
		var newCollision = function () {
			switch (nextCollision.$) {
				case 'CollideAfterEvent':
					var eventID = nextCollision.a;
					var nextNextCollision = nextCollision.b;
					return _Utils_eq(
						A2($author$project$Modules$Event$ifActEventById, model, eventID),
						$author$project$Modules$Event$ActEventAct) ? $author$project$GlobalFunction$GlobalModule$Collide(nextNextCollision) : myModule.collision;
				case 'NoCollideAfterEvent':
					var eventID = nextCollision.a;
					var nextNextCollision = nextCollision.b;
					return _Utils_eq(
						A2($author$project$Modules$Event$ifActEventById, model, eventID),
						$author$project$Modules$Event$ActEventAct) ? $author$project$GlobalFunction$GlobalModule$NoCollide(nextNextCollision) : myModule.collision;
				default:
					return myModule.collision;
			}
		}();
		var newModule = _Utils_update(
			myModule,
			{collision: newCollision});
		return newModule;
	});
var $author$project$Modules$Brick$updateOneBrickCollision = F2(
	function (id, model) {
		var brick = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$Brick$defBrick,
			A2($elm$core$Array$get, id, model.bricks));
		var newBrick = A2($author$project$GlobalFunction$GlobalModule$updateOneCollision, model, brick);
		var newBricks = A3($elm$core$Array$set, id, newBrick, model.bricks);
		var newBricksModel = _Utils_update(
			model,
			{bricks: newBricks});
		var newPlayerModel = function () {
			var _v0 = newBrick.collision;
			if (_v0.$ === 'Collide') {
				var tempNextCollision = _v0.a;
				if (_Utils_eq(
					A2($author$project$Modules$Player$playerIfCollidePoly, newBricksModel, brick),
					$author$project$GlobalFunction$GlobalBasics$NotCollided)) {
					return newBricksModel;
				} else {
					var _v1 = brick.collisionBox;
					var poly = _v1.a;
					var _v2 = _Utils_Tuple2(model.player.property.playerWidth, model.player.property.playerHeight);
					var playerWidth = _v2.a;
					var playerHeight = _v2.b;
					var _v3 = A2(
						$author$project$GlobalFunction$GlobalBasics$addPosPos,
						model.player.pos,
						_Utils_Tuple2(0, playerHeight));
					var playerDownX = _v3.a;
					var playerDownY = _v3.b;
					var _v4 = A2(
						$elm$core$Maybe$withDefault,
						$author$project$GlobalFunction$GlobalBasics$defLineSeg,
						A2($elm$core$Array$get, 0, poly));
					var _v5 = _v4.a;
					var p1X = _v5.a;
					var p1Y = _v5.b;
					var _v6 = _v4.b;
					var p2X = _v6.a;
					var p2Y = _v6.b;
					var upLS = _Utils_Tuple2(
						_Utils_Tuple2(p1X, p1Y),
						_Utils_Tuple2(p2X, p2Y));
					var _v7 = A2(
						$author$project$GlobalFunction$GlobalBasics$addPosPos,
						brick.pos,
						_Utils_Tuple2(20, 0));
					var blockUpX = _v7.a;
					var blockUpY = _v7.b;
					var refreshJumpModel = (_Utils_eq(
						A2(
							$author$project$Modules$Player$playerIfCollidePoly,
							newBricksModel,
							{
								collisionBox: $author$project$GlobalFunction$GlobalBasics$Polygon(
									$elm$core$Array$fromList(
										_List_fromArray(
											[upLS]))),
								pos: brick.pos
							}),
						$author$project$GlobalFunction$GlobalBasics$Collided) && (($elm$core$Basics$abs(model.player.velocity.b) <= 0.2) && ($elm$core$Basics$abs(playerDownY - blockUpY) <= 0.2))) ? $author$project$Modules$Player$playerRefreshJump(newBricksModel) : newBricksModel;
					var collideModel = A2($author$project$Modules$Player$playerCollideRigidBody, refreshJumpModel, brick);
					return collideModel;
				}
			} else {
				return newBricksModel;
			}
		}();
		return newPlayerModel;
	});
var $elm$core$Basics$atan = _Basics_atan;
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$GlobalFunction$GlobalBasics$distPosPos = F2(
	function (p1, p2) {
		var _v0 = p2;
		var p2X = _v0.a;
		var p2Y = _v0.b;
		var _v1 = p1;
		var p1X = _v1.a;
		var p1Y = _v1.b;
		return $elm$core$Basics$sqrt(((p1X - p2X) * (p1X - p2X)) + ((p1Y - p2Y) * (p1Y - p2Y)));
	});
var $elm$core$Basics$sin = _Basics_sin;
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $author$project$GlobalFunction$GlobalModule$updateOneMove = F2(
	function (model, myModule) {
		var _v0 = myModule.move;
		if (_v0.$ === 'Move') {
			var posArray = _v0.a;
			var speed = _v0.b;
			var eventID = _v0.c;
			var nextMove = _v0.d;
			if ($elm$core$Array$isEmpty(posArray)) {
				return _Utils_eq(
					A2($author$project$Modules$Event$ifActEventById, model, eventID),
					$author$project$Modules$Event$ActEventAct) ? _Utils_update(
					myModule,
					{move: nextMove}) : myModule;
			} else {
				var destination = A2(
					$elm$core$Maybe$withDefault,
					$author$project$GlobalFunction$GlobalBasics$defPos,
					A2($elm$core$Array$get, 0, posArray));
				if (_Utils_cmp(
					A2($author$project$GlobalFunction$GlobalBasics$distPosPos, destination, myModule.pos),
					speed) < 1) {
					var newPosArray = A3(
						$elm$core$Array$slice,
						1,
						$elm$core$Array$length(posArray),
						posArray);
					return _Utils_update(
						myModule,
						{
							move: A4($author$project$GlobalFunction$GlobalModule$Move, newPosArray, speed, eventID, nextMove),
							pos: destination
						});
				} else {
					var _v1 = myModule.pos;
					var posX = _v1.a;
					var posY = _v1.b;
					var _v2 = destination;
					var destinationX = _v2.a;
					var destinationY = _v2.b;
					var newPos = function () {
						if (_Utils_eq(posX, destinationX)) {
							return (_Utils_cmp(destinationY, posY) > 0) ? _Utils_Tuple2(posX, posY + speed) : _Utils_Tuple2(posX, posY - speed);
						} else {
							var degree = $elm$core$Basics$atan((destinationY - posY) / (destinationX - posX));
							var deltaX = (_Utils_cmp(destinationX, posX) > 0) ? $elm$core$Basics$abs(
								speed * $elm$core$Basics$cos(degree)) : (-$elm$core$Basics$abs(
								speed * $elm$core$Basics$cos(degree)));
							var deltaY = (_Utils_cmp(destinationY, posY) > 0) ? $elm$core$Basics$abs(
								speed * $elm$core$Basics$sin(degree)) : (-$elm$core$Basics$abs(
								speed * $elm$core$Basics$sin(degree)));
							return _Utils_Tuple2(posX + deltaX, posY + deltaY);
						}
					}();
					return _Utils_update(
						myModule,
						{pos: newPos});
				}
			}
		} else {
			return myModule;
		}
	});
var $author$project$GlobalFunction$GlobalModule$updateOneVisibility = F2(
	function (model, myModule) {
		var nextVisibility = function () {
			var _v1 = myModule.visibility;
			switch (_v1.$) {
				case 'Visible':
					var tempNextVisibility = _v1.a;
					return tempNextVisibility;
				case 'Invisible':
					var tempNextVisibility = _v1.a;
					return tempNextVisibility;
				default:
					return $author$project$GlobalFunction$GlobalModule$NoNextVisibility;
			}
		}();
		var newVisibility = function () {
			switch (nextVisibility.$) {
				case 'VisibleAfterEvent':
					var eventID = nextVisibility.a;
					var nextNextVisibility = nextVisibility.b;
					return _Utils_eq(
						A2($author$project$Modules$Event$ifActEventById, model, eventID),
						$author$project$Modules$Event$ActEventAct) ? $author$project$GlobalFunction$GlobalModule$Visible(nextNextVisibility) : myModule.visibility;
				case 'InvisibleAfterEvent':
					var eventID = nextVisibility.a;
					var nextNextVisibility = nextVisibility.b;
					return _Utils_eq(
						A2($author$project$Modules$Event$ifActEventById, model, eventID),
						$author$project$Modules$Event$ActEventAct) ? $author$project$GlobalFunction$GlobalModule$Invisible(nextNextVisibility) : myModule.visibility;
				default:
					return myModule.visibility;
			}
		}();
		var newModule = _Utils_update(
			myModule,
			{visibility: newVisibility});
		return newModule;
	});
var $author$project$Modules$Brick$updateOneBrick = F2(
	function (id, model) {
		var oldBrick = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$Brick$defBrick,
			A2($elm$core$Array$get, id, model.bricks));
		var newBrickVisMove = A2(
			$author$project$GlobalFunction$GlobalModule$updateOneMove,
			model,
			A2($author$project$GlobalFunction$GlobalModule$updateOneVisibility, model, oldBrick));
		var newBricks = A3($elm$core$Array$set, id, newBrickVisMove, model.bricks);
		var newModel = _Utils_update(
			model,
			{bricks: newBricks});
		return A2($author$project$Modules$Brick$updateOneBrickCollision, id, newModel);
	});
var $author$project$Modules$Brick$update = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	return _Utils_Tuple2(
		A3(
			$elm$core$List$foldl,
			$author$project$Modules$Brick$updateOneBrick,
			model,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$Array$length(model.bricks) - 1)),
		cmd);
};
var $author$project$Modules$Player$Win = {$: 'Win'};
var $author$project$Modules$Player$playerWin = function (model) {
	var oldPlayer = model.player;
	var newPlayer = _Utils_update(
		oldPlayer,
		{liveState: $author$project$Modules$Player$Win});
	return _Utils_update(
		model,
		{player: newPlayer});
};
var $author$project$Modules$EndPoint$update = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var status = A2($author$project$Modules$Player$playerIfCollidePoly, model, model.endPoint);
	return _Utils_eq(status, $author$project$GlobalFunction$GlobalBasics$Collided) ? _Utils_Tuple2(
		$author$project$Modules$Player$playerWin(model),
		cmd) : _Utils_Tuple2(model, cmd);
};
var $author$project$Modules$Event$defEvent = A4(
	$author$project$Modules$Event$init,
	{id: 0, name: ''},
	$author$project$Modules$Event$StartActivated,
	$author$project$Modules$Event$TimeAfterStart(0),
	$author$project$Modules$Event$quickDuration(0));
var $author$project$Modules$Event$EventActTill = function (a) {
	return {$: 'EventActTill', a: a};
};
var $author$project$Modules$Event$deactivateEvent = F2(
	function (model, event) {
		var newActEvent = A2(
			$elm$core$Array$filter,
			function (actEvent) {
				return (!_Utils_eq(event.name, actEvent.name)) && (!_Utils_eq(event.name, actEvent.name));
			},
			model.actEvent);
		var newModel = _Utils_update(
			model,
			{actEvent: newActEvent});
		return newModel;
	});
var $author$project$Modules$Event$updateOneEventActCounter = function (_v0) {
	var model = _v0.a;
	var event = _v0.b;
	var _v1 = event.actCounter;
	if (_v1.$ === 'EventNotAct') {
		return _Utils_Tuple2(model, event);
	} else {
		var timeLeft = _v1.a;
		if (!timeLeft) {
			var newModel = A2($author$project$Modules$Event$deactivateEvent, model, event.info);
			var newEvent = _Utils_update(
				event,
				{actCounter: $author$project$Modules$Event$EventNotAct});
			return _Utils_Tuple2(newModel, newEvent);
		} else {
			if (_Utils_eq(timeLeft, -1)) {
				return _Utils_Tuple2(model, event);
			} else {
				return _Utils_Tuple2(
					model,
					_Utils_update(
						event,
						{
							actCounter: $author$project$Modules$Event$EventActTill(timeLeft - 1)
						}));
			}
		}
	}
};
var $author$project$Modules$Event$ActEvent = F2(
	function (id, name) {
		return {id: id, name: name};
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $author$project$Modules$Event$activateEvent = F2(
	function (model, event) {
		var actEvent = A2($author$project$Modules$Event$ActEvent, event.id, event.name);
		var newActEvent = A2(
			$elm$core$List$member,
			event,
			$elm$core$Array$toList(model.actEvent)) ? model.actEvent : A2($elm$core$Array$push, actEvent, model.actEvent);
		var newModel = _Utils_update(
			model,
			{actEvent: newActEvent});
		return newModel;
	});
var $author$project$Modules$Event$eventUpdateActivateEvent = function (_v0) {
	var model = _v0.a;
	var event = _v0.b;
	var oldDuration = event.duration;
	var newModel = A2($author$project$Modules$Event$activateEvent, model, event.info);
	var newDuration = _Utils_update(
		oldDuration,
		{leftActTimes: oldDuration.leftActTimes - 1, nowInterval: oldDuration.nowInterval});
	var newActCounter = $author$project$Modules$Event$EventActTill(oldDuration.actDuration);
	var newEvent = _Utils_update(
		event,
		{actCounter: newActCounter, duration: newDuration});
	return _Utils_Tuple2(newModel, newEvent);
};
var $author$project$Modules$Event$updateOneEventActType = function (_v0) {
	var model = _v0.a;
	var event = _v0.b;
	if (!event.duration.leftActTimes) {
		return _Utils_Tuple2(model, event);
	} else {
		if (!(!event.duration.nowInterval)) {
			var oldEventDuration = event.duration;
			var newEventDuration = _Utils_update(
				oldEventDuration,
				{nowInterval: oldEventDuration.nowInterval - 1});
			var newEvent = _Utils_update(
				event,
				{duration: newEventDuration});
			return _Utils_Tuple2(model, newEvent);
		} else {
			var _v1 = event.actType;
			if (_v1.$ === 'TimeAfterStart') {
				var timeLeft = _v1.a;
				return (!timeLeft) ? $author$project$Modules$Event$eventUpdateActivateEvent(
					_Utils_Tuple2(model, event)) : _Utils_Tuple2(
					model,
					_Utils_update(
						event,
						{
							actType: $author$project$Modules$Event$TimeAfterStart(timeLeft - 1)
						}));
			} else {
				var collisionBox = _v1.a;
				return _Utils_eq(
					A2(
						$author$project$Modules$Player$playerIfCollidePoly,
						model,
						{
							collisionBox: collisionBox,
							pos: _Utils_Tuple2(0.0, 0.0)
						}),
					$author$project$GlobalFunction$GlobalBasics$Collided) ? $author$project$Modules$Event$eventUpdateActivateEvent(
					_Utils_Tuple2(model, event)) : _Utils_Tuple2(model, event);
			}
		}
	}
};
var $author$project$Modules$Event$updateOneEventIfStartAct = function (_v0) {
	updateOneEventIfStartAct:
	while (true) {
		var model = _v0.a;
		var event = _v0.b;
		var _v1 = event.ifStartAct;
		if (_v1.$ === 'AfterActEvent') {
			var eventId = _v1.a;
			if (_Utils_eq(
				A2($author$project$Modules$Event$ifActEventById, model, eventId),
				$author$project$Modules$Event$ActEventAct)) {
				var newEvent = _Utils_update(
					event,
					{ifStartAct: $author$project$Modules$Event$StartActivated});
				var $temp$_v0 = _Utils_Tuple2(model, newEvent);
				_v0 = $temp$_v0;
				continue updateOneEventIfStartAct;
			} else {
				return _Utils_Tuple2(model, event);
			}
		} else {
			return $author$project$Modules$Event$updateOneEventActType(
				_Utils_Tuple2(model, event));
		}
	}
};
var $author$project$Modules$Event$updateOneEvent = F2(
	function (model, index) {
		var event = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$Event$defEvent,
			A2($elm$core$Array$get, index, model.event));
		if (_Utils_eq(event, $author$project$Modules$Event$defEvent)) {
			return model;
		} else {
			var _v0 = $author$project$Modules$Event$updateOneEventIfStartAct(
				$author$project$Modules$Event$updateOneEventActCounter(
					_Utils_Tuple2(model, event)));
			var newModel = _v0.a;
			var newEvent = _v0.b;
			var newEventModel = _Utils_update(
				newModel,
				{
					event: A3($elm$core$Array$set, index, newEvent, newModel.event)
				});
			return newEventModel;
		}
	});
var $author$project$Modules$Event$update = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var newModel = A3(
		$elm$core$List$foldl,
		F2(
			function (i, tmpModel) {
				return A2($author$project$Modules$Event$updateOneEvent, tmpModel, i);
			}),
		model,
		A2(
			$elm$core$List$range,
			0,
			$elm$core$Array$length(model.event) - 1));
	return _Utils_Tuple2(newModel, cmd);
};
var $author$project$Modules$GameControl$Hint = function (a) {
	return {$: 'Hint', a: a};
};
var $author$project$MainFunction$MainConstant$buttonDownColor = '#FFE6E89F';
var $author$project$MainFunction$MainConstant$buttonOverColor = '#FFE6E8CF';
var $elm$json$Json$Encode$float = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Modules$GameControl$changeVolume = _Platform_outgoingPort(
	'changeVolume',
	function ($) {
		var a = $.a;
		var b = $.b;
		return A2(
			$elm$json$Json$Encode$list,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$json$Json$Encode$string(a),
					$elm$json$Json$Encode$float(b)
				]));
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Modules$GameControl$update = F2(
	function (msg, _v0) {
		var model = _v0.a;
		var cmd = _v0.b;
		switch (msg.$) {
			case 'OnMouseOver':
				var num = msg.a;
				var oldGameControl = model.gameControl;
				var newGameControl = _Utils_update(
					oldGameControl,
					{
						buttonState: A3($elm$core$Array$set, num, $author$project$MainFunction$MainConstant$buttonOverColor, model.gameControl.buttonState)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gameControl: newGameControl}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[cmd])));
			case 'OnMouseOut':
				var num = msg.a;
				var oldGameControl = model.gameControl;
				var newGameControl = _Utils_update(
					oldGameControl,
					{
						buttonState: A3($elm$core$Array$set, num, $author$project$MainFunction$MainConstant$buttonNormalColor, model.gameControl.buttonState)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gameControl: newGameControl}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[cmd])));
			case 'OnMouseDown':
				var num = msg.a;
				var oldGameControl = model.gameControl;
				var newGameControl = _Utils_update(
					oldGameControl,
					{
						buttonState: A3($elm$core$Array$set, num, $author$project$MainFunction$MainConstant$buttonDownColor, model.gameControl.buttonState)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gameControl: newGameControl}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[cmd])));
			case 'OnMouseUp':
				var num = msg.a;
				var _v2 = function () {
					switch (num) {
						case 0:
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mainScene: $author$project$MainFunction$MainType$Menu}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
						case 1:
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mainScene: model.gameControl.nextLevel}),
								A2($elm$core$Task$perform, $author$project$MainFunction$MainType$GetViewport, $elm$browser$Browser$Dom$getViewport));
						case 2:
							var oldOldGameControl = model.gameControl;
							var oldNewGameControl = function () {
								var _v4 = oldOldGameControl.controlStatus;
								if (_v4.$ === 'Normal') {
									return _Utils_update(
										oldOldGameControl,
										{
											controlStatus: $author$project$Modules$GameControl$Hint(0)
										});
								} else {
									var n = _v4.a;
									return _Utils_update(
										oldOldGameControl,
										{
											controlStatus: $author$project$Modules$GameControl$Hint(
												A2($elm$core$Basics$modBy, model.gameControl.hintLength, n + 1))
										});
								}
							}();
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{gameControl: oldNewGameControl}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
						case 3:
							var oldOldGameControl = model.gameControl;
							var oldNewGameControl = _Utils_update(
								oldOldGameControl,
								{controlStatus: $author$project$Modules$GameControl$Normal});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{gameControl: oldNewGameControl}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
						case 5:
							var oldOldGameControl = model.gameControl;
							var oldNewGameControl = _Utils_update(
								oldOldGameControl,
								{
									soundLoudness: A2($elm$core$Basics$max, oldOldGameControl.soundLoudness - 0.1, 0)
								});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{gameControl: oldNewGameControl}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('BackGround', oldNewGameControl.soundLoudness)),
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('Jump', oldNewGameControl.soundLoudness)),
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('RandomBox', oldNewGameControl.soundLoudness)),
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('Needle', oldNewGameControl.soundLoudness)),
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('Dead', oldNewGameControl.soundLoudness)),
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('Sword', oldNewGameControl.soundLoudness))
										])));
						case 4:
							var oldOldGameControl = model.gameControl;
							var oldNewGameControl = _Utils_update(
								oldOldGameControl,
								{
									soundLoudness: A2($elm$core$Basics$min, oldOldGameControl.soundLoudness + 0.1, 1.0)
								});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{gameControl: oldNewGameControl}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('BackGround', oldNewGameControl.soundLoudness)),
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('Jump', oldNewGameControl.soundLoudness)),
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('RandomBox', oldNewGameControl.soundLoudness)),
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('Needle', oldNewGameControl.soundLoudness)),
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('Dead', oldNewGameControl.soundLoudness)),
											$author$project$Modules$GameControl$changeVolume(
											_Utils_Tuple2('Sword', oldNewGameControl.soundLoudness))
										])));
						default:
							return _Utils_Tuple2(
								model,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
					}
				}();
				var newModel = _v2.a;
				var newCmd = _v2.b;
				var oldGameControl = newModel.gameControl;
				var newGameControl = _Utils_update(
					oldGameControl,
					{
						buttonState: A3($elm$core$Array$set, num, $author$project$MainFunction$MainConstant$buttonOverColor, newModel.gameControl.buttonState)
					});
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{gameControl: newGameControl}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[newCmd])));
			default:
				return _Utils_Tuple2(
					model,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Modules$GameControl$changeVolume(
								_Utils_Tuple2('BackGround', model.gameControl.soundLoudness)),
								$author$project$Modules$GameControl$changeVolume(
								_Utils_Tuple2('Jump', model.gameControl.soundLoudness)),
								$author$project$Modules$GameControl$changeVolume(
								_Utils_Tuple2('RandomBox', model.gameControl.soundLoudness)),
								$author$project$Modules$GameControl$changeVolume(
								_Utils_Tuple2('Needle', model.gameControl.soundLoudness)),
								$author$project$Modules$GameControl$changeVolume(
								_Utils_Tuple2('Dead', model.gameControl.soundLoudness)),
								$author$project$Modules$GameControl$changeVolume(
								_Utils_Tuple2('Sword', model.gameControl.soundLoudness))
							])));
		}
	});
var $author$project$Modules$Monster$StopX = {$: 'StopX'};
var $author$project$Modules$Monster$StopY = {$: 'StopY'};
var $author$project$Modules$Monster$defMonster = A6(
	$author$project$Modules$Monster$init,
	_Utils_Tuple2(0, 0),
	A2($author$project$Modules$Monster$MonsterA, 20, 20),
	$author$project$Modules$Monster$StopX,
	$author$project$Modules$Monster$StopY,
	1,
	_Utils_Tuple2(0, 0));
var $author$project$Modules$Monster$updateOneMonsterCollision = F2(
	function (id, model) {
		var monster = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$Monster$defMonster,
			A2($elm$core$Array$get, id, model.monsters));
		var newModel = _Utils_eq(
			A2($author$project$Modules$Player$playerIfCollidePoly, model, monster),
			$author$project$GlobalFunction$GlobalBasics$NotCollided) ? model : A2($author$project$Modules$Player$playerDead, model, $author$project$Modules$Player$StepOnNeedle);
		return newModel;
	});
var $author$project$Modules$Monster$Follow = {$: 'Follow'};
var $author$project$Modules$Monster$Move = {$: 'Move'};
var $author$project$Modules$Monster$updateOneMonsterMode = F2(
	function (id, model) {
		var monster = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$Monster$defMonster,
			A2($elm$core$Array$get, id, model.monsters));
		var dx = model.player.pos.a - monster.pos.a;
		var newXMode = function () {
			var _v1 = monster.xMode;
			switch (_v1.$) {
				case 'ListenX':
					var x = _v1.a;
					return ((_Utils_cmp(dx, x) < 0) && (_Utils_cmp(dx, -x) > 0)) ? $author$project$Modules$Monster$Move : $author$project$Modules$Monster$ListenX(x);
				case 'StopX':
					return $author$project$Modules$Monster$StopX;
				default:
					return $author$project$Modules$Monster$Move;
			}
		}();
		var newYMode = function () {
			var _v0 = monster.yMode;
			switch (_v0.$) {
				case 'ListenY':
					var x = _v0.a;
					return ((_Utils_cmp(dx, x) < 0) && (_Utils_cmp(dx, -x) > 0)) ? $author$project$Modules$Monster$Follow : $author$project$Modules$Monster$ListenY(x);
				case 'StopY':
					return $author$project$Modules$Monster$StopY;
				default:
					return $author$project$Modules$Monster$Follow;
			}
		}();
		var newMonster = _Utils_update(
			monster,
			{xMode: newXMode, yMode: newYMode});
		var newMonsters = A3($elm$core$Array$set, id, newMonster, model.monsters);
		var newModel = _Utils_update(
			model,
			{monsters: newMonsters});
		return newModel;
	});
var $author$project$Modules$Monster$updateOneMonsterMoveX = F2(
	function (id, model) {
		var monster = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$Monster$defMonster,
			A2($elm$core$Array$get, id, model.monsters));
		var oldX = monster.pos.a;
		var newX = function () {
			var _v0 = monster.xMode;
			switch (_v0.$) {
				case 'StopX':
					return oldX;
				case 'ListenX':
					return oldX;
				default:
					return oldX + monster.xSpeed;
			}
		}();
		var newSpeed = ((_Utils_cmp(newX, monster.range.a) < 0) && (monster.xSpeed < 0)) ? (-monster.xSpeed) : (((_Utils_cmp(newX, monster.range.b) > 0) && (monster.xSpeed > 0)) ? (-monster.xSpeed) : monster.xSpeed);
		var newMonster = _Utils_update(
			monster,
			{
				pos: _Utils_Tuple2(newX, monster.pos.b),
				xSpeed: newSpeed
			});
		var newMonsters = A3($elm$core$Array$set, id, newMonster, model.monsters);
		var newModel = _Utils_update(
			model,
			{monsters: newMonsters});
		return newModel;
	});
var $author$project$Modules$Monster$updateOneMonsterMoveY = F2(
	function (id, model) {
		var playerspeed = model.player.velocity.b;
		var monster = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$Monster$defMonster,
			A2($elm$core$Array$get, id, model.monsters));
		var newYSpeed = function () {
			var _v0 = monster.yMode;
			switch (_v0.$) {
				case 'StopY':
					return 0;
				case 'ListenY':
					return 0;
				default:
					return (playerspeed < 0) ? playerspeed : (monster.ySpeed + 0.1);
			}
		}();
		var oldY = monster.pos.b;
		var newY = (_Utils_cmp(oldY + newYSpeed, monster.fixY) > 0) ? monster.fixY : (oldY + newYSpeed);
		var newnewYSpeed = (_Utils_cmp(oldY + newYSpeed, monster.fixY) > 0) ? 0 : newYSpeed;
		var newMonster = _Utils_update(
			monster,
			{
				pos: _Utils_Tuple2(monster.pos.a, newY),
				ySpeed: newnewYSpeed
			});
		var newMonsters = A3($elm$core$Array$set, id, newMonster, model.monsters);
		var newModel = _Utils_update(
			model,
			{monsters: newMonsters});
		return newModel;
	});
var $author$project$Modules$Monster$updateOneMonster = F2(
	function (id, model) {
		return A2(
			$author$project$Modules$Monster$updateOneMonsterCollision,
			id,
			A2(
				$author$project$Modules$Monster$updateOneMonsterMoveY,
				id,
				A2(
					$author$project$Modules$Monster$updateOneMonsterMoveX,
					id,
					A2($author$project$Modules$Monster$updateOneMonsterMode, id, model))));
	});
var $author$project$Modules$Monster$update = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	return _Utils_Tuple2(
		A3(
			$elm$core$List$foldl,
			$author$project$Modules$Monster$updateOneMonster,
			model,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$Array$length(model.monsters) - 1)),
		cmd);
};
var $author$project$Modules$Needle$defNeedle = A2(
	$author$project$Modules$Needle$initPos,
	_Utils_Tuple2(0, 0),
	$author$project$Modules$Needle$Laser);
var $author$project$Modules$Needle$updateOneNeedleCollision = F2(
	function (id, model) {
		var needle = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$Needle$defNeedle,
			A2($elm$core$Array$get, id, model.needles));
		var nextCollision = function () {
			var _v2 = needle.collision;
			switch (_v2.$) {
				case 'Collide':
					var tempNextCollision = _v2.a;
					return tempNextCollision;
				case 'NoCollide':
					var tempNextCollision = _v2.a;
					return tempNextCollision;
				default:
					return $author$project$GlobalFunction$GlobalModule$NoNextCollision;
			}
		}();
		var newNeedleCollision = function () {
			switch (nextCollision.$) {
				case 'CollideAfterEvent':
					var eventID = nextCollision.a;
					var nextNextCollision = nextCollision.b;
					return _Utils_eq(
						A2($author$project$Modules$Event$ifActEventById, model, eventID),
						$author$project$Modules$Event$ActEventAct) ? $author$project$GlobalFunction$GlobalModule$Collide(nextNextCollision) : needle.collision;
				case 'NoCollideAfterEvent':
					var eventID = nextCollision.a;
					var nextNextCollision = nextCollision.b;
					return _Utils_eq(
						A2($author$project$Modules$Event$ifActEventById, model, eventID),
						$author$project$Modules$Event$ActEventAct) ? $author$project$GlobalFunction$GlobalModule$NoCollide(nextNextCollision) : needle.collision;
				default:
					return needle.collision;
			}
		}();
		var newNeedle = _Utils_update(
			needle,
			{collision: newNeedleCollision});
		var newNeedles = A3($elm$core$Array$set, id, newNeedle, model.needles);
		var newNeedlesModel = _Utils_update(
			model,
			{needles: newNeedles});
		var newPlayerModel = function () {
			if (newNeedleCollision.$ === 'Collide') {
				var tempNextCollision = newNeedleCollision.a;
				return _Utils_eq(
					A2($author$project$Modules$Player$playerIfCollidePoly, newNeedlesModel, needle),
					$author$project$GlobalFunction$GlobalBasics$NotCollided) ? newNeedlesModel : A2(
					$author$project$Modules$Sound$trigger,
					A2($author$project$Modules$Player$playerDead, newNeedlesModel, $author$project$Modules$Player$StepOnNeedle),
					$author$project$Modules$Sound$Needle);
			} else {
				return newNeedlesModel;
			}
		}();
		return newPlayerModel;
	});
var $author$project$Modules$Needle$updateOneNeedle = F2(
	function (id, model) {
		var needle = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$Needle$defNeedle,
			A2($elm$core$Array$get, id, model.needles));
		var newNeedle = A2(
			$author$project$GlobalFunction$GlobalModule$updateOneMove,
			model,
			A2($author$project$GlobalFunction$GlobalModule$updateOneVisibility, model, needle));
		var newNeedles = A3($elm$core$Array$set, id, newNeedle, model.needles);
		return A2(
			$author$project$Modules$Needle$updateOneNeedleCollision,
			id,
			_Utils_update(
				model,
				{needles: newNeedles}));
	});
var $author$project$Modules$Needle$update = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	return _Utils_Tuple2(
		A3(
			$elm$core$List$foldl,
			$author$project$Modules$Needle$updateOneNeedle,
			model,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$Array$length(model.needles) - 1)),
		cmd);
};
var $author$project$Modules$NoticeBoard$defNoticeBoard = A3(
	$author$project$Modules$NoticeBoard$quickInit,
	_Utils_Tuple2(0, 0),
	'',
	0);
var $author$project$Modules$NoticeBoard$updateOneNoticeBoardVisibility = F2(
	function (id, model) {
		var noticeBoard = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$NoticeBoard$defNoticeBoard,
			A2($elm$core$Array$get, id, model.noticeBoards));
		var nextVisibility = function () {
			var _v1 = noticeBoard.noticeBoardVisibility;
			switch (_v1.$) {
				case 'Visible':
					var info = _v1.a;
					var tempNextVisibility = _v1.b;
					return tempNextVisibility;
				case 'Invisible':
					var tempNextVisibility = _v1.a;
					return tempNextVisibility;
				default:
					return $author$project$Modules$NoticeBoard$NoNextNoticeBoardVisibility;
			}
		}();
		var newNoticeBoardVisibility = function () {
			switch (nextVisibility.$) {
				case 'VisibleAfterEvent':
					var eventID = nextVisibility.a;
					var info = nextVisibility.b;
					var nextNextVisibility = nextVisibility.c;
					return _Utils_eq(
						A2($author$project$Modules$Event$ifActEventById, model, eventID),
						$author$project$Modules$Event$ActEventAct) ? A2($author$project$Modules$NoticeBoard$Visible, info, nextNextVisibility) : noticeBoard.noticeBoardVisibility;
				case 'InvisibleAfterEvent':
					var eventID = nextVisibility.a;
					var nextNextVisibility = nextVisibility.b;
					return _Utils_eq(
						A2($author$project$Modules$Event$ifActEventById, model, eventID),
						$author$project$Modules$Event$ActEventAct) ? $author$project$Modules$NoticeBoard$Invisible(nextNextVisibility) : noticeBoard.noticeBoardVisibility;
				default:
					return noticeBoard.noticeBoardVisibility;
			}
		}();
		var newNoticeBoard = _Utils_update(
			noticeBoard,
			{noticeBoardVisibility: newNoticeBoardVisibility});
		var newNoticeBoards = A3($elm$core$Array$set, id, newNoticeBoard, model.noticeBoards);
		var newModel = _Utils_update(
			model,
			{noticeBoards: newNoticeBoards});
		return newModel;
	});
var $author$project$Modules$NoticeBoard$updateOneNoticeBoard = F2(
	function (id, model) {
		var oldNoticeBoard = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$NoticeBoard$defNoticeBoard,
			A2($elm$core$Array$get, id, model.noticeBoards));
		var newNoticeBoard = A2($author$project$GlobalFunction$GlobalModule$updateOneMove, model, oldNoticeBoard);
		var newNoticeBoards = A3($elm$core$Array$set, id, newNoticeBoard, model.noticeBoards);
		return A2(
			$author$project$Modules$NoticeBoard$updateOneNoticeBoardVisibility,
			id,
			_Utils_update(
				model,
				{noticeBoards: newNoticeBoards}));
	});
var $author$project$Modules$NoticeBoard$update = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	return _Utils_Tuple2(
		A3(
			$elm$core$List$foldl,
			$author$project$Modules$NoticeBoard$updateOneNoticeBoard,
			model,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$Array$length(model.noticeBoards) - 1)),
		cmd);
};
var $author$project$Modules$Player$updatePlayerPos = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var oldPlayer = model.player;
	var _v1 = model.player.velocity;
	var velocityX = _v1.a;
	var velocityY = _v1.b;
	var _v2 = model.player.ifChangeBackToLastPosX ? (model.player.ifChangeBackToLastPosY ? model.player.lastPos : _Utils_Tuple2(model.player.lastPos.a, model.player.pos.b)) : (model.player.ifChangeBackToLastPosY ? _Utils_Tuple2(model.player.pos.a, model.player.lastPos.b) : model.player.pos);
	var oldX = _v2.a;
	var oldY = _v2.b;
	var _v3 = _Utils_Tuple2(oldX + velocityX, oldY + velocityY);
	var newX = _v3.a;
	var newY = _v3.b;
	var newPlayer = _Utils_update(
		oldPlayer,
		{
			ifChangeBackToLastPosX: false,
			ifChangeBackToLastPosY: false,
			lastPos: _Utils_Tuple2(oldX, oldY),
			pos: _Utils_Tuple2(newX, newY)
		});
	return _Utils_Tuple2(
		_Utils_update(
			model,
			{player: newPlayer}),
		cmd);
};
var $author$project$Modules$Player$updatePlayerProperty = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var _v1 = model.player.propertyChange;
	if (_v1.$ === 'ChangeTo') {
		var newProperty = _v1.a;
		var eventID = _v1.b;
		var nextPropertyChange = _v1.c;
		if (!(!A3(
			$elm$core$Array$foldl,
			F2(
				function (actEvent, sum) {
					return _Utils_eq(actEvent.id, eventID) ? (sum + 1) : sum;
				}),
			0,
			model.actEvent))) {
			var oldPlayer = model.player;
			var newPlayer = _Utils_update(
				oldPlayer,
				{property: newProperty, propertyChange: nextPropertyChange});
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{player: newPlayer}),
				cmd);
		} else {
			return _Utils_Tuple2(model, cmd);
		}
	} else {
		return _Utils_Tuple2(model, cmd);
	}
};
var $author$project$Modules$Player$Left = {$: 'Left'};
var $elm$core$Basics$not = _Basics_not;
var $author$project$Modules$Player$playerJumpAcce = F2(
	function (model, frameNum) {
		var totalFrame = model.player.property.playerJumpFrames;
		var nowFrame = frameNum;
		var acce = (nowFrame / totalFrame) * model.player.property.playerJumpInitialAcce;
		return acce;
	});
var $author$project$Modules$Player$updatePlayerVelocity = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var velocityX = (A2($elm$core$List$member, 37, model.keyPressed) || A2($elm$core$List$member, 65, model.keyPressed)) ? ((A2($elm$core$List$member, 68, model.keyPressed) || A2($elm$core$List$member, 39, model.keyPressed)) ? 0.0 : (-model.player.property.playerHorizontalSpeed)) : ((A2($elm$core$List$member, 68, model.keyPressed) || A2($elm$core$List$member, 39, model.keyPressed)) ? model.player.property.playerHorizontalSpeed : 0.0);
	var oldPlayer = model.player;
	var newFaceDirection = (velocityX > 0) ? $author$project$Modules$Player$Right : ((velocityX < 0) ? $author$project$Modules$Player$Left : model.player.faceDirection);
	var _v1 = model.player.velocity;
	var oldVelocityX = _v1.a;
	var oldVelocityY = _v1.b;
	var _v2 = function () {
		var _v3 = model.player.jump;
		var jumpNum = _v3.a;
		var jumpFrame = _v3.b;
		return (jumpNum <= 0) ? _Utils_Tuple2(model.player.jump, oldVelocityY + model.player.property.gravityAcce) : ((A2($elm$core$List$member, 38, model.keyPressed) || A2($elm$core$List$member, 87, model.keyPressed)) ? ((_Utils_eq(jumpFrame, -1) && ((!model.player.property.ifPlayerJumpOnTheGround) || model.player.ifThisFrameOnGround)) ? _Utils_Tuple2(
			A2($author$project$Modules$Player$Jump, jumpNum, model.player.property.playerJumpFrames - 1),
			model.player.property.playerJumpInitialSpeed) : ((jumpFrame > 0) ? _Utils_Tuple2(
			A2($author$project$Modules$Player$Jump, jumpNum, jumpFrame - 1),
			(oldVelocityY + model.player.property.gravityAcce) - A2($author$project$Modules$Player$playerJumpAcce, model, jumpFrame)) : ((!jumpFrame) ? _Utils_Tuple2(
			A2($author$project$Modules$Player$Jump, jumpNum - 1, -2),
			oldVelocityY + model.player.property.gravityAcce) : _Utils_Tuple2(
			A2($author$project$Modules$Player$Jump, jumpNum, jumpFrame),
			oldVelocityY + model.player.property.gravityAcce)))) : (_Utils_eq(jumpFrame, -2) ? _Utils_Tuple2(
			A2($author$project$Modules$Player$Jump, jumpNum, -1),
			oldVelocityY + model.player.property.gravityAcce) : ((jumpFrame > 0) ? _Utils_Tuple2(
			A2($author$project$Modules$Player$Jump, jumpNum - 1, -1),
			oldVelocityY + model.player.property.gravityAcce) : _Utils_Tuple2(
			A2($author$project$Modules$Player$Jump, jumpNum, jumpFrame),
			oldVelocityY + model.player.property.gravityAcce))));
	}();
	var newJump = _v2.a;
	var velocityY = _v2.b;
	var newPlayer = _Utils_update(
		oldPlayer,
		{
			faceDirection: newFaceDirection,
			ifThisFrameOnGround: false,
			jump: newJump,
			velocity: _Utils_Tuple2(velocityX, velocityY)
		});
	var newModel = _Utils_eq(newPlayer.velocity.b, model.player.property.playerJumpInitialSpeed) ? A2(
		$author$project$Modules$Sound$trigger,
		_Utils_update(
			model,
			{player: newPlayer}),
		$author$project$Modules$Sound$Jump) : _Utils_update(
		model,
		{player: newPlayer});
	return _Utils_Tuple2(newModel, cmd);
};
var $author$project$Modules$Player$update = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var _v1 = model.player.liveState;
	switch (_v1.$) {
		case 'Live':
			return $author$project$Modules$Player$updatePlayerVelocity(
				$author$project$Modules$Player$updatePlayerPos(
					$author$project$Modules$Player$updatePlayerProperty(
						_Utils_Tuple2(model, cmd))));
		case 'Dead':
			return _Utils_Tuple2(model, cmd);
		default:
			return _Utils_Tuple2(model, cmd);
	}
};
var $author$project$Modules$SavePoint$Saved = {$: 'Saved'};
var $author$project$Modules$SavePoint$defSavePoint = $author$project$Modules$SavePoint$init(
	_Utils_Tuple2(0, 0));
var $author$project$Modules$SavePoint$updateOneSavePoint = F2(
	function (id, model) {
		var savePoint = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$SavePoint$defSavePoint,
			A2($elm$core$Array$get, id, model.savePoints));
		var status = A2($author$project$Modules$Player$playerIfCollidePoly, model, savePoint);
		var oldPlayer = model.player;
		var newPoint = _Utils_update(
			savePoint,
			{appearance: $author$project$Modules$SavePoint$Saved});
		var newPoints = A3($elm$core$Array$set, id, newPoint, model.savePoints);
		var newPlayer = _Utils_update(
			oldPlayer,
			{saveNumber: oldPlayer.saveNumber + 1});
		var newModel = _Utils_update(
			model,
			{player: newPlayer, savePoints: newPoints});
		return (_Utils_eq(status, $author$project$GlobalFunction$GlobalBasics$Collided) && _Utils_eq(savePoint.appearance, $author$project$Modules$SavePoint$Unsaved)) ? _Utils_update(
			newModel,
			{playerAtLastSavePoint: newPlayer}) : model;
	});
var $author$project$Modules$SavePoint$update = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	return _Utils_Tuple2(
		A3(
			$elm$core$List$foldl,
			$author$project$Modules$SavePoint$updateOneSavePoint,
			model,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$Array$length(model.savePoints) - 1)),
		cmd);
};
var $author$project$Modules$Sound$updateOneSoundTrigger = F2(
	function (model, soundTrigger) {
		switch (soundTrigger.$) {
			case 'Event':
				var eventId = soundTrigger.a;
				var soundEffect = soundTrigger.b;
				if (!(!A3(
					$elm$core$Array$foldl,
					F2(
						function (actEvent, sum) {
							return _Utils_eq(actEvent.id, eventId) ? (sum + 1) : sum;
						}),
					0,
					model.actEvent))) {
					switch (soundEffect.$) {
						case 'BackGround':
							return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$backGroundLength, soundEffect, soundTrigger);
						case 'Jump':
							return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$jumpLength, soundEffect, soundTrigger);
						case 'RandomBox':
							return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$randomBoxLength, soundEffect, soundTrigger);
						case 'Needle':
							return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$needleLength, soundEffect, soundTrigger);
						case 'Dead':
							return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$deadLength, soundEffect, soundTrigger);
						default:
							return A3($author$project$Modules$Sound$Activated, $author$project$Modules$Sound$swordLength, soundEffect, soundTrigger);
					}
				} else {
					return soundTrigger;
				}
			case 'Activated':
				var timeLeft = soundTrigger.a;
				var soundEffect = soundTrigger.b;
				var nextSoundTrigger = soundTrigger.c;
				return (timeLeft <= 0) ? nextSoundTrigger : A3($author$project$Modules$Sound$Activated, timeLeft - 1, soundEffect, nextSoundTrigger);
			default:
				return $author$project$Modules$Sound$None;
		}
	});
var $author$project$Modules$Sound$update = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var oldSound = model.sound;
	var newSoundTrigger = A2(
		$elm$core$List$map,
		$author$project$Modules$Sound$updateOneSoundTrigger(model),
		oldSound.soundTrigger);
	var newSound = _Utils_update(
		oldSound,
		{soundTrigger: newSoundTrigger});
	return _Utils_Tuple2(
		_Utils_update(
			model,
			{sound: newSound}),
		cmd);
};
var $author$project$Modules$Player$updateJustPlayerPos = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var oldPlayer = model.player;
	var _v1 = model.player.ifChangeBackToLastPosX ? (model.player.ifChangeBackToLastPosY ? model.player.lastPos : _Utils_Tuple2(model.player.lastPos.a, model.player.pos.b)) : (model.player.ifChangeBackToLastPosY ? _Utils_Tuple2(model.player.pos.a, model.player.lastPos.b) : model.player.pos);
	var newX = _v1.a;
	var newY = _v1.b;
	var newPlayer = _Utils_update(
		oldPlayer,
		{
			ifChangeBackToLastPosX: false,
			ifChangeBackToLastPosY: false,
			pos: _Utils_Tuple2(newX, newY)
		});
	var newModel = _Utils_update(
		model,
		{player: newPlayer});
	return _Utils_Tuple2(newModel, cmd);
};
var $author$project$Modules$SavePoint$updateReset = F2(
	function (levelInit, _v0) {
		var model = _v0.a;
		var cmd = _v0.b;
		var player = model.playerAtLastSavePoint;
		var oldSavePoints = model.savePoints;
		var oldSaveNumber = model.player.saveNumber;
		var oldDeadTimes = model.player.deadTimes;
		var lastSavePoint = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Modules$SavePoint$defSavePoint,
			A2($elm$core$Array$get, oldSaveNumber, oldSavePoints));
		var newPlayer = _Utils_update(
			player,
			{
				deadTimes: oldDeadTimes,
				pos: A2(
					$author$project$GlobalFunction$GlobalBasics$addPosPos,
					lastSavePoint.pos,
					_Utils_Tuple2(0.0, -2.0)),
				saveNumber: oldSaveNumber
			});
		var _v1 = levelInit(_Utils_Tuple0);
		var initModel = _v1.a;
		var initCmd = _v1.b;
		var newInitModel = _Utils_update(
			initModel,
			{gameControl: model.gameControl, player: newPlayer, playerAtLastSavePoint: newPlayer, savePoints: oldSavePoints});
		return _Utils_Tuple2(newInitModel, initCmd);
	});
var $author$project$Level1$Level1Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Resize':
				var width = msg.a;
				var height = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(width * 0.95, height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			case 'GetViewport':
				var viewport = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(viewport.viewport.width * 0.95, viewport.viewport.height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyUp':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$filter,
								function (x) {
									return !_Utils_eq(x, keyNum);
								},
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyDown':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$append,
								_List_fromArray(
									[keyNum]),
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Tick':
				var timePassed = msg.a;
				var _v1 = (!_Utils_eq(model.player.liveState, $author$project$Modules$Player$Dead)) ? A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					$author$project$Level1$Level1Update$checkPill(
						$author$project$Modules$Player$updateJustPlayerPos(
							$author$project$Modules$Monster$update(
								$author$project$Modules$Sound$update(
									$author$project$Modules$Needle$update(
										$author$project$Modules$NoticeBoard$update(
											$author$project$Modules$Boundary$update(
												$author$project$Modules$EndPoint$update(
													$author$project$Modules$SavePoint$update(
														$author$project$Modules$Brick$update(
															$author$project$Modules$Event$update(
																$author$project$Modules$Player$update(
																	_Utils_Tuple2(model, $elm$core$Platform$Cmd$none)))))))))))))) : A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
				var newModel = _v1.a;
				var cmd = _v1.b;
				return A2($elm$core$List$member, 82, newModel.keyPressed) ? A2(
					$author$project$Modules$SavePoint$updateReset,
					$author$project$Level1$Level1Init$init,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none)) : _Utils_Tuple2(newModel, cmd);
			default:
				var buttonMsg = msg;
				return A2(
					$author$project$Modules$GameControl$update,
					buttonMsg,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
		}
	});
var $author$project$Level2$Level2Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Resize':
				var width = msg.a;
				var height = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(width * 0.95, height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			case 'GetViewport':
				var viewport = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(viewport.viewport.width * 0.95, viewport.viewport.height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyUp':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$filter,
								function (x) {
									return !_Utils_eq(x, keyNum);
								},
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyDown':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$append,
								_List_fromArray(
									[keyNum]),
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Tick':
				var timePassed = msg.a;
				var _v1 = (!_Utils_eq(model.player.liveState, $author$project$Modules$Player$Dead)) ? A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					$author$project$Modules$Player$updateJustPlayerPos(
						$author$project$Modules$Sound$update(
							$author$project$Modules$Needle$update(
								$author$project$Modules$NoticeBoard$update(
									$author$project$Modules$Boundary$update(
										$author$project$Modules$EndPoint$update(
											$author$project$Modules$SavePoint$update(
												$author$project$Modules$Brick$update(
													$author$project$Modules$Event$update(
														$author$project$Modules$Player$update(
															_Utils_Tuple2(model, $elm$core$Platform$Cmd$none)))))))))))) : A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
				var newModel = _v1.a;
				var cmd = _v1.b;
				return A2($elm$core$List$member, 82, newModel.keyPressed) ? A2(
					$author$project$Modules$SavePoint$updateReset,
					$author$project$Level2$Level2Init$init,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none)) : _Utils_Tuple2(newModel, cmd);
			default:
				var buttonMsg = msg;
				return A2(
					$author$project$Modules$GameControl$update,
					buttonMsg,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
		}
	});
var $author$project$Level3$Level3Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Resize':
				var width = msg.a;
				var height = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(width * 0.95, height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			case 'GetViewport':
				var viewport = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(viewport.viewport.width * 0.95, viewport.viewport.height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyUp':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$filter,
								function (x) {
									return !_Utils_eq(x, keyNum);
								},
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyDown':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$append,
								_List_fromArray(
									[keyNum]),
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Tick':
				var timePassed = msg.a;
				var _v1 = (!_Utils_eq(model.player.liveState, $author$project$Modules$Player$Dead)) ? A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					$author$project$Modules$Player$updateJustPlayerPos(
						$author$project$Modules$Sound$update(
							$author$project$Modules$Needle$update(
								$author$project$Modules$NoticeBoard$update(
									$author$project$Modules$Boundary$update(
										$author$project$Modules$EndPoint$update(
											$author$project$Modules$SavePoint$update(
												$author$project$Modules$Brick$update(
													$author$project$Modules$Event$update(
														$author$project$Modules$Player$update(
															_Utils_Tuple2(model, $elm$core$Platform$Cmd$none)))))))))))) : A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
				var newModel = _v1.a;
				var cmd = _v1.b;
				return A2($elm$core$List$member, 82, newModel.keyPressed) ? A2(
					$author$project$Modules$SavePoint$updateReset,
					$author$project$Level3$Level3Init$init,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none)) : _Utils_Tuple2(newModel, cmd);
			default:
				var buttonMsg = msg;
				return A2(
					$author$project$Modules$GameControl$update,
					buttonMsg,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
		}
	});
var $author$project$Level4$Level4Update$notId = F2(
	function (id, event) {
		return !_Utils_eq(event.info.id, id);
	});
var $author$project$Level4$Level4Update$checkHelmet = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	if (A2($elm$core$List$member, 9, model.number)) {
		var oldEvent = model.event;
		var newEvent = A2(
			$elm$core$Array$filter,
			$author$project$Level4$Level4Update$notId(10),
			oldEvent);
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{event: newEvent}),
			cmd);
	} else {
		return _Utils_Tuple2(model, cmd);
	}
};
var $author$project$Level4$Level4Update$checkWin = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	return (A2($elm$core$List$member, 1, model.number) && (A2($elm$core$List$member, 2, model.number) && (A2($elm$core$List$member, 3, model.number) && (A2($elm$core$List$member, 4, model.number) && (A2($elm$core$List$member, 5, model.number) && (A2($elm$core$List$member, 6, model.number) && (A2($elm$core$List$member, 7, model.number) && (A2($elm$core$List$member, 8, model.number) && (!A2($elm$core$List$member, 10, model.number)))))))))) ? _Utils_Tuple2(
		$author$project$Modules$Player$playerWin(model),
		cmd) : _Utils_Tuple2(model, cmd);
};
var $author$project$Level4$Level4Update$countone = F2(
	function (id, model) {
		if (_Utils_eq(
			A2($author$project$Modules$Event$ifActEventById, model, id),
			$author$project$Modules$Event$ActEventAct)) {
			var num = model.number;
			return _Utils_update(
				model,
				{
					number: _Utils_ap(
						num,
						_List_fromArray(
							[id]))
				});
		} else {
			return model;
		}
	});
var $author$project$Level4$Level4Update$count = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var newmodel = A3(
		$elm$core$List$foldl,
		$author$project$Level4$Level4Update$countone,
		model,
		A2($elm$core$List$range, 1, 10));
	return _Utils_Tuple2(newmodel, cmd);
};
var $author$project$Level4$Level4Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'GetViewport':
				var viewport = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(viewport.viewport.width * 0.95, viewport.viewport.height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyUp':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$filter,
								function (x) {
									return !_Utils_eq(x, keyNum);
								},
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyDown':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$append,
								_List_fromArray(
									[keyNum]),
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Tick':
				var timePassed = msg.a;
				var _v1 = (!_Utils_eq(model.player.liveState, $author$project$Modules$Player$Dead)) ? A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					$author$project$Level4$Level4Update$checkWin(
						$author$project$Level4$Level4Update$checkHelmet(
							$author$project$Level4$Level4Update$count(
								$author$project$Modules$Player$updateJustPlayerPos(
									$author$project$Modules$Sound$update(
										$author$project$Modules$Needle$update(
											$author$project$Modules$NoticeBoard$update(
												$author$project$Modules$Boundary$update(
													$author$project$Modules$EndPoint$update(
														$author$project$Modules$SavePoint$update(
															$author$project$Modules$Brick$update(
																$author$project$Modules$Event$update(
																	$author$project$Modules$Player$update(
																		_Utils_Tuple2(model, $elm$core$Platform$Cmd$none))))))))))))))) : A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
				var newModel = _v1.a;
				var cmd = _v1.b;
				return A2($elm$core$List$member, 82, newModel.keyPressed) ? A2(
					$author$project$Modules$SavePoint$updateReset,
					$author$project$Level4$Level4Init$init,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none)) : _Utils_Tuple2(newModel, cmd);
			default:
				var buttonMsg = msg;
				return A2(
					$author$project$Modules$GameControl$update,
					buttonMsg,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
		}
	});
var $author$project$Level5$Level5Update$notId = F2(
	function (id, event) {
		return !_Utils_eq(event.info.id, id);
	});
var $author$project$Level5$Level5Update$checkBlue = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	if (A2($elm$core$List$member, 11, model.number)) {
		var oldEvent = model.event;
		var newEvent = A2(
			$elm$core$Array$filter,
			$author$project$Level5$Level5Update$notId(6),
			oldEvent);
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{event: newEvent}),
			cmd);
	} else {
		return _Utils_Tuple2(model, cmd);
	}
};
var $author$project$Level5$Level5Update$notBlueOrRed = function (brick) {
	var _v0 = brick.appearance;
	if (_v0.$ === 'Pill') {
		var color = _v0.a;
		return (color !== '#1E90FF') && (color !== '#FF0000');
	} else {
		return true;
	}
};
var $author$project$Level5$Level5Update$checkBlueAndRed = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	if (A2($elm$core$List$member, 14, model.number)) {
		var oldBricks = model.bricks;
		var newBricks = A2($elm$core$Array$filter, $author$project$Level5$Level5Update$notBlueOrRed, oldBricks);
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{bricks: newBricks}),
			cmd);
	} else {
		return _Utils_Tuple2(model, cmd);
	}
};
var $author$project$Level5$Level5Update$checkBlueOrRed = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	return (_Utils_eq(
		A2($author$project$Modules$Event$ifActEventById, model, 6),
		$author$project$Modules$Event$ActEventAct) || _Utils_eq(
		A2($author$project$Modules$Event$ifActEventById, model, 7),
		$author$project$Modules$Event$ActEventAct)) ? _Utils_Tuple2(
		A2($author$project$Modules$Player$playerKill, model, $author$project$Modules$Player$StepOnNeedle),
		cmd) : _Utils_Tuple2(model, cmd);
};
var $author$project$Level5$Level5Update$checkRed = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	if (A2($elm$core$List$member, 12, model.number)) {
		var oldEvent = model.event;
		var newEvent = A2(
			$elm$core$Array$filter,
			$author$project$Level5$Level5Update$notId(7),
			oldEvent);
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{event: newEvent}),
			cmd);
	} else {
		return _Utils_Tuple2(model, cmd);
	}
};
var $author$project$Level5$Level5Update$countone = F2(
	function (id, model) {
		if (_Utils_eq(
			A2($author$project$Modules$Event$ifActEventById, model, id),
			$author$project$Modules$Event$ActEventAct) && (!A2($elm$core$List$member, id, model.number))) {
			var num = model.number;
			return _Utils_update(
				model,
				{
					number: _Utils_ap(
						num,
						_List_fromArray(
							[id]))
				});
		} else {
			return model;
		}
	});
var $author$project$Level5$Level5Update$count = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var newmodel = A3(
		$elm$core$List$foldl,
		$author$project$Level5$Level5Update$countone,
		model,
		A2($elm$core$List$range, 1, 14));
	return _Utils_Tuple2(newmodel, cmd);
};
var $author$project$Level5$Level5Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'GetViewport':
				var viewport = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(viewport.viewport.width * 0.95, viewport.viewport.height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyUp':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$filter,
								function (x) {
									return !_Utils_eq(x, keyNum);
								},
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyDown':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$append,
								_List_fromArray(
									[keyNum]),
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Tick':
				var timePassed = msg.a;
				var _v1 = (!_Utils_eq(model.player.liveState, $author$project$Modules$Player$Dead)) ? A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					$author$project$Level5$Level5Update$checkBlueAndRed(
						$author$project$Level5$Level5Update$checkRed(
							$author$project$Level5$Level5Update$checkBlue(
								$author$project$Level5$Level5Update$checkBlueOrRed(
									$author$project$Level5$Level5Update$count(
										$author$project$Modules$Player$updateJustPlayerPos(
											$author$project$Modules$Sound$update(
												$author$project$Modules$Needle$update(
													$author$project$Modules$NoticeBoard$update(
														$author$project$Modules$Boundary$update(
															$author$project$Modules$EndPoint$update(
																$author$project$Modules$SavePoint$update(
																	$author$project$Modules$Brick$update(
																		$author$project$Modules$Event$update(
																			$author$project$Modules$Player$update(
																				_Utils_Tuple2(model, $elm$core$Platform$Cmd$none))))))))))))))))) : A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
				var newModel = _v1.a;
				var cmd = _v1.b;
				return A2($elm$core$List$member, 82, newModel.keyPressed) ? A2(
					$author$project$Modules$SavePoint$updateReset,
					$author$project$Level5$Level5Init$init,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none)) : _Utils_Tuple2(newModel, cmd);
			default:
				var buttonMsg = msg;
				return A2(
					$author$project$Modules$GameControl$update,
					buttonMsg,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
		}
	});
var $author$project$Modules$Event$deleteEventById = F3(
	function (model, flagEventId, targetEventId) {
		return _Utils_eq(
			A2($author$project$Modules$Event$ifActEventById, model, flagEventId),
			$author$project$Modules$Event$ActEventAct) ? _Utils_update(
			model,
			{
				event: A2(
					$elm$core$Array$filter,
					function (e) {
						return !_Utils_eq(e.info.id, targetEventId);
					},
					model.event)
			}) : model;
	});
var $author$project$Level6$Level6Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'GetViewport':
				var viewport = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(viewport.viewport.width * 0.95, viewport.viewport.height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyUp':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$filter,
								function (x) {
									return !_Utils_eq(x, keyNum);
								},
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyDown':
				var keyNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$append,
								_List_fromArray(
									[keyNum]),
								model.keyPressed)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Tick':
				var timePassed = msg.a;
				var _v1 = (!_Utils_eq(model.player.liveState, $author$project$Modules$Player$Dead)) ? A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					$author$project$Modules$Player$updateJustPlayerPos(
						$author$project$Modules$Sound$update(
							$author$project$Modules$Needle$update(
								$author$project$Modules$NoticeBoard$update(
									$author$project$Modules$Boundary$update(
										$author$project$Modules$EndPoint$update(
											$author$project$Modules$SavePoint$update(
												$author$project$Modules$Brick$update(
													$author$project$Modules$Event$update(
														$author$project$Modules$Player$update(
															_Utils_Tuple2(model, $elm$core$Platform$Cmd$none)))))))))))) : A2(
					$author$project$Modules$GameControl$update,
					$author$project$MainFunction$MainType$Tick(timePassed),
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
				var newModel = _v1.a;
				var cmd = _v1.b;
				if (A2($elm$core$List$member, 82, newModel.keyPressed)) {
					return A2(
						$author$project$Modules$SavePoint$updateReset,
						$author$project$Level6$Level6Init$init,
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
				} else {
					var newModel1 = A3($author$project$Modules$Event$deleteEventById, newModel, 34, 7);
					var newModel2 = A3($author$project$Modules$Event$deleteEventById, newModel1, 55, 54);
					return _Utils_Tuple2(newModel2, cmd);
				}
			default:
				var buttonMsg = msg;
				return A2(
					$author$project$Modules$GameControl$update,
					buttonMsg,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
		}
	});
var $author$project$Menu$MenuUpdate$updateButton = F2(
	function (msg, _v0) {
		var model = _v0.a;
		var cmd = _v0.b;
		switch (msg.$) {
			case 'OnMouseOver':
				var num = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							buttonState: A3($elm$core$Array$set, num, $author$project$MainFunction$MainConstant$buttonOverColor, model.buttonState)
						}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[cmd])));
			case 'OnMouseOut':
				var num = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							buttonState: A3($elm$core$Array$set, num, $author$project$MainFunction$MainConstant$buttonNormalColor, model.buttonState)
						}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[cmd])));
			case 'OnMouseDown':
				var num = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							buttonState: A3($elm$core$Array$set, num, $author$project$MainFunction$MainConstant$buttonDownColor, model.buttonState)
						}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[cmd])));
			case 'OnMouseUp':
				var num = msg.a;
				var _v2 = function () {
					switch (num) {
						case 1:
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mainStatus: $author$project$MainFunction$MainType$Level1}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
						case 2:
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mainStatus: $author$project$MainFunction$MainType$Level2}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
						case 3:
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mainStatus: $author$project$MainFunction$MainType$Level3}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
						case 4:
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mainStatus: $author$project$MainFunction$MainType$Level4}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
						case 6:
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mainStatus: $author$project$MainFunction$MainType$Level6}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
						case 5:
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mainStatus: $author$project$MainFunction$MainType$Level5}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
						default:
							return _Utils_Tuple2(
								model,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
					}
				}();
				var newModel = _v2.a;
				var newCmd = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{
							buttonState: A3($elm$core$Array$set, num, $author$project$MainFunction$MainConstant$buttonNormalColor, newModel.buttonState)
						}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[newCmd])));
			default:
				return _Utils_Tuple2(model, cmd);
		}
	});
var $author$project$Menu$MenuUpdate$updateControl = F2(
	function (msg, _v0) {
		var model = _v0.a;
		var cmd = _v0.b;
		var oldKeyPressed = model.keyPressed;
		var newKeyModel = function () {
			switch (msg.$) {
				case 'KeyUp':
					var keyNum = msg.a;
					return _Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$filter,
								function (i) {
									return !_Utils_eq(i, keyNum);
								},
								oldKeyPressed)
						});
				case 'KeyDown':
					var keyNum = msg.a;
					return _Utils_update(
						model,
						{
							keyPressed: A2(
								$elm$core$List$append,
								_List_fromArray(
									[keyNum]),
								oldKeyPressed)
						});
				default:
					return model;
			}
		}();
		var _v1 = _Utils_Tuple2(
			newKeyModel,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[cmd])));
		var newModel = _v1.a;
		var newCmd = _v1.b;
		return _Utils_Tuple2(newModel, newCmd);
	});
var $author$project$Menu$MenuUpdate$update = F2(
	function (msg, _v0) {
		var model = _v0.a;
		var cmd = _v0.b;
		switch (msg.$) {
			case 'Resize':
				var width = msg.a;
				var height = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(width * 0.95, height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			case 'GetViewport':
				var viewport = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowBoundary: _Utils_Tuple2(viewport.viewport.width * 0.95, viewport.viewport.height * 0.95)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				return A2(
					$author$project$Menu$MenuUpdate$updateControl,
					msg,
					A2(
						$author$project$Menu$MenuUpdate$updateButton,
						msg,
						_Utils_Tuple2(model, cmd)));
		}
	});
var $author$project$MainFunction$MainUpdate$update = F2(
	function (msg, model) {
		var _v0 = model.mainScene;
		switch (_v0.$) {
			case 'Menu':
				var _v1 = A2(
					$author$project$Menu$MenuUpdate$update,
					msg,
					_Utils_Tuple2(model.menuModel, $elm$core$Platform$Cmd$none));
				var newMenuModel = _v1.a;
				var cmd = _v1.b;
				return (!_Utils_eq(newMenuModel.mainStatus, $author$project$MainFunction$MainType$Menu)) ? A2(
					$author$project$MainFunction$MainUpdate$changeToLevel,
					newMenuModel.mainStatus,
					_Utils_Tuple2(
						model,
						A2($elm$core$Task$perform, $author$project$MainFunction$MainType$GetViewport, $elm$browser$Browser$Dom$getViewport))) : _Utils_Tuple2(
					_Utils_update(
						model,
						{menuModel: newMenuModel}),
					cmd);
			case 'Level1':
				var _v2 = A2($author$project$Level1$Level1Update$update, msg, model.level1Model);
				var newLevel1Model = _v2.a;
				var cmd = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{level1Model: newLevel1Model, mainScene: newLevel1Model.mainScene}),
					cmd);
			case 'Level2':
				var _v3 = A2($author$project$Level2$Level2Update$update, msg, model.level2Model);
				var newLevel2Model = _v3.a;
				var cmd = _v3.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{level2Model: newLevel2Model, mainScene: newLevel2Model.mainScene}),
					cmd);
			case 'Level3':
				var _v4 = A2($author$project$Level3$Level3Update$update, msg, model.level3Model);
				var newLevel3Model = _v4.a;
				var cmd = _v4.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{level3Model: newLevel3Model, mainScene: newLevel3Model.mainScene}),
					cmd);
			case 'Level4':
				var _v5 = A2($author$project$Level4$Level4Update$update, msg, model.level4Model);
				var newLevel4Model = _v5.a;
				var cmd = _v5.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{level4Model: newLevel4Model, mainScene: newLevel4Model.mainScene}),
					cmd);
			case 'Level6':
				var _v6 = A2($author$project$Level6$Level6Update$update, msg, model.level6Model);
				var newLevel6Model = _v6.a;
				var cmd = _v6.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{level6Model: newLevel6Model, mainScene: newLevel6Model.mainScene}),
					cmd);
			default:
				var _v7 = A2($author$project$Level5$Level5Update$update, msg, model.level5Model);
				var newLevel5Model = _v7.a;
				var cmd = _v7.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{level5Model: newLevel5Model, mainScene: newLevel5Model.mainScene}),
					cmd);
		}
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $author$project$Modules$ViewMove$deltaX = function (model) {
	var windowBoundaryX = model.windowBoundary.a;
	var playerX = model.player.pos.a;
	var levelBoundaryX = model.levelBoundary.a;
	return (_Utils_cmp(levelBoundaryX, windowBoundaryX) < 0) ? 0.0 : ((_Utils_cmp(playerX, windowBoundaryX / 2.0) < 0) ? 0.0 : ((_Utils_cmp(playerX + (windowBoundaryX / 2.0), levelBoundaryX) > 0) ? (windowBoundaryX - levelBoundaryX) : ((windowBoundaryX / 2.0) - playerX)));
};
var $author$project$Modules$ViewMove$deltaY = function (model) {
	var windowBoundaryY = model.windowBoundary.b;
	var playerY = model.player.pos.b;
	var levelBoundaryY = model.levelBoundary.b;
	return (_Utils_cmp(levelBoundaryY, windowBoundaryY) < 0) ? 0.0 : ((_Utils_cmp(playerY, windowBoundaryY / 2.0) < 0) ? 0.0 : ((_Utils_cmp(playerY + (windowBoundaryY / 2.0), levelBoundaryY) > 0) ? (windowBoundaryY - levelBoundaryY) : ((windowBoundaryY / 2.0) - playerY)));
};
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Modules$Boundary$viewOneBoundary = F4(
	function (model, anchor, area, boundaryType) {
		return A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(
						anchor.a + $author$project$Modules$ViewMove$deltaX(model))),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(
						anchor.b + $author$project$Modules$ViewMove$deltaY(model))),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(area.a)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(area.b)),
					$elm$svg$Svg$Attributes$fill(
					function () {
						switch (boundaryType.$) {
							case 'BoundaryNoCollide':
								return '#00000000';
							case 'BoundaryCollide':
								return '#000000FF';
							case 'BoundaryCollideGround':
								return '#000000FF';
							default:
								return '#FF0000';
						}
					}())
				]),
			_List_Nil);
	});
var $author$project$Modules$Boundary$view = function (model) {
	var _v0 = model.levelBoundary;
	var levelBoundaryX = _v0.a;
	var levelBoundaryY = _v0.b;
	return _List_fromArray(
		[
			A4(
			$author$project$Modules$Boundary$viewOneBoundary,
			model,
			_Utils_Tuple2($author$project$Modules$Boundary$boundaryWidth, 0),
			_Utils_Tuple2(levelBoundaryX, $author$project$Modules$Boundary$boundaryWidth),
			model.boundary.upBoundary),
			A4(
			$author$project$Modules$Boundary$viewOneBoundary,
			model,
			_Utils_Tuple2($author$project$Modules$Boundary$boundaryWidth, levelBoundaryY - $author$project$Modules$Boundary$boundaryWidth),
			_Utils_Tuple2(levelBoundaryX, $author$project$Modules$Boundary$boundaryWidth),
			model.boundary.downBoundary),
			A4(
			$author$project$Modules$Boundary$viewOneBoundary,
			model,
			_Utils_Tuple2(0, 0),
			_Utils_Tuple2($author$project$Modules$Boundary$boundaryWidth, levelBoundaryY),
			model.boundary.leftBoundary),
			A4(
			$author$project$Modules$Boundary$viewOneBoundary,
			model,
			_Utils_Tuple2(levelBoundaryX - $author$project$Modules$Boundary$boundaryWidth, 0),
			_Utils_Tuple2($author$project$Modules$Boundary$boundaryWidth, levelBoundaryY),
			model.boundary.rightBoundary)
		]);
};
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $author$project$Modules$Brick$drawPill = F3(
	function (x, y, color) {
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx(
						$elm$core$String$fromFloat(x + 10)),
						$elm$svg$Svg$Attributes$cy(
						$elm$core$String$fromFloat(y + 30)),
						$elm$svg$Svg$Attributes$r('9.5'),
						$elm$svg$Svg$Attributes$fill('#FFFFFF'),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx(
						$elm$core$String$fromFloat(x + 30)),
						$elm$svg$Svg$Attributes$cy(
						$elm$core$String$fromFloat(y + 30)),
						$elm$svg$Svg$Attributes$r('9.5'),
						$elm$svg$Svg$Attributes$fill(color),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x + 10)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y + 21)),
						$elm$svg$Svg$Attributes$width('10'),
						$elm$svg$Svg$Attributes$height('18'),
						$elm$svg$Svg$Attributes$fill('#FFFFFF')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x + 20)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y + 21)),
						$elm$svg$Svg$Attributes$width('10'),
						$elm$svg$Svg$Attributes$height('18'),
						$elm$svg$Svg$Attributes$fill(color)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + 10)),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + 20.5)),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + 30)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + 20.5)),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + 10)),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + 39.5)),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + 30)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + 39.5)),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil)
			]);
	});
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $author$project$Modules$Brick$drawSwitch1 = F3(
	function (x, y, color) {
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + 6)),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + 15)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + 31.5)),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('4')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(
						'M' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y + 40) + ('A ' + ($elm$core$String$fromFloat(20) + (' ' + ($elm$core$String$fromFloat(20) + (', 0,' + (' 0,' + (' 1, ' + ($elm$core$String$fromFloat(x + 40) + (' ' + $elm$core$String$fromFloat(y + 40)))))))))))))),
						$elm$svg$Svg$Attributes$fill(color),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + 40)),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + 40)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + 40)),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$cy(
						$elm$core$String$fromFloat(y + 6)),
						$elm$svg$Svg$Attributes$r('5'),
						$elm$svg$Svg$Attributes$fill('#00FF00'),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil)
			]);
	});
var $author$project$Modules$Brick$drawSwitch2 = F3(
	function (x, y, color) {
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + 40)),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + 6)),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + 25)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + 31.5)),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('4')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(
						'M' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y + 40) + ('A ' + ($elm$core$String$fromFloat(20) + (' ' + ($elm$core$String$fromFloat(20) + (', 0,' + (' 0,' + (' 1, ' + ($elm$core$String$fromFloat(x + 40) + (' ' + $elm$core$String$fromFloat(y + 40)))))))))))))),
						$elm$svg$Svg$Attributes$fill(color),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + 40)),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + 40)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + 40)),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx(
						$elm$core$String$fromFloat(x + 40)),
						$elm$svg$Svg$Attributes$cy(
						$elm$core$String$fromFloat(y + 6)),
						$elm$svg$Svg$Attributes$r('5'),
						$elm$svg$Svg$Attributes$fill('#FFFF00'),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil)
			]);
	});
var $elm$svg$Svg$image = $elm$svg$Svg$trustedNode('image');
var $elm$svg$Svg$Attributes$xlinkHref = function (value) {
	return A3(
		_VirtualDom_attributeNS,
		'http://www.w3.org/1999/xlink',
		'xlink:href',
		_VirtualDom_noJavaScriptUri(value));
};
var $author$project$Modules$Brick$viewOneBrick = F2(
	function (model, brick) {
		var _v0 = brick.visibility;
		switch (_v0.$) {
			case 'Visible':
				var _v1 = brick.appearance;
				switch (_v1.$) {
					case 'NormalAppearance':
						var _v2 = brick.pos;
						var brickX = _v2.a;
						var brickY = _v2.b;
						return _List_fromArray(
							[
								A2(
								$elm$svg$Svg$rect,
								A2(
									$elm$core$List$append,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$x(
											$elm$core$String$fromFloat(
												$author$project$Modules$ViewMove$deltaX(model) + brickX)),
											$elm$svg$Svg$Attributes$y(
											$elm$core$String$fromFloat(
												$author$project$Modules$ViewMove$deltaY(model) + brickY)),
											$elm$svg$Svg$Attributes$strokeWidth('2'),
											$elm$svg$Svg$Attributes$stroke('#000000'),
											$elm$svg$Svg$Attributes$fill('#00000050')
										]),
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$width(
											$elm$core$String$fromFloat($author$project$Modules$Brick$brickWidth)),
											$elm$svg$Svg$Attributes$height(
											$elm$core$String$fromFloat($author$project$Modules$Brick$brickHeight))
										])),
								_List_Nil)
							]);
					case 'Detailed':
						var width = _v1.a;
						var height = _v1.b;
						var color = _v1.c;
						var _v3 = brick.pos;
						var brickX = _v3.a;
						var brickY = _v3.b;
						return _List_fromArray(
							[
								A2(
								$elm$svg$Svg$rect,
								A2(
									$elm$core$List$append,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$x(
											$elm$core$String$fromFloat(
												$author$project$Modules$ViewMove$deltaX(model) + brickX)),
											$elm$svg$Svg$Attributes$y(
											$elm$core$String$fromFloat(
												$author$project$Modules$ViewMove$deltaY(model) + brickY)),
											$elm$svg$Svg$Attributes$strokeWidth('2'),
											$elm$svg$Svg$Attributes$stroke('#000000'),
											$elm$svg$Svg$Attributes$fill(color)
										]),
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$width(
											$elm$core$String$fromFloat(width)),
											$elm$svg$Svg$Attributes$height(
											$elm$core$String$fromFloat(height))
										])),
								_List_Nil)
							]);
					case 'Wings':
						var _v4 = brick.pos;
						var brickX = _v4.a;
						var brickY = _v4.b;
						return _List_fromArray(
							[
								A2(
								$elm$svg$Svg$image,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$x(
										$elm$core$String$fromFloat(
											$author$project$Modules$ViewMove$deltaX(model) + brickX)),
										$elm$svg$Svg$Attributes$y(
										$elm$core$String$fromFloat(
											$author$project$Modules$ViewMove$deltaY(model) + brickY)),
										$elm$svg$Svg$Attributes$width(
										$elm$core$String$fromFloat($author$project$Modules$Brick$brickWidth)),
										$elm$svg$Svg$Attributes$height(
										$elm$core$String$fromFloat($author$project$Modules$Brick$brickHeight)),
										$elm$svg$Svg$Attributes$xlinkHref('assets/images/wings2.png')
									]),
								_List_Nil)
							]);
					case 'Switch':
						var bool = _v1.a;
						var _v5 = brick.pos;
						var brickX = _v5.a;
						var brickY = _v5.b;
						var x0 = $author$project$Modules$ViewMove$deltaX(model) + brickX;
						var y0 = $author$project$Modules$ViewMove$deltaY(model) + brickY;
						return bool ? A3($author$project$Modules$Brick$drawSwitch1, x0, y0, '#00CCFF') : A3($author$project$Modules$Brick$drawSwitch2, x0, y0, '#00CCFF');
					case 'Pill':
						var color = _v1.a;
						var _v6 = brick.pos;
						var brickX = _v6.a;
						var brickY = _v6.b;
						var x0 = $author$project$Modules$ViewMove$deltaX(model) + brickX;
						var y0 = $author$project$Modules$ViewMove$deltaY(model) + brickY;
						return A3($author$project$Modules$Brick$drawPill, x0, y0, color);
					default:
						var _v7 = brick.pos;
						var brickX = _v7.a;
						var brickY = _v7.b;
						return _List_fromArray(
							[
								A2(
								$elm$svg$Svg$image,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$x(
										$elm$core$String$fromFloat(
											$author$project$Modules$ViewMove$deltaX(model) + brickX)),
										$elm$svg$Svg$Attributes$y(
										$elm$core$String$fromFloat(
											$author$project$Modules$ViewMove$deltaY(model) + brickY)),
										$elm$svg$Svg$Attributes$width(
										$elm$core$String$fromFloat($author$project$Modules$Brick$brickWidth)),
										$elm$svg$Svg$Attributes$height(
										$elm$core$String$fromFloat($author$project$Modules$Brick$brickHeight)),
										$elm$svg$Svg$Attributes$xlinkHref('assets/images/helmet.png')
									]),
								_List_Nil)
							]);
				}
			case 'Invisible':
				return _List_Nil;
			default:
				return _List_Nil;
		}
	});
var $author$project$Modules$Brick$view = function (model) {
	var bricksList = $elm$core$Array$toList(model.bricks);
	var svgBrickListList = A2(
		$elm$core$List$map,
		function (brick) {
			return A2($author$project$Modules$Brick$viewOneBrick, model, brick);
		},
		bricksList);
	return $elm$core$List$concat(svgBrickListList);
};
var $author$project$Modules$EndPoint$view = function (model) {
	var _v0 = model.endPoint.pos;
	var endPointX = _v0.a;
	var endPointY = _v0.b;
	return _List_fromArray(
		[
			A2(
			$elm$svg$Svg$image,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(
						$author$project$Modules$ViewMove$deltaX(model) + endPointX)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(
						$author$project$Modules$ViewMove$deltaY(model) + endPointY)),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat($author$project$Modules$EndPoint$endPointWidth)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat($author$project$Modules$EndPoint$endPointHeight)),
					$elm$svg$Svg$Attributes$xlinkHref('assets/images/silverDogLogo.svg')
				]),
			_List_Nil)
		]);
};
var $author$project$MainFunction$MainConstant$gameBackButton = 0;
var $author$project$MainFunction$MainConstant$gameHintButton = 2;
var $author$project$MainFunction$MainConstant$gameHintCloseButton = 3;
var $author$project$MainFunction$MainConstant$gameNextLevelButton = 1;
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$MainFunction$MainConstant$soundLouderButton = 4;
var $author$project$MainFunction$MainConstant$soundQuieterButton = 5;
var $author$project$MainFunction$MainType$OnMouseDown = function (a) {
	return {$: 'OnMouseDown', a: a};
};
var $author$project$MainFunction$MainType$OnMouseOut = function (a) {
	return {$: 'OnMouseOut', a: a};
};
var $author$project$MainFunction$MainType$OnMouseOver = function (a) {
	return {$: 'OnMouseOver', a: a};
};
var $author$project$MainFunction$MainType$OnMouseUp = function (a) {
	return {$: 'OnMouseUp', a: a};
};
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$svg$Svg$Events$onMouseDown = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$Events$onMouseOut = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseout',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$Events$onMouseOver = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $author$project$Modules$GameControl$viewOneButton = F5(
	function (model, _v0, _v1, buttonID, text) {
		var x = _v0.a;
		var y = _v0.b;
		var width = _v1.a;
		var height = _v1.b;
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y)),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(width)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(height)),
						$elm$svg$Svg$Attributes$fill(
						A2(
							$elm$core$Maybe$withDefault,
							'White',
							A2($elm$core$Array$get, buttonID, model.gameControl.buttonState)))
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x + (width / 2))),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat((y + (height / 2)) + 11.0)),
						$elm$svg$Svg$Attributes$fontSize('30'),
						$elm$svg$Svg$Attributes$textAnchor('middle'),
						$elm$svg$Svg$Attributes$fill('#e85239')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(text)
					])),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y)),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(width)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(height)),
						$elm$svg$Svg$Attributes$fill('#00000000'),
						$elm$svg$Svg$Events$onMouseOver(
						$author$project$MainFunction$MainType$OnMouseOver(buttonID)),
						$elm$svg$Svg$Events$onMouseOut(
						$author$project$MainFunction$MainType$OnMouseOut(buttonID)),
						$elm$svg$Svg$Events$onMouseDown(
						$author$project$MainFunction$MainType$OnMouseDown(buttonID)),
						$elm$svg$Svg$Events$onMouseUp(
						$author$project$MainFunction$MainType$OnMouseUp(buttonID))
					]),
				_List_Nil)
			]);
	});
var $author$project$Modules$GameControl$viewOneHintLine = F2(
	function (_v0, text) {
		var x = _v0.a;
		var y = _v0.b;
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y)),
						$elm$svg$Svg$Attributes$fontSize('30'),
						$elm$svg$Svg$Attributes$textAnchor('middle'),
						$elm$svg$Svg$Attributes$fill('#e85239')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(text)
					]))
			]);
	});
var $author$project$Modules$GameControl$viewOneHint = F2(
	function (_v0, textList) {
		var x = _v0.a;
		var y = _v0.b;
		return $elm$core$List$concat(
			A3(
				$elm$core$List$foldl,
				F2(
					function (text, _v1) {
						var list = _v1.a;
						var i = _v1.b;
						var oneText = A2(
							$author$project$Modules$GameControl$viewOneHintLine,
							_Utils_Tuple2(x, y + (50.0 * i)),
							text);
						return _Utils_Tuple2(
							A2($elm$core$List$cons, oneText, list),
							i + 1);
					}),
				_Utils_Tuple2(_List_Nil, 0),
				textList).a);
	});
var $author$project$Modules$GameControl$view = function (model) {
	var _v0 = model.windowBoundary;
	var windowBoundaryX = _v0.a;
	var windowBoundaryY = _v0.b;
	return $elm$core$List$concat(
		_List_fromArray(
			[
				A5(
				$author$project$Modules$GameControl$viewOneButton,
				model,
				_Utils_Tuple2(windowBoundaryX - 150.0, 30.0),
				_Utils_Tuple2(100.0, 50.0),
				$author$project$MainFunction$MainConstant$gameBackButton,
				'Back'),
				A5(
				$author$project$Modules$GameControl$viewOneButton,
				model,
				_Utils_Tuple2(windowBoundaryX - 150.0, 100.0),
				_Utils_Tuple2(160.0, 50.0),
				$author$project$MainFunction$MainConstant$soundLouderButton,
				'Volume +'),
				A5(
				$author$project$Modules$GameControl$viewOneButton,
				model,
				_Utils_Tuple2(windowBoundaryX - 340.0, 100.0),
				_Utils_Tuple2(160.0, 50.0),
				$author$project$MainFunction$MainConstant$soundQuieterButton,
				'Volume -'),
				function () {
				if (_Utils_eq(model.player.liveState, $author$project$Modules$Player$Win)) {
					return A5(
						$author$project$Modules$GameControl$viewOneButton,
						model,
						_Utils_Tuple2(windowBoundaryX / 2.0, (windowBoundaryY / 2.0) + 200.0),
						_Utils_Tuple2(200.0, 100.0),
						$author$project$MainFunction$MainConstant$gameNextLevelButton,
						'Next Level');
				} else {
					var _v1 = model.gameControl.controlStatus;
					if (_v1.$ === 'Normal') {
						return A5(
							$author$project$Modules$GameControl$viewOneButton,
							model,
							_Utils_Tuple2(windowBoundaryX - 340.0, 30.0),
							_Utils_Tuple2(140.0, 50.0),
							$author$project$MainFunction$MainConstant$gameHintButton,
							'Hint');
					} else {
						var n = _v1.a;
						return $elm$core$List$concat(
							_List_fromArray(
								[
									_List_fromArray(
									[
										A2(
										$elm$svg$Svg$rect,
										_List_fromArray(
											[
												$elm$svg$Svg$Attributes$x(
												$elm$core$String$fromFloat((windowBoundaryX / 2.0) - 300)),
												$elm$svg$Svg$Attributes$y(
												$elm$core$String$fromFloat((windowBoundaryY / 2.0) - 150)),
												$elm$svg$Svg$Attributes$width(
												$elm$core$String$fromFloat(600)),
												$elm$svg$Svg$Attributes$height(
												$elm$core$String$fromFloat(300)),
												$elm$svg$Svg$Attributes$fill('#FAFAFA')
											]),
										_List_Nil)
									]),
									function () {
									var hintList = A2(
										$elm$core$Maybe$withDefault,
										_List_Nil,
										$elm$core$List$head(
											A2($elm$core$List$drop, n, model.gameControl.hint)));
									return A2(
										$author$project$Modules$GameControl$viewOneHint,
										_Utils_Tuple2(windowBoundaryX / 2.0, (windowBoundaryY / 2.0) - 120),
										hintList);
								}(),
									A5(
									$author$project$Modules$GameControl$viewOneButton,
									model,
									_Utils_Tuple2((windowBoundaryX / 2.0) - 75.0, (windowBoundaryY / 2.0) + 80.0),
									_Utils_Tuple2(150.0, 50.0),
									$author$project$MainFunction$MainConstant$gameHintButton,
									'Next Hint'),
									A5(
									$author$project$Modules$GameControl$viewOneButton,
									model,
									_Utils_Tuple2((windowBoundaryX / 2.0) + 170.0, (windowBoundaryY / 2.0) + 80.0),
									_Utils_Tuple2(100.0, 50.0),
									$author$project$MainFunction$MainConstant$gameHintCloseButton,
									'Close')
								]));
					}
				}
			}()
			]));
};
var $author$project$Modules$GoldenDog$fallWords = _List_fromArray(
	[
		_List_fromArray(
		['Oh, who knew that falling into the black pit is bad?', ' Everyone but not you apparently']),
		_List_fromArray(
		['You really didn’t see the giant hole?', 'It was almost as big as the hole in your brain']),
		_List_fromArray(
		['Are you blind? It was right in front of you!']),
		_List_fromArray(
		['Timberrrrrr']),
		_List_fromArray(
		['This is not what he meant when he sang', 'I believe I can fly']),
		_List_fromArray(
		['Ouch, that’s gotta hurt']),
		_List_fromArray(
		['Thanks for throwing out the trash for me'])
	]);
var $author$project$Modules$GoldenDog$needleWords = _List_fromArray(
	[
		_List_fromArray(
		['That stings huh?']),
		_List_fromArray(
		['Congratulations, you got killed by a plant']),
		_List_fromArray(
		['That’s what you get for going vegan']),
		_List_fromArray(
		['Oh, I thought this llama was good =( ']),
		_List_fromArray(
		['Killed by a kitty cat, wow. Just wow']),
		_List_fromArray(
		['“Seriously? You died from THAT?'])
	]);
var $elm$svg$Svg$Attributes$direction = _VirtualDom_attribute('direction');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$Modules$GoldenDog$viewGoldenDog = _List_fromArray(
	[
		A2(
		$elm$svg$Svg$image,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat(10.0)),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat(-50.0)),
				$elm$svg$Svg$Attributes$width('160'),
				$elm$svg$Svg$Attributes$height('160'),
				$elm$svg$Svg$Attributes$direction('180'),
				$elm$svg$Svg$Attributes$transform('translate(170,0) scale(-1, 1)'),
				$elm$svg$Svg$Attributes$xlinkHref('assets/images/goldenDog.svg')
			]),
		_List_Nil)
	]);
var $author$project$Modules$GoldenDog$viewOneLine = F2(
	function (_v0, text) {
		var x = _v0.a;
		var y = _v0.b;
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y)),
						$elm$svg$Svg$Attributes$fontSize('20'),
						$elm$svg$Svg$Attributes$textAnchor('left'),
						$elm$svg$Svg$Attributes$fill('#e85239')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(text)
					]))
			]);
	});
var $author$project$Modules$GoldenDog$viewOneSentence = F2(
	function (textList, n) {
		var listN = $elm$core$List$length(textList);
		var chosenN = A2($elm$core$Basics$modBy, listN, n);
		var text = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$head(
				A2($elm$core$List$drop, chosenN, textList)));
		return $elm$core$List$concat(
			A2(
				$elm$core$List$map,
				function (i) {
					return A2(
						$author$project$Modules$GoldenDog$viewOneLine,
						_Utils_Tuple2(120, 20 * (i + 1.5)),
						A2(
							$elm$core$Maybe$withDefault,
							'Error',
							$elm$core$List$head(
								A2($elm$core$List$drop, i, text))));
				},
				A2(
					$elm$core$List$range,
					0,
					$elm$core$List$length(text) - 1)));
	});
var $author$project$Modules$GoldenDog$view = function (model) {
	return $elm$core$List$concat(
		_List_fromArray(
			[
				$author$project$Modules$GoldenDog$viewGoldenDog,
				function () {
				var _v0 = model.player.deadTimes;
				var deadTimes = _v0.a;
				var deadType = _v0.b;
				if (!deadTimes) {
					return _List_Nil;
				} else {
					if (deadType.$ === 'FallFromHigh') {
						return A2($author$project$Modules$GoldenDog$viewOneSentence, $author$project$Modules$GoldenDog$fallWords, deadTimes);
					} else {
						return A2($author$project$Modules$GoldenDog$viewOneSentence, $author$project$Modules$GoldenDog$needleWords, deadTimes);
					}
				}
			}()
			]));
};
var $author$project$Modules$Monster$viewOneMonster = F2(
	function (model, monster) {
		var _v0 = monster.pos;
		var monsterX = _v0.a;
		var monsterY = _v0.b;
		var _v1 = monster.appearance;
		var width = _v1.a;
		var height = _v1.b;
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$image,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(
							($author$project$Modules$ViewMove$deltaX(model) + monsterX) - 2.0)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(
							$author$project$Modules$ViewMove$deltaY(model) + monsterY)),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(width + 2.0)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(height)),
						$elm$svg$Svg$Attributes$xlinkHref('assets/images/monster.png')
					]),
				_List_Nil)
			]);
	});
var $author$project$Modules$Monster$view = function (model) {
	var monstersList = $elm$core$Array$toList(model.monsters);
	var svgMonsterList = A2(
		$elm$core$List$map,
		function (monster) {
			return A2($author$project$Modules$Monster$viewOneMonster, model, monster);
		},
		monstersList);
	return $elm$core$List$concat(svgMonsterList);
};
var $author$project$Modules$Needle$bombViewLeft = F5(
	function (x, y, w, h, color) {
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(
						'M' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y + (0.5 * h)) + (' Q ' + ($elm$core$String$fromFloat(x + (0.3 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (' ' + ($elm$core$String$fromFloat(x + (0.5 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (' L ' + ($elm$core$String$fromFloat(x + (0.85 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (' L ' + ($elm$core$String$fromFloat(x + (0.85 * w)) + (' ' + ($elm$core$String$fromFloat(y + h) + (' L ' + ($elm$core$String$fromFloat(x + (0.5 * w)) + (' ' + ($elm$core$String$fromFloat(y + h) + (' Q ' + ($elm$core$String$fromFloat(x + (0.3 * w)) + (' ' + ($elm$core$String$fromFloat(y + h) + (' ' + ($elm$core$String$fromFloat(x) + (' ' + $elm$core$String$fromFloat(y + (0.5 * h))))))))))))))))))))))))))))))))),
						$elm$svg$Svg$Attributes$fill(color),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(
						'M' + ($elm$core$String$fromFloat((x + (1.15 * w)) + 0.5) + (' ' + ($elm$core$String$fromFloat(y + (0.5 * h)) + (' Q ' + ($elm$core$String$fromFloat((x + w) + 0.5) + (' ' + ($elm$core$String$fromFloat(y + (0.1 * h)) + (' ' + ($elm$core$String$fromFloat((x + (0.85 * w)) + 0.5) + (' ' + ($elm$core$String$fromFloat(y + (0.1 * h)) + (' L ' + ($elm$core$String$fromFloat((x + (0.85 * w)) + 0.5) + (' ' + ($elm$core$String$fromFloat(y + (0.9 * h)) + (' Q ' + ($elm$core$String$fromFloat((x + w) + 0.5) + (' ' + ($elm$core$String$fromFloat(y + (0.9 * h)) + (' ' + ($elm$core$String$fromFloat((x + (1.15 * w)) + 0.5) + (' ' + $elm$core$String$fromFloat(y + (0.5 * h))))))))))))))))))))))))),
						$elm$svg$Svg$Attributes$fill('#FFFF00'),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + (0.6 * w))),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + (0.4 * h))),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + (0.6 * w))),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + (0.6 * h))),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + (0.4 * w))),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + (0.24 * h))),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat((x + (0.45 * w)) + 1)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + (0.4 * h))),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + (0.45 * w))),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + (0.4 * h))),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + (0.5 * w))),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + (0.24 * h))),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + (0.4 * w))),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + (0.76 * h))),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat((x + (0.45 * w)) + 1)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + (0.6 * h))),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + (0.45 * w))),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + (0.6 * h))),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + (0.5 * w))),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + (0.76 * h))),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil)
			]);
	});
var $author$project$Modules$Needle$bombViewUp = F5(
	function (x, y, w, h, color) {
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(
						'M' + ($elm$core$String$fromFloat(x + (0.5 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (' Q ' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y + (0.3 * h)) + (' ' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y + (0.5 * h)) + (' L ' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y + (0.85 * h)) + (' L ' + ($elm$core$String$fromFloat(x + w) + (' ' + ($elm$core$String$fromFloat(y + (0.85 * h)) + (' L ' + ($elm$core$String$fromFloat(x + w) + (' ' + ($elm$core$String$fromFloat(y + (0.5 * h)) + (' Q ' + ($elm$core$String$fromFloat(x + w) + (' ' + ($elm$core$String$fromFloat(y + (0.3 * h)) + (' ' + ($elm$core$String$fromFloat(x + (0.5 * w)) + (' ' + $elm$core$String$fromFloat(y)))))))))))))))))))))))))))))))),
						$elm$svg$Svg$Attributes$fill(color),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(
						'M' + ($elm$core$String$fromFloat(x + (0.5 * w)) + (' ' + ($elm$core$String$fromFloat((y + (1.15 * h)) + 0.5) + (' Q ' + ($elm$core$String$fromFloat(x + (0.1 * w)) + (' ' + ($elm$core$String$fromFloat((y + h) + 0.5) + (' ' + ($elm$core$String$fromFloat(x + (0.1 * w)) + (' ' + ($elm$core$String$fromFloat((y + (0.85 * h)) + 0.5) + (' L ' + ($elm$core$String$fromFloat(x + (0.9 * w)) + (' ' + ($elm$core$String$fromFloat((y + (0.85 * h)) + 0.5) + (' Q ' + ($elm$core$String$fromFloat(x + (0.9 * w)) + (' ' + ($elm$core$String$fromFloat((y + h) + 0.5) + (' ' + ($elm$core$String$fromFloat(x + (0.5 * w)) + (' ' + $elm$core$String$fromFloat((y + (1.15 * h)) + 0.5)))))))))))))))))))))))),
						$elm$svg$Svg$Attributes$fill('#FFFF00'),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + (0.4 * w))),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + (0.6 * h))),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + (0.6 * w))),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + (0.6 * h))),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + (0.24 * w))),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + (0.4 * h))),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + (0.4 * w))),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat((y + (0.45 * h)) + 1)),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + (0.4 * w))),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + (0.45 * h))),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + (0.24 * w))),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + (0.5 * h))),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + (0.76 * w))),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + (0.4 * h))),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + (0.6 * w))),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat((y + (0.45 * h)) + 1)),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(x + (0.6 * w))),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(y + (0.45 * h))),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(x + (0.76 * w))),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(y + (0.5 * h))),
						$elm$svg$Svg$Attributes$stroke('#000000'),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil)
			]);
	});
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $author$project$Modules$Needle$needleViewDown = F5(
	function (x, y, w, h, color) {
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$polygon,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						$elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y) + (', ' + ($elm$core$String$fromFloat(x + (0.125 * w)) + (' ' + ($elm$core$String$fromFloat(y + h) + (', ' + ($elm$core$String$fromFloat(x + (0.25 * w)) + (' ' + $elm$core$String$fromFloat(y))))))))))),
						$elm$svg$Svg$Attributes$fill(color)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polygon,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						$elm$core$String$fromFloat(x + (0.25 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (', ' + ($elm$core$String$fromFloat(x + (0.375 * w)) + (' ' + ($elm$core$String$fromFloat(y + h) + (', ' + ($elm$core$String$fromFloat(x + (0.5 * w)) + (' ' + $elm$core$String$fromFloat(y))))))))))),
						$elm$svg$Svg$Attributes$fill(color)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polygon,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						$elm$core$String$fromFloat(x + (0.5 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (', ' + ($elm$core$String$fromFloat(x + (0.625 * w)) + (' ' + ($elm$core$String$fromFloat(y + h) + (', ' + ($elm$core$String$fromFloat(x + (0.75 * w)) + (' ' + $elm$core$String$fromFloat(y))))))))))),
						$elm$svg$Svg$Attributes$fill(color)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polygon,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						$elm$core$String$fromFloat(x + (0.75 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (', ' + ($elm$core$String$fromFloat(x + (0.875 * w)) + (' ' + ($elm$core$String$fromFloat(y + h) + (', ' + ($elm$core$String$fromFloat(x + w) + (' ' + $elm$core$String$fromFloat(y))))))))))),
						$elm$svg$Svg$Attributes$fill(color)
					]),
				_List_Nil)
			]);
	});
var $author$project$Modules$Needle$needleViewUp = F5(
	function (x, y, w, h, color) {
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$polygon,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						$elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y + h) + (', ' + ($elm$core$String$fromFloat(x + (0.125 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (', ' + ($elm$core$String$fromFloat(x + (0.25 * w)) + (' ' + $elm$core$String$fromFloat(y + h))))))))))),
						$elm$svg$Svg$Attributes$fill(color)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polygon,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						$elm$core$String$fromFloat(x + (0.25 * w)) + (' ' + ($elm$core$String$fromFloat(y + h) + (', ' + ($elm$core$String$fromFloat(x + (0.375 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (', ' + ($elm$core$String$fromFloat(x + (0.5 * w)) + (' ' + $elm$core$String$fromFloat(y + h))))))))))),
						$elm$svg$Svg$Attributes$fill(color)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polygon,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						$elm$core$String$fromFloat(x + (0.5 * w)) + (' ' + ($elm$core$String$fromFloat(y + h) + (', ' + ($elm$core$String$fromFloat(x + (0.625 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (', ' + ($elm$core$String$fromFloat(x + (0.75 * w)) + (' ' + $elm$core$String$fromFloat(y + h))))))))))),
						$elm$svg$Svg$Attributes$fill(color)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polygon,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						$elm$core$String$fromFloat(x + (0.75 * w)) + (' ' + ($elm$core$String$fromFloat(y + h) + (', ' + ($elm$core$String$fromFloat(x + (0.875 * w)) + (' ' + ($elm$core$String$fromFloat(y) + (', ' + ($elm$core$String$fromFloat(x + w) + (' ' + $elm$core$String$fromFloat(y + h))))))))))),
						$elm$svg$Svg$Attributes$fill(color)
					]),
				_List_Nil)
			]);
	});
var $author$project$Modules$Needle$viewOneNeedle = F2(
	function (model, needle) {
		var _v0 = needle.visibility;
		switch (_v0.$) {
			case 'Visible':
				var _v1 = needle.pos;
				var needleX = _v1.a;
				var needleY = _v1.b;
				var x0 = ($author$project$Modules$ViewMove$deltaX(model) + needleX) - 2.0;
				var y0 = $author$project$Modules$ViewMove$deltaY(model) + needleY;
				var _v2 = needle.appearance;
				switch (_v2.c.$) {
					case 'Laser':
						var width = _v2.a;
						var height = _v2.b;
						var _v3 = _v2.c;
						return _List_fromArray(
							[
								A2(
								$elm$svg$Svg$rect,
								A2(
									$elm$core$List$append,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$x(
											$elm$core$String$fromFloat(
												($author$project$Modules$ViewMove$deltaX(model) + needleX) - 2.0)),
											$elm$svg$Svg$Attributes$y(
											$elm$core$String$fromFloat(
												$author$project$Modules$ViewMove$deltaY(model) + needleY)),
											$elm$svg$Svg$Attributes$strokeWidth('2'),
											$elm$svg$Svg$Attributes$stroke('#00000000'),
											$elm$svg$Svg$Attributes$fill('#FF0000FF')
										]),
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$width(
											$elm$core$String$fromFloat(width + 2.0)),
											$elm$svg$Svg$Attributes$height(
											$elm$core$String$fromFloat(height))
										])),
								_List_Nil)
							]);
					case 'BombUp':
						var width = _v2.a;
						var height = _v2.b;
						var _v4 = _v2.c;
						return A5($author$project$Modules$Needle$bombViewUp, x0, y0, width + 2.0, height, '#FF0000');
					case 'BombLeft':
						var width = _v2.a;
						var height = _v2.b;
						var _v5 = _v2.c;
						return A5($author$project$Modules$Needle$bombViewLeft, x0, y0, width + 2.0, height, '#FF0000');
					case 'Upwards':
						var width = _v2.a;
						var height = _v2.b;
						var _v6 = _v2.c;
						return A5($author$project$Modules$Needle$needleViewUp, x0, y0, width + 2.0, height, '#FF0000');
					default:
						var width = _v2.a;
						var height = _v2.b;
						var _v7 = _v2.c;
						return A5($author$project$Modules$Needle$needleViewDown, x0, y0, width + 2.0, height, '#FF0000');
				}
			case 'Invisible':
				return _List_Nil;
			default:
				return _List_Nil;
		}
	});
var $author$project$Modules$Needle$view = function (model) {
	var needlesList = $elm$core$Array$toList(model.needles);
	var svgNeedleListList = A2(
		$elm$core$List$map,
		function (needle) {
			return A2($author$project$Modules$Needle$viewOneNeedle, model, needle);
		},
		needlesList);
	return $elm$core$List$concat(svgNeedleListList);
};
var $author$project$Modules$NoticeBoard$viewOneNoticeBoard = F2(
	function (model, noticeBoard) {
		var _v0 = noticeBoard.noticeBoardVisibility;
		switch (_v0.$) {
			case 'Visible':
				var info = _v0.a;
				var nextVisibility = _v0.b;
				var _v1 = noticeBoard.pos;
				var noticeBoardX = _v1.a;
				var noticeBoardY = _v1.b;
				return _List_fromArray(
					[
						A2(
						$elm$svg$Svg$text_,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$x(
								$elm$core$String$fromFloat(
									$author$project$Modules$ViewMove$deltaX(model) + noticeBoardX)),
								$elm$svg$Svg$Attributes$y(
								$elm$core$String$fromFloat(
									$author$project$Modules$ViewMove$deltaY(model) + noticeBoardY)),
								$elm$svg$Svg$Attributes$fontSize(
								$elm$core$String$fromInt(noticeBoard.fontSize) + 'px'),
								$elm$svg$Svg$Attributes$textAnchor('middle'),
								$elm$svg$Svg$Attributes$fill('#000000')
							]),
						_List_fromArray(
							[
								$elm$svg$Svg$text(info)
							]))
					]);
			case 'Invisible':
				return _List_Nil;
			default:
				return _List_Nil;
		}
	});
var $author$project$Modules$NoticeBoard$view = function (model) {
	var noticeBoardsList = $elm$core$Array$toList(model.noticeBoards);
	var svgNoticeBoardListList = A2(
		$elm$core$List$map,
		function (noticeBoard) {
			return A2($author$project$Modules$NoticeBoard$viewOneNoticeBoard, model, noticeBoard);
		},
		noticeBoardsList);
	return $elm$core$List$concat(svgNoticeBoardListList);
};
var $elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var $author$project$Modules$Player$playerDeltaX = function (model) {
	var windowBoundaryX = model.windowBoundary.a;
	var playerX = model.player.pos.a;
	var levelBoundaryX = model.levelBoundary.a;
	return (_Utils_cmp(levelBoundaryX, windowBoundaryX) < 0) ? 0.0 : ((_Utils_cmp(playerX, windowBoundaryX / 2.0) < 0) ? 0.0 : ((_Utils_cmp(playerX + (windowBoundaryX / 2.0), levelBoundaryX) > 0) ? (windowBoundaryX - levelBoundaryX) : ((windowBoundaryX / 2.0) - playerX)));
};
var $author$project$Modules$Player$playerDeltaY = function (model) {
	var windowBoundaryY = model.windowBoundary.b;
	var playerY = model.player.pos.b;
	var levelBoundaryY = model.levelBoundary.b;
	return (_Utils_cmp(levelBoundaryY, windowBoundaryY) < 0) ? 0.0 : ((_Utils_cmp(playerY, windowBoundaryY / 2.0) < 0) ? 0.0 : ((_Utils_cmp(playerY + (windowBoundaryY / 2.0), levelBoundaryY) > 0) ? (windowBoundaryY - levelBoundaryY) : ((windowBoundaryY / 2.0) - playerY)));
};
var $author$project$Modules$Player$view = function (model) {
	var winOpacity = _Utils_eq(model.player.liveState, $author$project$Modules$Player$Win) ? 1 : 0;
	var deadOpacity = _Utils_eq(model.player.liveState, $author$project$Modules$Player$Dead) ? 1 : 0;
	var _v0 = model.windowBoundary;
	var windowBoundaryX = _v0.a;
	var windowBoundaryY = _v0.b;
	var _v1 = model.player.pos;
	var playerX = _v1.a;
	var playerY = _v1.b;
	return _List_fromArray(
		[
			A2(
			$elm$svg$Svg$image,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(
						(playerX - (model.player.property.playerWidth * 0.86)) + $author$project$Modules$Player$playerDeltaX(model))),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(
						(playerY - (model.player.property.playerHeight * 0.9)) + $author$project$Modules$Player$playerDeltaY(model))),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(model.player.property.playerWidth * 2.6)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(model.player.property.playerHeight * 2.6)),
					_Utils_eq(model.player.faceDirection, $author$project$Modules$Player$Right) ? (model.player.property.ifPlayerJumpOnTheGround ? $elm$svg$Svg$Attributes$xlinkHref('assets/images/playerRight.svg') : (model.player.property.isGreen ? $elm$svg$Svg$Attributes$xlinkHref('assets/images/playerGreenRight.png') : $elm$svg$Svg$Attributes$xlinkHref('assets/images/playerWingsRight.png'))) : (model.player.property.ifPlayerJumpOnTheGround ? $elm$svg$Svg$Attributes$xlinkHref('assets/images/playerLeft.svg') : (model.player.property.isGreen ? $elm$svg$Svg$Attributes$xlinkHref('assets/images/playerGreenLeft.png') : $elm$svg$Svg$Attributes$xlinkHref('assets/images/playerWingsLeft.png')))
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					((playerX + $author$project$Modules$Player$playerDeltaX(model)) < 350.0) ? $elm$svg$Svg$Attributes$x('0') : ((_Utils_cmp(
					(playerX + $author$project$Modules$Player$playerDeltaX(model)) + 350.0,
					windowBoundaryX) > 0) ? $elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(windowBoundaryX - 700)) : $elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(
						(playerX + $author$project$Modules$Player$playerDeltaX(model)) - 350.0))),
					(_Utils_cmp(
					playerY + $author$project$Modules$Player$playerDeltaY(model),
					windowBoundaryY / 2.0) < 0) ? $elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(
						(playerY + $author$project$Modules$Player$playerDeltaY(model)) + 30.0)) : $elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(
						(playerY + $author$project$Modules$Player$playerDeltaY(model)) - 210.0)),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(700)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(200)),
					$elm$svg$Svg$Attributes$opacity(
					$elm$core$String$fromInt(
						A2($elm$core$Basics$max, deadOpacity, winOpacity))),
					$elm$svg$Svg$Attributes$fill('#EEEEEE')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					((playerX + $author$project$Modules$Player$playerDeltaX(model)) < 350.0) ? $elm$svg$Svg$Attributes$x('350') : ((_Utils_cmp(
					(playerX + $author$project$Modules$Player$playerDeltaX(model)) + 350.0,
					windowBoundaryX) > 0) ? $elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(windowBoundaryX - 350)) : $elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(
						playerX + $author$project$Modules$Player$playerDeltaX(model)))),
					(_Utils_cmp(
					playerY + $author$project$Modules$Player$playerDeltaY(model),
					windowBoundaryY / 2.0) < 0) ? $elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(
						(playerY + $author$project$Modules$Player$playerDeltaY(model)) + 130.0)) : $elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(
						(playerY + $author$project$Modules$Player$playerDeltaY(model)) - 110.0)),
					$elm$svg$Svg$Attributes$fontSize('50'),
					$elm$svg$Svg$Attributes$textAnchor('middle'),
					$elm$svg$Svg$Attributes$fill('#000000'),
					$elm$svg$Svg$Attributes$opacity(
					$elm$core$String$fromInt(deadOpacity))
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(
					'You die! Times of death: ' + $elm$core$String$fromInt(model.player.deadTimes.a))
				])),
			A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					((playerX + $author$project$Modules$Player$playerDeltaX(model)) < 350.0) ? $elm$svg$Svg$Attributes$x('350') : ((_Utils_cmp(
					(playerX + $author$project$Modules$Player$playerDeltaX(model)) + 350.0,
					windowBoundaryX) > 0) ? $elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(windowBoundaryX - 350)) : $elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(
						playerX + $author$project$Modules$Player$playerDeltaX(model)))),
					(_Utils_cmp(
					playerY + $author$project$Modules$Player$playerDeltaY(model),
					windowBoundaryY / 2.0) < 0) ? $elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(
						(playerY + $author$project$Modules$Player$playerDeltaY(model)) + 130.0)) : $elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(
						(playerY + $author$project$Modules$Player$playerDeltaY(model)) - 110.0)),
					$elm$svg$Svg$Attributes$fontSize('50'),
					$elm$svg$Svg$Attributes$textAnchor('middle'),
					$elm$svg$Svg$Attributes$fill('#000000'),
					$elm$svg$Svg$Attributes$opacity(
					$elm$core$String$fromInt(winOpacity))
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text('You Win!')
				]))
		]);
};
var $author$project$Modules$SavePoint$viewOneSavePoint = F2(
	function (model, savePoint) {
		if (_Utils_eq(savePoint.appearance, $author$project$Modules$SavePoint$Unsaved)) {
			var saveOpacity = 0.4;
			var _v0 = savePoint.pos;
			var savePointX = _v0.a;
			var savePointY = _v0.b;
			return _List_fromArray(
				[
					A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(
								$author$project$Modules$ViewMove$deltaX(model) + savePointX)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(
								$author$project$Modules$ViewMove$deltaY(model) + savePointY)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat($author$project$Modules$SavePoint$savePointWidth)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat($author$project$Modules$SavePoint$savePointHeight)),
							$elm$svg$Svg$Attributes$xlinkHref('assets/images/save.svg')
						]),
					_List_Nil)
				]);
		} else {
			return _List_Nil;
		}
	});
var $author$project$Modules$SavePoint$view = function (model) {
	var savePointsList = $elm$core$Array$toList(model.savePoints);
	var svgSavePointListList = A2(
		$elm$core$List$map,
		function (brick) {
			return A2($author$project$Modules$SavePoint$viewOneSavePoint, model, brick);
		},
		savePointsList);
	return $elm$core$List$concat(svgSavePointListList);
};
var $elm$html$Html$audio = _VirtualDom_node('audio');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$autoplay = $elm$html$Html$Attributes$boolProperty('autoplay');
var $elm$html$Html$Attributes$controls = $elm$html$Html$Attributes$boolProperty('controls');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$Attributes$loop = $elm$html$Html$Attributes$boolProperty('loop');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Modules$Sound$viewOneSoundTrigger = function (soundTrigger) {
	switch (soundTrigger.$) {
		case 'Event':
			var eventId = soundTrigger.a;
			var soundEffect = soundTrigger.b;
			return _List_Nil;
		case 'Activated':
			var n = soundTrigger.a;
			var soundEffect = soundTrigger.b;
			var nextSoundTrigger = soundTrigger.c;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$audio,
					A2(
						$elm$core$List$append,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$controls(true),
								$elm$html$Html$Attributes$autoplay(true),
								$elm$html$Html$Attributes$loop(false)
							]),
						function () {
							switch (soundEffect.$) {
								case 'BackGround':
									return _List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/audio/backgroundMusic.ogg'),
											$elm$html$Html$Attributes$id('BackGround')
										]);
								case 'Jump':
									return _List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/audio/jumpMusic.ogg'),
											$elm$html$Html$Attributes$id('Jump')
										]);
								case 'RandomBox':
									return _List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/audio/randomBoxMusic.ogg'),
											$elm$html$Html$Attributes$id('RandomBox')
										]);
								case 'Needle':
									return _List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/audio/needleMusic.ogg'),
											$elm$html$Html$Attributes$id('Needle')
										]);
								case 'Sword':
									return _List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/audio/swordMusic.ogg'),
											$elm$html$Html$Attributes$id('Sword')
										]);
								default:
									return _List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/audio/deadMusic.ogg'),
											$elm$html$Html$Attributes$id('Dead')
										]);
							}
						}()),
					_List_Nil)
				]);
		default:
			return _List_Nil;
	}
};
var $author$project$Modules$Sound$view = function (model) {
	return $elm$core$List$concat(
		_List_fromArray(
			[
				_List_fromArray(
				[
					A2(
					$elm$html$Html$audio,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$controls(true),
							$elm$html$Html$Attributes$src('assets/audio/backgroundMusic.ogg'),
							$elm$html$Html$Attributes$id('BackGround'),
							$elm$html$Html$Attributes$autoplay(true),
							$elm$html$Html$Attributes$loop(true)
						]),
					_List_Nil)
				]),
				$elm$core$List$concat(
				A2($elm$core$List$map, $author$project$Modules$Sound$viewOneSoundTrigger, model.sound.soundTrigger))
			]));
};
var $author$project$Level1$Level1View$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'width', '95%'),
				A2($elm$html$Html$Attributes$style, 'height', '95%'),
				A2($elm$html$Html$Attributes$style, 'left', '5px'),
				A2($elm$html$Html$Attributes$style, 'top', '5px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(model.windowBoundary.a)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(model.windowBoundary.b))
					]),
				_Utils_ap(
					$author$project$Modules$Sound$view(model),
					_Utils_ap(
						$author$project$Modules$SavePoint$view(model),
						_Utils_ap(
							$author$project$Modules$Brick$view(model),
							_Utils_ap(
								$author$project$Modules$EndPoint$view(model),
								_Utils_ap(
									$author$project$Modules$Boundary$view(model),
									_Utils_ap(
										$author$project$Modules$NoticeBoard$view(model),
										_Utils_ap(
											$author$project$Modules$Needle$view(model),
											_Utils_ap(
												$author$project$Modules$Monster$view(model),
												_Utils_ap(
													$author$project$Modules$Player$view(model),
													_Utils_ap(
														$author$project$Modules$GameControl$view(model),
														$author$project$Modules$GoldenDog$view(model))))))))))))
			]));
};
var $author$project$Level2$Level2View$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'width', '95%'),
				A2($elm$html$Html$Attributes$style, 'height', '95%'),
				A2($elm$html$Html$Attributes$style, 'left', '5px'),
				A2($elm$html$Html$Attributes$style, 'top', '5px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(model.windowBoundary.a)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(model.windowBoundary.b))
					]),
				_Utils_ap(
					$author$project$Modules$Sound$view(model),
					_Utils_ap(
						$author$project$Modules$SavePoint$view(model),
						_Utils_ap(
							$author$project$Modules$Brick$view(model),
							_Utils_ap(
								$author$project$Modules$EndPoint$view(model),
								_Utils_ap(
									$author$project$Modules$Boundary$view(model),
									_Utils_ap(
										$author$project$Modules$NoticeBoard$view(model),
										_Utils_ap(
											$author$project$Modules$Needle$view(model),
											_Utils_ap(
												$author$project$Modules$Player$view(model),
												_Utils_ap(
													$author$project$Modules$GameControl$view(model),
													$author$project$Modules$GoldenDog$view(model)))))))))))
			]));
};
var $author$project$Level3$Level3View$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'width', '95%'),
				A2($elm$html$Html$Attributes$style, 'height', '95%'),
				A2($elm$html$Html$Attributes$style, 'left', '5px'),
				A2($elm$html$Html$Attributes$style, 'top', '5px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(model.windowBoundary.a)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(model.windowBoundary.b))
					]),
				_Utils_ap(
					$author$project$Modules$Sound$view(model),
					_Utils_ap(
						$author$project$Modules$SavePoint$view(model),
						_Utils_ap(
							$author$project$Modules$Brick$view(model),
							_Utils_ap(
								$author$project$Modules$Boundary$view(model),
								_Utils_ap(
									$author$project$Modules$NoticeBoard$view(model),
									_Utils_ap(
										$author$project$Modules$Needle$view(model),
										_Utils_ap(
											$author$project$Modules$Player$view(model),
											_Utils_ap(
												$author$project$Modules$GameControl$view(model),
												$author$project$Modules$GoldenDog$view(model))))))))))
			]));
};
var $author$project$Level4$Level4View$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'width', '95%'),
				A2($elm$html$Html$Attributes$style, 'height', '95%'),
				A2($elm$html$Html$Attributes$style, 'left', '5px'),
				A2($elm$html$Html$Attributes$style, 'top', '5px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(model.windowBoundary.a)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(model.windowBoundary.b))
					]),
				_Utils_ap(
					$author$project$Modules$Sound$view(model),
					_Utils_ap(
						$author$project$Modules$SavePoint$view(model),
						_Utils_ap(
							$author$project$Modules$Brick$view(model),
							_Utils_ap(
								$author$project$Modules$EndPoint$view(model),
								_Utils_ap(
									$author$project$Modules$Boundary$view(model),
									_Utils_ap(
										$author$project$Modules$NoticeBoard$view(model),
										_Utils_ap(
											$author$project$Modules$Needle$view(model),
											_Utils_ap(
												$author$project$Modules$Player$view(model),
												_Utils_ap(
													$author$project$Modules$GameControl$view(model),
													$author$project$Modules$GoldenDog$view(model)))))))))))
			]));
};
var $author$project$Level5$Level5View$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'width', '95%'),
				A2($elm$html$Html$Attributes$style, 'height', '95%'),
				A2($elm$html$Html$Attributes$style, 'left', '5px'),
				A2($elm$html$Html$Attributes$style, 'top', '5px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(model.windowBoundary.a)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(model.windowBoundary.b))
					]),
				_Utils_ap(
					$author$project$Modules$Sound$view(model),
					_Utils_ap(
						$author$project$Modules$SavePoint$view(model),
						_Utils_ap(
							$author$project$Modules$Brick$view(model),
							_Utils_ap(
								$author$project$Modules$EndPoint$view(model),
								_Utils_ap(
									$author$project$Modules$Boundary$view(model),
									_Utils_ap(
										$author$project$Modules$NoticeBoard$view(model),
										_Utils_ap(
											$author$project$Modules$Needle$view(model),
											_Utils_ap(
												$author$project$Modules$Player$view(model),
												_Utils_ap(
													$author$project$Modules$GameControl$view(model),
													$author$project$Modules$GoldenDog$view(model)))))))))))
			]));
};
var $author$project$Level6$Level6View$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'width', '95%'),
				A2($elm$html$Html$Attributes$style, 'height', '95%'),
				A2($elm$html$Html$Attributes$style, 'left', '5px'),
				A2($elm$html$Html$Attributes$style, 'top', '5px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(model.windowBoundary.a)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(model.windowBoundary.b))
					]),
				_Utils_ap(
					$author$project$Modules$Sound$view(model),
					_Utils_ap(
						$author$project$Modules$SavePoint$view(model),
						_Utils_ap(
							$author$project$Modules$Brick$view(model),
							_Utils_ap(
								$author$project$Modules$EndPoint$view(model),
								_Utils_ap(
									$author$project$Modules$Boundary$view(model),
									_Utils_ap(
										$author$project$Modules$NoticeBoard$view(model),
										_Utils_ap(
											$author$project$Modules$Needle$view(model),
											_Utils_ap(
												$author$project$Modules$Player$view(model),
												_Utils_ap(
													$author$project$Modules$GameControl$view(model),
													$author$project$Modules$GoldenDog$view(model)))))))))))
			]));
};
var $author$project$Menu$MenuView$drawLevelButton = F3(
	function (model, buttonId, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y)),
						$elm$svg$Svg$Attributes$width('250'),
						$elm$svg$Svg$Attributes$height('80'),
						$elm$svg$Svg$Attributes$fill(
						A2(
							$elm$core$Maybe$withDefault,
							'White',
							A2($elm$core$Array$get, buttonId, model.buttonState)))
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x + 125.0)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y + 45.0)),
						$elm$svg$Svg$Attributes$fontSize('30'),
						$elm$svg$Svg$Attributes$textAnchor('middle'),
						$elm$svg$Svg$Attributes$fill('#e85239')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(
						'Level ' + $elm$core$String$fromInt(buttonId))
					])),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y)),
						$elm$svg$Svg$Attributes$width('250'),
						$elm$svg$Svg$Attributes$height('80'),
						$elm$svg$Svg$Attributes$fill('#00000000'),
						$elm$svg$Svg$Events$onMouseOver(
						$author$project$MainFunction$MainType$OnMouseOver(buttonId)),
						$elm$svg$Svg$Events$onMouseOut(
						$author$project$MainFunction$MainType$OnMouseOut(buttonId)),
						$elm$svg$Svg$Events$onMouseDown(
						$author$project$MainFunction$MainType$OnMouseDown(buttonId)),
						$elm$svg$Svg$Events$onMouseUp(
						$author$project$MainFunction$MainType$OnMouseUp(buttonId))
					]),
				_List_Nil)
			]);
	});
var $author$project$MainFunction$MainConstant$menuButtonLevel1 = 1;
var $author$project$MainFunction$MainConstant$menuButtonLevel2 = 2;
var $author$project$MainFunction$MainConstant$menuButtonLevel3 = 3;
var $author$project$MainFunction$MainConstant$menuButtonLevel4 = 4;
var $author$project$MainFunction$MainConstant$menuButtonLevel5 = 5;
var $author$project$MainFunction$MainConstant$menuButtonLevel6 = 6;
var $author$project$Menu$MenuView$drawButtons = function (model) {
	var _v0 = model.windowBoundary;
	var windowBoundaryX = _v0.a;
	var windowBoundaryY = _v0.b;
	return $elm$core$List$concat(
		_List_fromArray(
			[
				A3(
				$author$project$Menu$MenuView$drawLevelButton,
				model,
				$author$project$MainFunction$MainConstant$menuButtonLevel1,
				_Utils_Tuple2(windowBoundaryX / 2, (windowBoundaryY / 1.7) - (windowBoundaryY / 7))),
				A3(
				$author$project$Menu$MenuView$drawLevelButton,
				model,
				$author$project$MainFunction$MainConstant$menuButtonLevel2,
				_Utils_Tuple2(windowBoundaryX / 2, windowBoundaryY / 1.7)),
				A3(
				$author$project$Menu$MenuView$drawLevelButton,
				model,
				$author$project$MainFunction$MainConstant$menuButtonLevel3,
				_Utils_Tuple2(windowBoundaryX / 2, (windowBoundaryY / 1.7) + (windowBoundaryY / 7))),
				A3(
				$author$project$Menu$MenuView$drawLevelButton,
				model,
				$author$project$MainFunction$MainConstant$menuButtonLevel4,
				_Utils_Tuple2((windowBoundaryX / 2) + (windowBoundaryX / 4), (windowBoundaryY / 1.7) - (windowBoundaryY / 7))),
				A3(
				$author$project$Menu$MenuView$drawLevelButton,
				model,
				$author$project$MainFunction$MainConstant$menuButtonLevel5,
				_Utils_Tuple2((windowBoundaryX / 2) + (windowBoundaryX / 4), windowBoundaryY / 1.7)),
				A3(
				$author$project$Menu$MenuView$drawLevelButton,
				model,
				$author$project$MainFunction$MainConstant$menuButtonLevel6,
				_Utils_Tuple2((windowBoundaryX / 2) + (windowBoundaryX / 4), (windowBoundaryY / 1.7) + (windowBoundaryY / 7)))
			]));
};
var $elm$html$Html$Attributes$preload = $elm$html$Html$Attributes$stringProperty('preload');
var $author$project$Menu$MenuView$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'left', '50'),
				A2($elm$html$Html$Attributes$style, 'top', '50'),
				A2($elm$html$Html$Attributes$style, 'background-image', 'url(assets/images/menuBackground.png)'),
				A2($elm$html$Html$Attributes$style, 'background-size', '100% 100%'),
				A2($elm$html$Html$Attributes$style, 'background-position', '0px 0px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$audio,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('player'),
						$elm$html$Html$Attributes$preload('auto'),
						$elm$html$Html$Attributes$autoplay(true),
						$elm$html$Html$Attributes$loop(true)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(model.windowBoundary.a)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(model.windowBoundary.b))
					]),
				$author$project$Menu$MenuView$drawButtons(model))
			]));
};
var $author$project$MainFunction$MainView$view = function (model) {
	var _v0 = model.mainScene;
	switch (_v0.$) {
		case 'Menu':
			return $author$project$Menu$MenuView$view(model.menuModel);
		case 'Level1':
			return $author$project$Level1$Level1View$view(model.level1Model);
		case 'Level2':
			return $author$project$Level2$Level2View$view(model.level2Model);
		case 'Level3':
			return $author$project$Level3$Level3View$view(model.level3Model);
		case 'Level4':
			return $author$project$Level4$Level4View$view(model.level4Model);
		case 'Level6':
			return $author$project$Level6$Level6View$view(model.level6Model);
		default:
			return $author$project$Level5$Level5View$view(model.level5Model);
	}
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$MainFunction$MainInit$init, subscriptions: $author$project$MainFunction$MainSubscriptions$subscriptions, update: $author$project$MainFunction$MainUpdate$update, view: $author$project$MainFunction$MainView$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));