export function arrayToFalcorString(arr) {
  let result = '"';
  result += arr.join('","');
  result += '"';
  return result;
}

export function parseFilterAndSort(str) {
  const result = {
    filter: null,
    sort: null
  };
  str.split('&').forEach(filterOrSort => {
    if (filterOrSort.includes('where')) {
      const filter = {};
      filterOrSort.
        replace('where:', '').
        split(',').
        forEach(filterString => {
          const keyValue = filterString.split('=');
          filter[keyValue[0]] = keyValue[1];
        });
      result.filter = filter;
    } else if (filterOrSort.includes('sort')) {
      const sort = {};
      const keyValue = filterOrSort.
        replace('sort:', '').
        split('=');
      sort.field = keyValue[0];
      if (keyValue[1] === 'asc' || keyValue[1] === 'desc') {
        sort.order = keyValue[1];
      } else {
        // TODO ERROR
      }
      result.sort = sort;
    } else {
      // TODO ERROR
    }
  });
  return result;
}
