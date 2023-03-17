module.exports = (sequelize, type) => {
  return sequelize.define("bid", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: type.STRING,
      defaultValue: 'Applied',
    },
    helperfcm:type.STRING,
  });
};
