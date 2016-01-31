import falcor from 'falcor';
import _ from 'lodash';

const $ref = falcor.Model.ref;
const $atom = falcor.Model.atom;
const $error = falcor.Model.error;
const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

export default function toPathValues(json, pathSet) {
  if (!pathSet) {
    return toPathValuesWithoutPathSet(json);
    // return new Error('pathSet must not be falsy');
  }
  if (pathSet.constructor !== Array) {
    return new Error('pathSet must be an instance of an Array');
  }
  if (!json) {
    return [];
  }
  const pathValues = [];
  for (const path of all(pathSet)) {
    const value = getValue(_.get(json.json, path));
    if (value) {
      pathValues.push({
        path,
        value
      });
    }
  }
  return pathValues;
}

function getValue(thing) {
  if (!thing) {
    return;
  }
  if (thing.constructor === String || _.isNumber(thing)) {
    return thing;
  }
  if (thing.constructor === Array) {
    const mayBeId = thing[1];
    if (mayBeId && _.isString(mayBeId) &&
        (_.startsWith(mayBeId, 'auth0|') || _.startsWith(mayBeId, 'facebook|') || mayBeId.match(uuidRegex))
    ) {
      return $ref(thing);
    }
    return $atom(thing);
  }
  if (thing.constructor === Object) {
    return $atom(thing);
  }
  return thing;
}

function* all(pathSet, pointer = 0, path = []) {
  if (pointer >= pathSet.length) {
    yield path.slice();
  } else {
    const thing = pathSet[pointer];
    for (const x of iterateThing(thing)) {
      path.push(x);
      yield* all(pathSet, pointer + 1, path);
      path.pop();
    }
  }
}

function* iterateThing(thing) {
  if (Array.isArray(thing)) {
    for (const subthing of thing) {
      yield* iterateThing(subthing);
    }
  } else if (isRange(thing)) {
    const { from, to } = thing;
    for (let i=from; i<=to; i++) {
      yield i;
    }
  } else {
    yield thing;
  }
}

function isRange(thing) {
  return thing && typeof thing.from === 'number';
}

function toPathValuesWithoutPathSet(json) {
  const pathValues = [];
  let shouldCreateNewPathValue = true;
  const currentPath = [];
  const pushValue = value => {
    shouldCreateNewPathValue = true;
    pathValues[pathValues.length - 1].value = value;
  };
  const compile = value => {
    if (value && (value.constructor === Object)) {
      for (const key in value) {
        if (!key.includes('key') && !key.includes('parent')) {
          currentPath.push(key);
          if (shouldCreateNewPathValue) {
            pathValues[pathValues.length] = {
              path: currentPath.slice(),
              value: null
            };
          } else {
            pathValues[pathValues.length - 1].path.push(key);
          }
          shouldCreateNewPathValue = false;
          compile(value[key]);
          currentPath.pop();
        }
      }
    } else if (value && (value.constructor === Array)) {
      const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;
      if (value[1] && _.isString(value[1]) &&
        (value[1].match(uuidRegex) || _.startsWith(value[1], 'auth0|') || _.startsWith(value[1], 'facebook|'))
      ) {
        pushValue($ref(value));
      } else {
        pushValue($atom(value));
      }
    } else {
      pushValue(value);
    }
  };
  // TODO what if json is undefined?
  compile(json.json);
  return pathValues;
}
