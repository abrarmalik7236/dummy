var express = require("express");
var router = express.Router();
const { User, Post } = require("../../sequelize");

router.get('/counterWidget', async function (req, res, next) {
    try {
        var totalUsers = await User.count();
        var activeUsers = await User.count({ where: { status: 'Active' } });
        var blockedUsers = await User.count({ where: { status: 'Blocked' } });
        var inReviewUsers = await User.count({ where: { status: 'In Review' } });

        var customers = await User.count({ where: { role: 'Customer' } });
        var helpers = await User.count({ where: { role: 'Helper' } });

        var totalAds = await Post.count();
        var inReviewAds = await Post.count({ where: { status: 'In Review' } });

        res.json({
            status: 'success',
            totalUsers: totalUsers,
            activeUsers: activeUsers,
            blockedUsers: blockedUsers,
            inReviewUsers: inReviewUsers,
            customers: customers,
            helpers: helpers,
            totalAds: totalAds,
            inReviewAds: inReviewAds,
        });
    } catch (error) {
        res.json({
            status: 'failed',
            data: null
        });
    }
});

module.exports = router;