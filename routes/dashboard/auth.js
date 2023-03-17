var express = require("express");
var router = express.Router();
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var jwt = require("jsonwebtoken");
var passwordHash = require("password-hash");
var config = require("../../env");
const { Admin } = require("../../sequelize");


/* App Login */
router.post("/login", function (req, res, next) {
  Admin.findOne({
    where: {
      email: req.body.email,
      status: { [Op.not]: "Blocked" },
    },
  }).then((admin) => {
    if (admin != null) {
      if (passwordHash.verify(req.body.password, admin.password)) {
        const payload = { userId: admin.id, email: admin.email };
        const token = jwt.sign(payload, config.secret, { expiresIn: "1000d" });
        res.json({
          status: "success",
          data: { admin, token },
        });
      } else {
        res.json({
          status: "failed",
          data: null,
        });
      }
    } else {
      res.json({
        status: "failed",
        data: null,
      });
    }
  });
});

router.post('/userUpdate', function (req, res, next) {
  Admin.update({ fullName: req.body.fullName, email: req.body.email, }, {
    where: { id: req.body.id }
  }).then(fetch => {
    Admin.findOne({
      where: { id: req.body.id },
    }).then((admin) => {
      res.json({
        status: 'success',
        data: admin
      });
    });
  }).catch((err) => {
    res.json({
      status: 'failed',
      data: null
    });
  });
});

router.post('/changePassword', function (req, res, next) {
  var hashPassword = passwordHash.generate(req.body.password);
  Admin.update({ password: hashPassword }, {
    where: { id: req.body.id }
  }).then(fetch => {
    res.json({
      status: 'success',
      data: null
    });
  }).catch((err) => {
    res.json({
      status: 'failed',
      data: null
    });
  });
});

module.exports = router;
