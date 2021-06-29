const mongoose = require('mongoose');

const ItemAssocSchema = mongoose.Schema({
    parentId:{
        type: String,
        required: true
    },
    childId: {
        type: String,
        required: true
    },
});

//params for mongoose.model() = ('name of model', 'mongoose schema assigned to model', 'name of table associated with model')
module.exports = mongoose.model('ItemAssoc', ItemAssocSchema, 'ItemAssoc');