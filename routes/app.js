var express = require("express");
var router = express.Router();
var fs = require("fs");
const { User, Notification, Post, PostFeedback, Bid } = require("../sequelize");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.post('/updateProfile/:id', function (req, res, next) {
  User.findOne({
    where: {
      id: {
        [Op.not]: req.params.id
      },
      email: req.body.email,
    }
  }).then(check => {
    if (check == null) {
      User.update(req.body, {
        where: {
          id: req.params.id
        }
      }).then(up => {
        User.findOne({
          where: { id: req.params.id },
        }).then(fetch => {
          res.json({
            status: 'success',
            data: fetch
          });
        });
      });
    } else {
      res.json({
        status: 'failed',
        data: null
      });
    }
  }).catch((err) => {
    res.json({
      status: "failed",
      data: null,
    });
  });
});

router.post('/deleteAccount', async function (req, res, next) {
  try {
    await Notification.destroy({ where: { userId: req.body.id } });
    await Bid.destroy({ where: { userId: req.body.id } });
    await Post.update({ status: 'Canceled' }, { where: { userId: req.body.id } });
    await User.update({ status: 'Blocked' }, { where: { id: req.body.id } });
    res.json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: null,
    });
  }
});

router.post('/getAllNotifications', function (req, res, next) {
  Notification.findAll({
    limit: 20,
    offset: Number(req.body.offset),
    where: { userId: req.body.userId },
    include: [Post]
  }).then((fetch) => {
    res.json({
      status: "success",
      data: fetch,
    });
  }).catch((err) => {
    res.json({
      status: "failed",
      data: null,
    });
  });
});

router.get('/removeNotifications/:id', function (req, res, next) {
  Notification.destroy({ where: { id: req.params.id } }).then(cw => {
    res.json({
      status: "success",
      data: null,
    });
  }).catch((err) => {
    res.json({
      status: "failed",
      data: null,
    });
  });
});


router.post('/getAllReviews', function (req, res, next) {
  PostFeedback.findAll({
    limit: 20,
    offset: Number(req.body.offset),
    where: { helperId: req.body.helperId },
    include: [
      Post,
      { model: User, as: "customer" },
    ],

  }).then((fetch) => {
    res.json({
      status: "success",
      data: fetch,
    });
  }).catch((err) => {
    res.json({
      status: "failed",
      data: null,
    });
  });
});


// ========================================================
// ======================= Uploader =======================
// ========================================================

router.post('/uploader', function (req, res, next) {
  var realFile = Buffer.from(req.body.file, "base64");
  fs.writeFile("./uploads/" + req.body.name, realFile, function (err) {
    if (err) {
      res.json({
        status: 'failed',
        data: err
      });
    } else {
      res.json({
        status: 'success',
        data: req.body.name
      });
    }
  });
});

module.exports = router;
