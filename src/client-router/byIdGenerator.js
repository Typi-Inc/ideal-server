import forward from './forwardToServerModel';

function byIdGenerator(entityPlural) {
  return [
    {
      route: `${entityPlural}ById[{keys:dealIds}][{keys:fields}]`,
      get(pathSet) {
        return forward.call(this, pathSet);
      }
    },
    {
      route: `${entityPlural}ById[{keys:dealIds}][{keys:fields}].edges[{integers:commentRange}]`, // .comments.edges[{integers:commentRange}]
      get(pathSet) {
        return forward.call(this, pathSet);
      }
    },
    {
      route: `${entityPlural}ById[{keys:dealIds}][{keys:fields}][{keys:fieldProps}]`, // .comments.count
      get(pathSet) {
        return forward.call(this, pathSet);
      }
    }
  ];
}

export default byIdGenerator;
