module.exports = (sequelize, type) => {
  return sequelize.define("user", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: type.STRING,
    email: type.STRING,
    password: type.STRING,
    phone: type.STRING,
    countryCode: type.STRING,
    countryISOCode: type.STRING,
    personnummer: type.STRING,
    address: type.TEXT,
    idCard: type.STRING,
    avatar: type.STRING,
    role: type.STRING,
    token: type.TEXT,
    accountId: type.TEXT,
    status: {
      type: type.STRING,
      defaultValue: "Active",
    },
    helperService: type.STRING,
    vehicleImages: type.TEXT,
    vehicleReg: type.STRING,
    rating: {
      type: type.STRING,
      defaultValue: "0.0",
    },
    numbersOfJobs: {
      type: type.INTEGER,
      defaultValue: 0,
    },
  });
};
