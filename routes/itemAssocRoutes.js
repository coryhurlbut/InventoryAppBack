const express       = require('express');
const router        = express.Router();
const Item          = require('../models/Item');
const ItemAssoc     = require('../models/ItemAssoc');
const verify        = require('./verifyToken');

//Gets all items associations
router.get('/', async (req, res, next) => {
    try {
        const itemAssocs = await ItemAssoc.find();
        res.json(itemAssocs);
    } catch (err) {
        err.message = "Could not get item associations";
        err.status = 400;
        err.instance = `/itemAssoc/`;
        next(err);
    };
});

//Gets associations by parent id
router.get('/parent/:parentId', async (req, res, next) => {
    try {
        const itemAssocs = await ItemAssoc.find({parentId: req.params.parentId});
        res.json(itemAssocs);
    } catch (err) {
        err.message = "Could not get item associations by parent Id";
        err.status = 400;
        err.instance = `/itemAssoc/parent/${req.params.parentId}`;
        next(err);
    };
});

//Gets associations by child id
router.get('/child/:childId', async (req, res, next) => {
    try {
        const itemAssocs = await ItemAssoc.find({childId: req.params.childId});
        res.json(itemAssocs);
    } catch (err) {
        err.message = "Could not get item associations by child Id";
        err.status = 400;
        err.instance = `/itemAssoc/child/${req.params.childId}`;
        next(err);
    };
});

//Creates an item association 
router.post('/', verify, async (req, res, next) => {
    const itemAssoc = new ItemAssoc({
        parentId:   req.body.parentId,
        childId:    req.body.childId
    });

    try {
        const savedItemAssoc = await itemAssoc.save();
        res.json(savedItemAssoc);
    }
    catch (err) {
        err.message = "Could not create item associations";
        err.status = 400;
        err.instance = `/itemAssoc/`;
        next(err);
    };
});

//Deletes an item association
router.delete('/:parentId/:childId', verify, async (req, res, next) => {
    try {
        const removedItemAssoc = await ItemAssoc.deleteOne({parentId: req.params.parentId, childId: req.params.childId});
        res.json(removedItemAssoc);
    } catch (err) { 
        err.message = "Could not delete item association";
        err.status = 400;
        err.instance = `/itemAssoc/${req.params.parentId}/${req.params.childId}`;
        next(err);
    };
});

module.exports = router;