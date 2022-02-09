const express       = require('express');
const router        = express.Router();
const Item          = require('../models/Item');
const ItemLog       = require('../models/ItemLog');
const verify        = require('./verifyToken');

//Gets all item logs
router.get('/', verify, async (req, res, next) => {
    try {
        const itemLogs = await ItemLog.find();
        res.json(itemLogs);
    } catch (err) {
        err.message = "Could not get itemLog";
        err.status = 400;
        err.instance = `/logs/itemLogs/`;
        next(err);
    };
});

//Gets itemLogs by item id
router.get('/item/:id', verify, async (req, res, next) => {
    try {
        const itemLogs = await ItemLog.find({itemId: req.params.id});
        res.json(itemLogs);
    } catch (err) {
        err.message = "Could not get itemLog by item";
        err.status = 400;
        err.instance = `/logs/itemLogs/item/${req.params.id}`;
        next(err);
    };
});

//Gets itemLogs by user id
router.get('/user/:id', verify, async (req, res, next) => {
    try {
        const itemLogs = await ItemLog.find({userId: req.params.id});
        res.json(itemLogs);
    } catch (err) {
        err.message = "Could not get itemLog by user";
        err.status = 400;
        err.instance = `/logs/itemLogs/user/${req.params.id}`;
        next(err);
    };
});

//Creates an itemLog 
router.post('/', verify, async (req, res, next) => {
    const itemLog = new ItemLog({
        itemId:         req.body.itemId,
        userId:         req.body.userId,
        custodianId:    req.body.custodianId,
        action:         req.body.action,
        notes:          req.body.notes
    });

    try {
        const savedItemLog = await itemLog.save();
        res.json(savedItemLog);
    }
    catch (err) {
        err.message = "Could not create itemLog";
        err.status = 400;
        err.instance = `/logs/itemLogs/`;
        next(err);    
    };
});

//Deletes an itemLog
router.delete('/:id', verify, async (req, res, next) => {
    try {
        const removedItemLog = await ItemLog.deleteOne({_id: req.params.id});
        res.json(removedItemLog);
    } catch (err) { 
        err.message = "Could not delete itemLog";
        err.status = 400;
        err.instance = `/logs/itemLogs/${req.params.id}`;
        next(err);    
    };
});

module.exports = router;