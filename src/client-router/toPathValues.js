import falcor from 'falcor';
import _ from 'lodash';

const $ref = falcor.Model.ref;
const $atom = falcor.Model.atom;

export default json => {
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
};
