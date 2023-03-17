var express = require("express");
var router = express.Router();
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { User, Bid, Post, Notification, } = require("../../sequelize");

router.get('/getAllCustomers', function (req, res, next) {
    User.findAll({ where: { role: 'Customer' } }).then((fetch) => {
        res.json({
            status: 'success',
            data: fetch
        });
    }).catch((err) => {
        res.json({
            status: 'failed',
            data: null
        });
    });
});

router.get('/getAllHelpers', function (req, res, next) {
    User.findAll({ where: { role: 'Helper' } }).then((fetch) => {
        res.json({
            status: 'success',
            data: fetch
        });
    }).catch((err) => {
        res.json({
            status: 'failed',
            data: null
        });
    });
});

router.get("/getUserInfoById", function (req, res, next) {
    User.findOne({ where: { id: req.body.id } }).then((fetch) => {
        res.json({
            status: "success",
            data: fetch,
        });
    }).catch((err) => {
        res.json({
            status: 'failed',
            data: null
        });
    });
});

router.post('/create', async function (req, res, next) {
    User.findOne({
        where: { email: req.body.email }
    }).then(check => {
        if (check == null) {
            User.create().then(result => {
                res.json({
                    status: 'success',
                    message: 'Successfully created',
                    data: null
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
            status: 'failed',
            data: null
        });
    });
});

router.post('/update', function (req, res, next) {
    User.update({
        isAnonymous: req.body.isAnonymous,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
        dob: req.body.dob,
        cityName: req.body.cityName,
        cityName: req.body.cityName,
        relationshipStatus: req.body.relationshipStatus,
        cityId: req.body.cityId,
    }, {
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



router.post('/delete', async function (req, res, next) {
    try {
        await Notification.destroy({ where: { userId: req.body.id } });
        await Bid.destroy({ where: { userId: req.body.id } });
        await Post.update({ status: 'Canceled' }, { where: { userId: req.body.id } });
        await User.update({ status: 'Deleted' }, { where: { id: req.body.id } });
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

router.get('/block/:id', async function (req, res, next) {
    try {
        await Notification.destroy({ where: { userId: req.params.id } });
        await Bid.destroy({ where: { userId: req.params.id } });
        await Post.update({ status: 'Canceled' }, { where: { userId: req.params.id } });
        await User.update({ status: 'Blocked' }, { where: { id: req.params.id } });
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

router.get('/activate/:id', async function (req, res, next) {
    try {
        await User.update({ status: 'Active' }, { where: { id: req.params.id } });
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


module.exports = router;
