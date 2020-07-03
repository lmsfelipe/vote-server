module.exports = async (args, model) => {
  const { first = 5, after } = args;

  const query = after ? { _id: { $gt: after } } : {};
  const resp = await model
    .find(query)
    .limit(first + 1) // Increase 1 to check if has more results
    .lean();

  const hasNextPage = resp.length > first;

  // It removes last payload item to correspond `first` argument
  if (hasNextPage) {
    resp.pop();
  }

  const edges = resp.map((item) => ({
    cursor: item._id,
    node: item,
  }));

  const pageInfo = {
    hasNextPage,
    endCursor: resp[resp.length - 1]._id,
  };

  // Returns using relay cursor connections specification
  return {
    edges,
    pageInfo,
  };
};
