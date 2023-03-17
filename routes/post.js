var express = require("express");
var router = express.Router();
const { User, Post, Notification, Bid, PostFeedback } = require("../sequelize");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.post("/createBooking", async function (req, res, next) {
  var body = req.body;
  var sp = body.pLocation.split(",");
  var point = { type: 'Point', coordinates: [sp[0], sp[1]] };
  body.location = point;
  Post.create(body).then(async (fetch) => {
    await Notification.create({
      text: 'Your booking is in review',
      userId: req.body.userId,
      postId: fetch.id,
    });
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

router.post("/getAllBookings", async function (req, res, next) {
//  var areEqual = req.body.status.toUpperCase() === req.body.status.toUpperCase();
  Post.findAll({
    limit: 20,
    offset: Number(req.body.offset),
    where: {userId: req.body.userId},
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

router.post("/getbookingbyId", async function (req, res, next) {
  //  var areEqual = req.body.status.toUpperCase() === req.body.status.toUpperCase();
    Post.findAll({
      limit: 20,
      offset: Number(req.body.offset),
      where: {id: req.body.id},
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



router.get("/getRandomAds", async function (req, res, next) {
  options = {
    where: { status: 'Finding Helpers' },
    limit: 20,
    order: Sequelize.literal('rand()'),
  };
  Post.findAll(options).then((fetch) => {
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

router.post("/getAllAds", async function (req, res, next) {
  var search = req.body.keyword;
  var options = {
    where: {},
    limit: 20,
    offset: Number(req.body.offset),
    order: [],
  };
  if (search != '') {
    // not empty
    if (search == 'new') {
      options.where = { status: 'Finding Helpers' };
      options.order = [['id', 'DESC']];
    } else {

      if (search == 'Packing') {
        options.where = {
          [Op.or]: [
            { packersRequired: true },
            { service: { [Op.like]: "%" + search + "%" } },
          ],
          status: 'Finding Helpers',
        };
      } else if (search == 'Cleaning') {
        options.where = {
          [Op.or]: [
            { cleanersRequired: true },
            { service: { [Op.like]: "%" + search + "%" } },
          ],
          status: 'Finding Helpers',
        };

      } else if (search == 'Helping') {
        options.where = {
          [Op.or]: [
            { handymanRequired: true },
            { service: { [Op.like]: "%" + search + "%" } },
          ],
          status: 'Finding Helpers',
        };
      } else {
        options.where = {
          service: { [Op.like]: "%" + search + "%" },
          status: 'Finding Helpers',
        };
      }
      options.order = [['id', 'DESC']];
    }
  } else {
    options.where = { status: 'Finding Helpers' };
  }
  Post.findAll(options).then((fetch) => {
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

router.post("/checkIApplied", async function (req, res, next) {
  Bid.findOne({
    where: {
      postId: req.body.postId,
      userId: req.body.userId,
    }
  }).then((fetch) => {

    res.json({
      status: 'success',
      data: fetch,
    });

  }).catch((err) => {
    res.json({
      status: "failed",
      data: null,
    });
  });

});

router.post("/applyingBooking", async function (req, res, next) {

  Bid.findAll({
    where: {
      postId: req.body.postId,
      status: 'Applied',
      helperfcm:req.body.helperfcm,
    }
  }).then(async (fetch) => {
    if (fetch.length < 3) {
      found = false;
      for await (const item of fetch) {
        if (item.userId == req.body.userId) {
          found = true;
        }
      }
      if (found) {
        res.json({
          status: "already applied",
          data: fetch,
        });
      } else {
        Bid.create(req.body).then((fetch) => {
          res.json({
            status: "success",
            data: fetch,
          });
        });
      }
    } else {
      res.json({
        status: "full",
        data: null,
      });
    }
  }).catch((err) => {
    res.json({
      status: "failed",
      data: null,
    });
  });

});


router.get("/getAllHelpersByBooking/:id", function (req, res, next) {
  Bid.findAll({
    order: [['id', 'DESC']],
    where: {
      postId: req.params.id
    },
    include: [User, Post]
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


router.get("/hire/:id/:postId/:helperfcm", function (req, res, next) {
  var up = { status: 'Hired' };
  Bid.update(up,
    {
      where: {
        id: req.params.id
      },
    },
  ).then((fetch) => {
    Post.update({ status: 'Hired',helperfcm:req.params.helperfcm },
      {
        where: {
          id: req.params.postId
        },
      },
    ).then((fetch) => {
      res.json({
        status: "success",
        data: null,
      });
    });
  }).catch((err) => {
    res.json({
      status: "failed",
      data: null,
    });
  });
});

router.post("/updateBooking/:id", function (req, res, next) {
  Post.update(req.body, {
    where: {
      id: req.params.id,
    },
  }).then(up => {
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


router.post("/markAsComplete", function (req, res, next) {
  Bid.findOne({
    where: {
      postId: req.body.postId,
      status: 'Hired',
    },
  }).then(async (bid) => {

    await PostFeedback.create(
      {
        review: req.body.review,
        rating: req.body.rating,
        postId: req.body.postId,
        customerId: req.body.customerId,
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
    await Post.update(
      { status: 'Completed',israte:true },
      { where: { id: req.body.postId } }
    );
    await Bid.update(
      { status: 'Completed' },
      { where: { id: bid.id } }
    );
    res.json({
      status: "success",
      data: avRating,
    });
  }).catch((err) => {
    res.json({
      status: "failed",
      data: null,
    });
  });
});


router.post("/getAllHelperBookings", function (req, res, next) {
  Bid.findAll({
    limit: 20,
    offset: Number(req.body.offset),
    order: [['id', 'DESC']],
    where: {
      userId: req.body.userId,
      status: req.body.status,
    },
    include: [User, Post]
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

module.exports = router;
