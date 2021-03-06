const { T, isNil } = require('./type');
const { conv } = require('./conv');

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
        let value = conv(target), type = T(value);
        return { status: 'ok', value, type };
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
        return conv(item.value);
    }
}

module.exports = {
    pick, inject, INVALID
};