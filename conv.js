const { T } = require('./type');

const CONV = {
    'String': (value) => {
        if(
            /^\d{4}-\d{2}-\d{2}(T|[^\w])\d{2}:\d{2}(:\d{2}(\.\d+)?)?Z?$/.test(value)
        ){
            let v = Date.parse(value);
            if(!isNaN(v)){
                value = new Date(v);
            }
        }
        return value;
    }
};

const CONFIG = {
    enabled: false
};

module.exports = {
    conv: v => {
        if(!CONFIG.enabled) return v;
        let t = T(v);
        return t in CONV ? CONV[t](v) : v;
    },
    convExtend: (name, fn) => {
        let f = CONV[name];
        return CONV[name] = (v) => fn(v, f);
    },
    convEnable: b => CONFIG.enabled = !!b,
};