var express = require("express");
var router = express.Router();
const { User, Post, Notification, Bid, PostFeedback,Chat } = require("../sequelize");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.post("/initiateChat", async function (req, res, next) {
  var body = {
 "message":JSON.stringify([{"usertype":"Customer", "messages":"hy man"}]),
  "name":"khan lala",
  "helperid":"11",
  "userid":"21",
  "userpic":"pic"
}
req.body.message = JSON.stringify(req.body.message)
  //req.body;

  
 // var sp = body.pLocation.split(",");
 // var point = { type: 'Point', coordinates: [sp[0], sp[1]] };
  //body.location = point;
  Chat.create(req.body).then(async (fetch) => {
    // await Chat.create({
    //   text: 'Your booking is in review',
    //   userId: req.body.userId,
    //   postId: fetch.id,
    // });
    res.json({
      status: "success",
      data: fetch,
    });
  }).catch((err) => {
    res.json({
      status: "failed",
      data: err,
    });
  });
});

router.post("/getChatbyid", async function (req, res, next) {

  Chat.findAll({
    // limit: 20,
    // offset: Number(req.body.offset),
    where: {userid: req.body.userid,

      
      bookingid:req.body.bookingid},
  }).then((fetch) => {
    res.json({
      status: "success",
      data: fetch,
    });
  }).catch((err) => {
    res.json({
      status: "failed",
      data: err,
    });
  });

});




router.post("/updatechat/:id", function (req, res, next) {
  // var data = {
  //   "message":JSON.stringify([{"usertype":"Customer", "messages":"hy man"}]),
  //    "name":"khan lala",
  //    "helperid":"11",
  //    "userid":"21",
  //    "userpic":"pic"
  //  }

  //JSON.stringify([{"usertype":"Customer", "messages":"hy man"}])
  Chat.update({"message":JSON.stringify(req.body.message)}, {
    where: {
      id: req.params.id,
    },
  }).then(up => {
    res.json({
      status: "success",
      data: up,
    });
  }).catch((err) => {
    res.json({
      status: "failed",
      data: err,
    });
  });
});


module.exports = router;
