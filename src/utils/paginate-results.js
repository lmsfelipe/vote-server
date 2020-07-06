module.exports = (first, data) => {
  const hasNextPage = data.length > first;

  // It removes last payload item to correspond `first` argument
  if (hasNextPage) {
    data.pop();
  }

  const edges = data.map((item) => ({
    cursor: item._id,
    node: item,
  }));

  const pageInfo = {
    hasNextPage,
    endCursor: data[data.length - 1]._id,
  };

  // Returns object of relay cursor connections specification
  return {
    edges,
    pageInfo,
  };
};
