const express   = require('express');
const router    = express.Router();
const AdminLog  = require('../models/AdminLog');
const verify    = require('./verifyToken');

//Gets all admin logs
router.get('/', verify, async (req, res) => {
    try {
        const adminLogs = await AdminLog.find();
        res.json(adminLogs);
    } catch (err) {
        res.json({ message: err.message});
    };
});

//Gets adminLogs by item id
router.get('/item/:id', verify, async (req, res) => {
    try {
        const adminLogs = await AdminLog.find({itemId: req.params.id});
        res.json(adminLogs);
    } catch (err) {
        res.json({ message: err});
    };
});

//Gets adminLogs by user id
router.get('/user/:id', verify, async (req, res) => {
    try {
        const adminLogs = await AdminLog.find({userId: req.params.id});
        res.json(adminLogs);
    } catch (err) {
        res.json({ message: err});
    };
});

//Creates an adminLog 
router.post('/', verify, async (req, res) => {
    const adminLog = new AdminLog({
        itemId:     req.body.itemId,
        userId:     req.body.userId,
        adminId:    req.body.adminId,
        action:     req.body.action,
        content:    req.body.content,
        notes:      req.body.notes
    });

    try {
        const savedAdminLog = await adminLog.save();
        res.json(savedAdminLog);
    }
    catch (err) {
        res.json({ message: err });
    };
});

//Deletes an adminLog by Id
router.delete('/:id', verify, async (req, res) => {
    try {
        const removedAdminLog = await AdminLog.deleteOne({_id: req.params.id});
        res.json(removedAdminLog);
    } catch (err) { 
        res.json({ message: err });
    };
});

module.exports = router;