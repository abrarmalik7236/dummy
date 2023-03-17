const Sequelize = require("sequelize");
// Models
const UserModel = require("./models/user");
const PostModel = require("./models/post");
const NotificationModel = require("./models/notification");
const BidModel = require("./models/bid");
const PostFeedbackModel = require("./models/post_feedback");
const ChatModel = require("./models/chat");

const AdminModel = require("./models/admin");

//Connection for local
// const sequelize = new Sequelize('move_time', 'root', '', {
//   host: "localhost",
//   dialect: "mysql",
//   port: '3306',
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// });

//Connection for server

//mysql://b6fc48db08f878:761988da@eu-cdbr-west-03.cleardb.net/heroku_1887a3bca165d68?reconnect=true
const sequelize = new Sequelize('heroku_1887a3bca165d68', 'b6fc48db08f878', '761988da', {
  host: "eu-cdbr-west-03.cleardb.net",
  dialect: "mysql",
  port: '3306',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Assign Model To a Variable
const User = UserModel(sequelize, Sequelize);
const Post = PostModel(sequelize, Sequelize);
const Notification = NotificationModel(sequelize, Sequelize);
const Bid = BidModel(sequelize, Sequelize);
const PostFeedback = PostFeedbackModel(sequelize, Sequelize);
// Admin Dashboard
const Admin = AdminModel(sequelize, Sequelize);
const Chat = ChatModel(sequelize, Sequelize);

// Relations ================
// Post
Post.belongsTo(User);
User.hasMany(Post, { foreignKey: "userId", sourceKey: "id" });
//Chat.belongsTo(User);

// Notification
Notification.belongsTo(User);
User.hasMany(Notification, { foreignKey: "userId", sourceKey: "id" });
Notification.belongsTo(Post);
Post.hasMany(Notification, { foreignKey: "postId", sourceKey: "id" });

// Bids
Bid.belongsTo(User);
User.hasMany(Bid, { foreignKey: "userId", sourceKey: "id" });
Bid.belongsTo(Post);
Post.hasMany(Bid, { foreignKey: "postId", sourceKey: "id" });

// Review
PostFeedback.belongsTo(User);
PostFeedback.belongsTo(User, { as: "helper", foreignKey: "helperId" });
PostFeedback.belongsTo(User, { as: "customer", foreignKey: "customerId" });
PostFeedback.belongsTo(Post);
Post.hasMany(PostFeedback, { foreignKey: "postId", sourceKey: "id" });

//Database Migration
sequelize.sync({ alter: true }).then(() => {
    console.log('Database & Tables created!');
});

module.exports = {
  User,
  Post,
  Notification,
  Bid,
  PostFeedback,
  Chat,
  Admin,
};
