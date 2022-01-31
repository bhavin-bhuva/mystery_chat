const models = require('../models');

const get_detail_by_id = async (modelName, id) => {
  let whereOps = { id };
  return new Promise(async function (resolve, reject) {
    await models[modelName]
      .findOne({
        attributes: models[modelName].allAttributes(),
        where: whereOps,
      })
      .then((data) => {
        resolve(data);
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

module.exports = { get_detail_by_id };
