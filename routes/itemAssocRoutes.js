const express       = require('express');
const router        = express.Router();
const Item          = require('../models/Item');
const ItemAssoc     = require('../models/ItemAssoc');
const verify        = require('./verifyToken');

//Gets all items associations
router.get('/', async (req, res) => {
    try {
        const itemAssocs = await ItemAssoc.find()
        res.json(itemAssocs);
    } catch (err) {
        res.json({ message: err});
    };
});
//Gets associations by parent id
router.get('/parent/:parentId', async (req, res) => {
    try {
        const itemAssocs = await ItemAssoc.find({parentId: req.params.parentId});
        res.json(itemAssocs);
    } catch (err) {
        res.json({ message: err});
    };
});
//Gets associations by child id
router.get('/child/:childId', async (req, res) => {
    try {
        const itemAssocs = await ItemAssoc.find({childId: req.params.childId});
        res.json(itemAssocs);
    } catch (err) {
        res.json({ message: err});
    };
});
//Creates an item association 
router.post('/', verify, async (req, res) => {
    const itemAssoc = new ItemAssoc({
        parentId:   req.body.parentId,
        childId:    req.body.childId
    });

    try {
        const savedItemAssoc = await itemAssoc.save();
        res.json(savedItemAssoc);
    }
    catch (err) {
        res.json({ message: err });
    };
});
//Deletes an item association
router.delete('/:parentId/:childId', verify, async (req, res) => {
    try {
        const removedItemAssoc = await ItemAssoc.deleteOne({parentId: req.params.parentid, childId: req.params.childId});
        res.json(removedItemAssoc);
    } catch (err) { 
        res.json({ message: err });
    };
});

module.exports = router;