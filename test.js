const _ = require("lodash");

function reMapping(data, mapping) {
  const d = _.cloneDeep(data);
  if (!_.isEmpty(mapping)) {
    for (const [oldPath, newPath] of Object.entries(mapping)) {
      _.updateWith(data, newPath, _.constant(_.get(d, oldPath)), Object);
    }
    data = _.omit(data, Object.keys(mapping));
  }
  return data;
}

var object = { a: { a1: 2, a2: 2 }, b: "2", c: 3 };

var r = reMapping(object, { "a.a1": "a.a11" });

console.log(r);
