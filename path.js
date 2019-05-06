const { T } = require('./type');
const { equalArray } = require('./type');

class PathItem {
    constructor(path, value, type){
        this.path = [ ...path ];
        this.value = value;
        this.type = type;
    }

    clone(){
        return new PathItem(this.path, this.value, this.type)
    }

    equal(item){
        return this.value === item.value && equalArray(this.path, item.path);
    }
}
PathItem.create = ({ path, value, type }) => new PathItem(path, value, type);

const PATH = {
    'Array': (v, b, p, t) => {
        v.forEach((vv, i) => _path(vv, [...b, i], p, t));
    },
    'Object': (v, b, p, t) => {
        Object.keys(v).forEach(i => _path(v[i], [...b, i], p, t))
    }
};

const _path = (v, b, p, trap) => {
    let t = T(v);
    if(t in PATH){
        if(trap.indexOf(v) > -1){
            p.push({ path: b, value: v, type: T(v) });
        } else {
            trap.push(v);
            PATH[t](v, b, p, trap);
        }
    } else {
        p.push({ path: b, value: v, type: T(v) });
    }
}

const path = (v, asItem = true) => {
    let b = [], p = [], t = [];
    _path(v, b, p, t);
    if(asItem){
        p = p.map(it => PathItem.create(it));
    }
    return p;
};

module.exports = {
    path
};