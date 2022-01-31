const { Op } = require('sequelize');

exports.searchQuery = (searchData) => {
  let search = searchData.split(' ');
  if (search.length == 1) {
    return { [Op.iLike]: '%' + search[0] + '%' };
  } else {
    let arrSearch = search.map((i) => '%' + i + '%');
    return { [Op.iLike]: { [Op.any]: arrSearch } };
  }
};
