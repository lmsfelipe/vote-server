exports.groupById = (data) => {
  const valueMap = {};

  data.forEach((value) => {
    valueMap[value._id] = value;
  });

  return valueMap;
};
