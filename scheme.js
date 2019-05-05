const { T, isNil, isInvalid } = require('./t');
const { path } = require('./path');

const INVALID = Object.create(null);

const pick = (target, item, cursor) => {
    if(isNil(target)){
        return { status: 'nil', value: item.value };
    } else if(target === INVALID){
        return { status: 'invalid', value: item.value };
    }
    let { path } = item;
    if(cursor < path.length){
        let key = path[cursor];
        let value = target.hasOwnProperty(key) ? target[key] : INVALID;
        return pick(value, item, cursor + 1);
    } else {
        return { status: 'ok', value: target, type: T(target) };
    }
}
const inject = (target, item, cursor) => {
    let { path } = item;
    if(cursor < path.length){
        let key = path[cursor];
        if(isNil(target) || target === INVALID){
            target = typeof(key) === 'string' ? {} : [];
        }
        target[key] = inject(target[key], item, cursor + 1);
        return target;
    } else {
        return item.value;
    }
}

const equal_arr = (a, b) => a.length === b.length && a.every((v, i) => b[i] === v);

const equal = (a, b) => {
    return a.value === b.value && equal_arr(a.path, b.path)
}

const clone_item = ({ path, value }) => ({ path: [...path], value });
const combin = (a, b) => {
    a = a.map(it => clone_item(it));
    b.forEach(bb => {
        let idx = a.findIndex(aa => equal_arr(aa.path, bb.path));
        if(idx > -1){
            if(a[idx].value !== bb.value){
                a.splice(idx, 1, clone_item(bb));
            }
        } else {
            a.push(clone_item(bb));
        }
    });
    return a;
}

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
 * 补全数组路径
 * @param {Array} ps 新的路径集合
 * @param {*} scheme 原路径集合
 */
const fix_arr_path = (ps, scheme) => {
    let trim_ps = ps.filter(p => p.path.some(p => typeof(p) === 'number')).map(p => trim_arr_path_right(p.path));
    let scheme_trim = scheme.filter(p => p.path.some(p => typeof(p) === 'number'));

    scheme_trim.forEach(sch => {
        if(!trim_ps.some(p => equal_arr(trim_arr_path_right(sch.path), p))){
            ps.push(clone_item(sch));
        }
    });
    return ps;
}

const CONVERT = {
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
        this.conv = { ...CONVERT, ...conv };
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

    combin(target){
        let r;
        combin(this.scheme, path2(target)).forEach(sch => {
            r = inject(r, sch, 0)
        });
        return r;
    }

    diff(target, fix_arr = true){
        let r;
        let p = path(target).filter(sch => !this.scheme.some(s => equal(sch, s)));
        if(fix_arr){
            p = fix_arr_path(p, this.scheme);
        }
        p.forEach(sch => r = inject(r, sch, 0));
        return r;
    }
}

module.exports = Scheme;