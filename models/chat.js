module.exports = (sequelize, type) => {
  return sequelize.define("chat", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    // name: {
    //   type: type.STRING,
    // },
    // helperid: {
    //   type: type.STRING,

    // },
    userid: {
      type: type.TEXT,
    },
    bookingid: {
      type: type.TEXT,
    },
    usertype: type.TEXT,
    message: {  type: type.TEXT,
    //  defaultValue: [],
    //
      // usertype: {
      //   type: type.STRING,
      // },
      // messages: {
      //   type:  type.STRING,
      // },
    },

   
    userpic: {
      type: type.TEXT,
    },

    // location: type.GEOMETRY('POINT'),
  });
};
