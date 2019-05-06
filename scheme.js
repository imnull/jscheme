const { isNil, isInvalid, equalArray } = require('./type');
const { path } = require('./path');
const { pick, inject } = require('./pick-and-inject');

const path2 = v => path(v).filter(({ value }) => typeof(value) !== 'undefined');

/**
 * 对路径中右侧的字符串key做trim
 * @param {Array} p 路径
 */
const trim_arr_path_right = p => {
    p = [...p];
    while(p.length > 0 && typeof(p[p.length - 1]) !== 'number'){
        p.pop();
    }
    return p;
}
/**
 * 补全数组路径，使数组下标连续。
 * @param {Array} ps 新的路径集合
 * @param {*} scheme 原路径集合
 */
const fix_arr_path = (ps, scheme) => {
    let trim_ps = ps.filter(p => p.path.some(p => typeof(p) === 'number')).map(p => trim_arr_path_right(p.path));
    let scheme_trim = scheme.filter(p => p.path.some(p => typeof(p) === 'number'));

    scheme_trim.forEach(sch => {
        if(!trim_ps.some(p => equalArray(trim_arr_path_right(sch.path), p))){
            ps.push(sch.clone());
        }
    });
    return ps;
}

const conv_default = {
    'Number': (value, defaultValue) => {
        return isNil(value) || isNaN(value = Number(value)) ? defaultValue : value;
    },
    'String': (value, defaultValue) => {
        if(isInvalid(value)){
            return defaultValue;
        }
        return value.toString();
    }
};

class Scheme {
    constructor(scheme, conv = {}){
        this.initScheme(scheme);
        this.initConv(conv);
    }

    initScheme(scheme){
        this.scheme = path2(scheme);
    }
    initConv(conv){
        this.conv = { ...conv_default, ...conv };
    }

    combin(target){
        let r, a = this.scheme.map(it => it.clone()), b = path2(target);
        b.forEach(bb => {
            let idx = a.findIndex(aa => equalArray(aa.path, bb.path));
            if(idx > -1){
                if(a[idx].value !== bb.value){
                    a.splice(idx, 1, bb);
                }
            } else {
                a.push(bb);
            }
        });

        a.forEach(sch => {
            r = inject(r, sch, 0)
        });
        return r;
    }

    pick(target){
        let r, { conv } = this;
        this.scheme.forEach(sch => {
            let source = pick(target, sch, 0);
            // console.log({ scheme, source })
            let { value } = source, { path, type } = sch;
            // ** 取值转换 **
            // 成功取到分支值
            if(source.status === 'ok'){
                // 如果类型不一致
                if(source.type !== type){
                    //如果具备默认转换方法
                    if(type in conv){
                        value = conv[type](value, sch.value, sch.path);
                    }
                }
            }
            r = inject(r, { path, value }, 0)
        });
        return r;
    }

    diff(target, fix_arr = true){
        let r;
        let p = path(target).filter(sch => !this.scheme.some(s => s.equal(sch)));
        if(fix_arr){
            p = fix_arr_path(p, this.scheme);
        }
        p.forEach(sch => r = inject(r, sch, 0));
        return r;
    }
}

module.exports = Scheme;