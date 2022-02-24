const express       = require('express');
const router        = express.Router();
const Item          = require('../models/Item');
const verify        = require('./verifyToken');

//Gets all available items
router.get('/available', async (req, res, next) => {
    try {
        const items = await Item.find().where({ available: true }).where({ servicable: true });
        res.json(items);
    } catch(err) {
        err.message = "Could not get available items";
        err.status = 500;
        err.instance = `/items/available`;
        next(err);
    };
});

//Gets all unavailable items
router.get('/unavailable', async (req, res, next) => {
    try {
        const items = await Item.find({available: false});
        res.json(items);
    } catch(err) {
        err.message = "Could not get unavailable items";
        err.status = 500;
        err.instance = `/items/unavailable`;
        next(err);
    };
});

//Gets item by id
router.get('/item/:id', async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        res.json(item);
    } catch(err) {
        err.message = `Could not get item ${req.params.id}.`;
        err.status = 400;
        err.instance = `/items/item/${res.params.id}`;
        next(err);
    };
});

//Creates an item. Input is JSON object that must meet Item model description
router.post('/', async (req, res, next) => {
    const item = new Item({
        name:               req.body.name,
        description:        req.body.description,
        serialNumber:       req.body.serialNumber,
        notes:              req.body.notes,
        homeLocation:       req.body.homeLocation,
        specificLocation:   req.body.specificLocation,
        available:          req.body.available,
        servicable:         req.body.servicable,
        possessedBy:        ''
    });
    
    try {
        const savedItem = await item.save();
        res.json(savedItem);
    } catch(err) {
        err.message = "Could not save item";
        err.status = 400;
        err.instance = `/items/`;
        next(err);
    };
});

// //Deletes an item
// router.delete('/:id', verify, async (req, res) => {
//     try {
//         const removedItem = await Item.deleteOne({_id: req.params.id});
//         res.json(removedItem)
//     } catch (err) { 
//         res.json({ message: err });
//     };
// });

//Deletes items. Input is JSON array of IDs
router.delete('/delete', async (req, res, next) => {
    try {
        const removedItems = await Item.deleteMany({_id: { $in: req.body} });
        res.json(removedItems);
    } catch(err) {
        err.message = "Could not delete items";
        err.status = 400;
        err.instance = `/items/delete`;
        next(err);
    };
});

//Signs out items. Input is JSON array of IDs
router.patch('/signout', async (req, res, next) => {
    try {
        const itemsSignedOut = await Item.updateMany(
            
            { _id: { $in: req.body.itemIds } }, 
            { available: false, 
              possessedBy: req.body.user }
        );
        res.json(itemsSignedOut);
    } catch(err) {
        err.message = "Could not sign item out";
        err.status = 400;
        err.instance = `/items/signout`;
        next(err);
    };
});

//Signs in items. Input is JSON array of IDs
router.patch('/signin', async (req, res, next) => {
    try {
        const itemsSignedIn = await Item.updateMany(
            { _id: { $in: req.body } }, 
            { available: true,
              possessedBy: '' }
        );
        res.json(itemsSignedIn);
    } catch(err) {
        err.message = "Could not sign item in";
        err.status = 400;
        err.instance = `/items/signin`;
        next(err);
    };
});

//Updates an item. Input is item Id url encoded
router.patch('/:id', async (req, res, next) => {
    try {
        const updatedItem = await Item.updateOne(
            { _id: req.params.id }, 
            {
                name:               req.body.name,
                description:        req.body.description,
                serialNumber:       req.body.serialNumber,
                notes:              req.body.notes,
                homeLocation:       req.body.homeLocation,
                specificLocation:   req.body.specificLocation,
                available:          req.body.available,
                servicable:         req.body.servicable
            }
        );
        res.json(updatedItem);
    } catch(err) {
        err.message = "Could not update item";
        err.status = 400;
        err.instance = `/items/${req.params.id}`;
        next(err);
    };
});

module.exports = router;