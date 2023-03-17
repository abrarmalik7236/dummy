var express = require("express");
var router = express.Router();
const { User, Post, Notification, Bid, PostFeedback } = require("../../sequelize");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.post("/getAllAds", async function (req, res, next) {
  var options = {
    order: [['id', 'DESC']],
  };

  Post.findAll(options).then((fetch) => {
    res.json({
      status: "success",
      data: fetch,
    });
  }).catch((err) => {
    console.log(err);
    res.json({
      status: "failed",
      data: null,
    });
  });
});

router.get("/approveBooking/:id", async function (req, res, next) {
  Post.update(
    { status: 'Finding Helpers' },
    { where: { id: req.params.id } },
  ).then((fetch) => {
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

router.get("/markAsComplete/:id", function (req, res, next) {
  Bid.findOne({
    where: {
      postId: req.params.id,
      status: 'Hired',
    },
  }).then(async (bid) => {
    if (bid != null) {
      await PostFeedback.create(
        {
          review: 'Marked by Move Time team',
          rating: 5,
          postId: req.params.id,
          customerId: 8,
          helperId: bid.userId,
        }
      );
      var allFeedbacks = await PostFeedback.findOne({
        where: { helperId: bid.userId },
        attributes: [Sequelize.fn("AVG", Sequelize.col("rating"))],
        raw: true,
      });
      var avRating = allFeedbacks['AVG(`rating`)'];
      await User.update(
        {
          rating: avRating,
          numbersOfJobs: Sequelize.literal("numbersOfJobs + " + 1),
        },
        { where: { id: bid.userId } }
      );
      await Bid.update(
        { status: 'Completed' },
        { where: { id: bid.id } }
      );
    }

    await Post.update(
      { status: 'Completed' },
      { where: { id: req.params.id } }
    );

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

router.get("/cancelBooking/:id", async function (req, res, next) {
  Post.update(
    { status: 'Canceled' },
    { where: { id: req.params.id } },
  ).then((fetch) => {
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

module.exports = router;
