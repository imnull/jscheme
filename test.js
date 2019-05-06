const { Scheme, path, convEnable, convExtend } = require('./index');

// 开启格式转换
convEnable(true);

// 扩展conv的类型方法
convExtend('String', (v, base) => {
    return base(v);
})

let a = { zz: '2019-05-06T10:46:29.004Z', aa: 1, bb: '222', cc: [1,2,3,{aaa:1,ccc:3}], dd: 4, ee: [1,{ aaa: 1,ccc:[9,8,7] }], ff: [-1, -3, -5],gg:1 };
let b = { aa: 1, bb: 3, cc: [2,3,3,{aaa:1,bbb:2}], ee: [1,{ bbb: 2, ccc: [7,8,9]}], ff: [,2,],gg:'gg',zzz: 1 };

// a.a = a;

let scheme = new Scheme(a);

console.log('// -----path------')
console.log(path(a, 0));

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
