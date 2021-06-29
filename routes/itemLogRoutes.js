const express       = require('express');
const router        = express.Router();
const Item          = require('../models/Item');
const ItemAssoc     = require('../models/ItemAssoc');
const ItemLog       = require('../models/ItemLog');
const verify        = require('./verifyToken');

//Gets all item logs
router.get('/', async (req, res) => {
    try {
        const itemLogs = await ItemLog.find()
        res.json(itemLogs);
    } catch (err) {
        res.json({ message: err.message});
    };
});
//Gets itemLogs by item id
router.get('/item/:id', async (req, res) => {
    try {
        const itemLogs = await ItemLog.find({itemId: req.params.id});
        res.json(itemLogs);
    } catch (err) {
        res.json({ message: err});
    };
});
//Gets itemLogs by user id
router.get('/user/:id', async (req, res) => {
    try {
        const itemLogs = await ItemLog.find({userId: req.params.id});
        res.json(itemLogs);
    } catch (err) {
        res.json({ message: err});
    };
});
//Creates an itemLog 
router.post('/', async (req, res) => {
    const itemLog = new ItemLog({
        itemId:         req.body.itemId,
        userId:         req.body.userId,
        custodianId:    req.body.custodianId,
        action:         req.body.action,
        notes:          req.body.notes
    });

    try {
        const savedItemLog = await itemLog.save();
        //If isChild true, add association to Assoc
        res.json(savedItemLog);
    }
    catch (err) {
        res.json({ message: err });
    };
});
//Deletes an itemLog
router.delete('/:id', async (req, res) => {
    try {
        const removedItemLog = await ItemLog.deleteOne({_id: req.params.id});
    } catch (err) { 
        res.json({ message: err });
    };
});

module.exports = router;