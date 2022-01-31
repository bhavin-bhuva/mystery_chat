exports.page = (params) => {
  let limit = params.limit ? params.limit : 50;
  let page = params.page ? params.page : 1;
  let offset = 0 + (page - 1) * limit;
  return { limit: limit, offset: offset };
};
