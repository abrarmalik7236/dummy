module.exports = (sequelize, type) => {
  return sequelize.define("post_feedback", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    review: type.TEXT,
    rating: type.STRING,
  });
};
