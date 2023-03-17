module.exports = (sequelize, type) => {
  return sequelize.define("notification", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    text: type.STRING,
    status: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
  });
};
