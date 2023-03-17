module.exports = (sequelize, type) => {
  return sequelize.define("admin", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: type.STRING,
    email: type.STRING,
    password: type.STRING,
    avatar: type.STRING,
    status: {
      type: type.STRING,
      defaultValue: "active",
    },
  });
};
