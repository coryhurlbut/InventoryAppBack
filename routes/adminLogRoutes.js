const express   = require('express');
const router    = express.Router();
const AdminLog  = require('../models/AdminLog');
const verify    = require('./verifyToken');

//Gets all admin logs
router.get('/', verify, async (req, res, next) => {
    try {
        const adminLogs = await AdminLog.find();
        res.json(adminLogs);
    } catch (err) {
        err.message = "Could not get adminLog";
        err.status = 400;
        err.instance = `/logs/adminLogs/`;
        next(err);
    };
});

//Gets adminLogs by item id
router.get('/item/:id', verify, async (req, res, next) => {
    try {
        const adminLogs = await AdminLog.find({itemId: req.params.id});
        res.json(adminLogs);
    } catch (err) {
        err.message = "Could not get adminLog by item";
        err.status = 400;
        err.instance = `/logs/adminLogs/items/${req.params.id}`;
        next(err);
    };
});

//Gets adminLogs by user id
router.get('/user/:id', verify, async (req, res, next) => {
    try {
        const adminLogs = await AdminLog.find({userId: req.params.id});
        res.json(adminLogs);
    } catch (err) {
        err.message = "Could not get adminLog by user";
        err.status = 400;
        err.instance = `/logs/adminLogs/user/${req.params.id}`;
        next(err);
    };
});

//Creates an adminLog 
router.post('/', verify, async (req, res, next) => {
    const adminLog = new AdminLog({
        itemId:     req.body.itemId,
        userId:     req.body.userId,
        adminId:    req.body.adminId,
        action:     req.body.action,
        content:    req.body.content
    });

    try {
        const savedAdminLog = await adminLog.save();
        res.json(savedAdminLog);
    }
    catch (err) {
        err.message = "Could not create adminLog";
        err.status = 400;
        err.instance = `/logs/adminLogs/`;
        next(err);
    };
});

//Deletes an adminLog by Id
router.delete('/:id', verify, async (req, res, next) => {
    try {
        const removedAdminLog = await AdminLog.deleteOne({_id: req.params.id});
        res.json(removedAdminLog);
    } catch (err) { 
        err.message = "Could not delete adminLog";
        err.status = 400;
        err.instance = `/logs/adminLogs/${req.params.id}`;
        next(err);
    };
});

module.exports = router;