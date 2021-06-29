const express   =   require('express');
const router    =   express.Router();
const Item      =   require('../models/Item');
const ItemAssoc =   require('../models/ItemAssoc');
const verify    =   require('./verifyToken');

//Gets all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find()
        res.json(items);
    } catch (err) {
        res.json({ message: err.message});
    };
});

//Gets all items
router.get('/available', async (req, res) => {
    try {
        const items = await Item.find().where({ available: true }).where({ servicable: true })
        res.json(items);
    } catch (err) {
        res.json({ message: err.message});
    };
});

//Gets all items
router.get('/unavailable', async (req, res) => {
    try {
        const items = await Item.find({available: false})
        res.json(items);
    } catch (err) {
        res.json({ message: err.message});
    };
});

//Gets item by id
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        res.json(item);
    } catch (err) {
        res.json({ message: err});
    };
});

//Creates an item 
router.post('/', async (req, res) => {
    const item = new Item({
        id:                 req.body.id,
        name:               req.body.name,
        description:        req.body.description,
        serialNumber:       req.body.serialNumber,
        notes:              req.body.notes,
        homeLocation:       req.body.homeLocation,
        specificLocation:   req.body.specificLocation,
        available:          req.body.available,
        servicable:         req.body.servicable,
        isChild:            req.body.isChild
    });

    try {
        const savedItem = await item.save();
        res.json(savedItem);
    }
    catch (err) {
        res.json({ message: err });
    };
});

//Deletes an item
router.delete('/:id', async (req, res) => {
    try {
        const removedItem = await Item.deleteOne({_id: req.params.id});
    } catch (err) { 
        res.json({ message: err });
    };
});

//Updates an item
router.patch('/:id', async (req, res) => {
    try {
        const updatedItem = await Item.updateOne(
            { _id: req.params.id }, 
            { $set: {
                id:                 req.body.id,
                name:               req.body.name,
                description:        req.body.description,
                serialNumber:       req.body.serialNumber,
                notes:              req.body.notes,
                homeLocation:       req.body.homeLocation,
                specificLocation:   req.body.specificLocation,
                available:          req.body.available,
                servicable:         req.body.servicable,
                isChild:            req.body.isChild
                }
            }
        );
        res.json(updatedItem);
    } catch (err) {
        res.json({ message: err });
    };
});

module.exports = router;