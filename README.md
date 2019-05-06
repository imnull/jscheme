# JScheme
**JSON data structure-tool** 

*JScheme也可以处理常见的JavaScript对象*

这是个用来解构和操作JSON对象这种嵌套结构的工具。

## path

Path是一个中间件，用来打散嵌套结构的对象。Path的第2个参数(true|false)，会决定是否按内置对象`PathItem`来返回结果。

```js 
const { path } = require('./path');
let a = {
	zz: null,
	aa: 1,
	bb: '222',
	cc: [1, 2, 3, {
		aaa: 1,
		ccc: 3
	}],
	dd: 4,
	ee: [1, {
		aaa: 1,
		ccc: [9, 8, 7]
	}],
	ff: [-1, -3, -5],
	gg: 1
};

console.log(path(a, false));

// 输出
[ { path: [ 'zz' ], value: null, type: 'Null' },
  { path: [ 'aa' ], value: 1, type: 'Number' },
  { path: [ 'bb' ], value: '222', type: 'String' },
  { path: [ 'cc', 0 ], value: 1, type: 'Number' },
  { path: [ 'cc', 1 ], value: 2, type: 'Number' },
  { path: [ 'cc', 2 ], value: 3, type: 'Number' },
  { path: [ 'cc', 3, 'aaa' ], value: 1, type: 'Number' },
  { path: [ 'cc', 3, 'ccc' ], value: 3, type: 'Number' },
  { path: [ 'dd' ], value: 4, type: 'Number' },
  { path: [ 'ee', 0 ], value: 1, type: 'Number' },
  { path: [ 'ee', 1, 'aaa' ], value: 1, type: 'Number' },
  { path: [ 'ee', 1, 'ccc', 0 ], value: 9, type: 'Number' },
  { path: [ 'ee', 1, 'ccc', 1 ], value: 8, type: 'Number' },
  { path: [ 'ee', 1, 'ccc', 2 ], value: 7, type: 'Number' },
  { path: [ 'ff', 0 ], value: -1, type: 'Number' },
  { path: [ 'ff', 1 ], value: -3, type: 'Number' },
  { path: [ 'ff', 2 ], value: -5, type: 'Number' },
  { path: [ 'gg' ], value: 1, type: 'Number' } ]
```

## Scheme

```js
const Scheme = require('./scheme');
let a = { zz: null, aa: 1, bb: '222', cc: [1,2,3,{aaa:1,ccc:3}], dd: 4, ee: [1,{ aaa: 1,ccc:[9,8,7] }], ff: [-1, -3, -5],gg:1 };
let b = { aa: 1, bb: 3, cc: [2,3,3,{aaa:1,bbb:2}], ee: [1,{ bbb: 2, ccc: [7,8,9]}], ff: [,2,],gg:'gg',zzz: 1 };

let scheme = new Scheme(a);

let r = scheme.diff(b);
console.log('// -----diff------')
console.log(r);
console.log(r.ee);

r = scheme.diff(b, false);
console.log('// -----diff no fix------')
console.log(r);
console.log(r.ee);

r = scheme.combin(b);
console.log('// -----combin------')
console.log(r);
console.log(r.ee);

r = scheme.pick(b);
console.log('// -----pick------')
console.log(r);
console.log(r.ee);
```
```
// 输出
// -----diff------
{ bb: 3,
  cc: [ 2, 3, 3, { bbb: 2 } ],
  ee: [ 1, { bbb: 2, ccc: [Array] } ],
  ff: [ -1, 2, -5 ],
  gg: 'gg',
  zzz: 1 }
[ 1, { bbb: 2, ccc: [ 7, 8, 9 ] } ]
// -----diff no fix------
{ bb: 3,
  cc: [ 2, 3, <1 empty item>, { bbb: 2 } ],
  ee: [ <1 empty item>, { bbb: 2, ccc: [Array] } ],
  ff: [ <1 empty item>, 2 ],
  gg: 'gg',
  zzz: 1 }
[ <1 empty item>, { bbb: 2, ccc: [ 7, <1 empty item>, 9 ] } ]
// -----combin------
{ zz: null,
  aa: 1,
  bb: 3,
  cc: [ 2, 3, 3, { aaa: 1, ccc: 3, bbb: 2 } ],
  dd: 4,
  ee: [ 1, { aaa: 1, ccc: [Array], bbb: 2 } ],
  ff: [ -1, 2, -5 ],
  gg: 'gg',
  zzz: 1 }
[ 1, { aaa: 1, ccc: [ 7, 8, 9 ], bbb: 2 } ]
// -----pick------
{ zz: null,
  aa: 1,
  bb: '3',
  cc: [ 2, 3, 3, { aaa: 1, ccc: 3 } ],
  dd: 4,
  ee: [ 1, { aaa: 1, ccc: [Array] } ],
  ff: [ -1, 2, -5 ],
  gg: 1 }
[ 1, { aaa: 1, ccc: [ 7, 8, 9 ] } ]
```

## conv