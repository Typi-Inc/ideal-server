import falcor from 'falcor';
const $ref = falcor.Model.ref;

export default json => {
  const pathValues = [];
  let shouldCreateNewPathValue = true;
  const currentPath = [];
  const pushValue = value => {
    shouldCreateNewPathValue = true;
    pathValues[pathValues.length - 1].value = value;
  };
  const getRefKey = obj => {
    let result = false;
    for (const key in obj) {
      if (key.includes('path')) {
        result = key;
        return result;
      }
    }
  };
  const compile = value => {
    if (value && (value.constructor === Object)) {
      const refKey = getRefKey(value);
      if (refKey) {
        pushValue($ref(value[refKey]));
      } else {
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
      }
    } else if (value && (value.constructor === Array)) {
      console.log('in Array ............................');
      pushValue($ref(value));
    } else {
      pushValue(value);
    }
  };
  compile(json.json);
  return pathValues;
};
