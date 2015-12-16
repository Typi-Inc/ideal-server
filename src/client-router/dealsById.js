import forward from './forwardToServerModel';

const dealsById = [
  {
    route: 'dealsById[{keys:dealIds}][{keys:fields}]',
    get(pathSet) {
      return forward.call(this, pathSet);
    }
  },
  {
    route: 'dealsById[{keys:dealIds}].comments[{integers:commentRange}]',
    get(pathSet) {
      return forward.call(this, pathSet);
    }
  }
];

export default dealsById;
