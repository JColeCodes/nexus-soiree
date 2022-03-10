const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: [true, 'Username must be unique'],
            required: 'Username is required',
            trim: true
        },
        email: {
            type: String,
            unique: [true, 'Email must be unique'],
            required: 'Email is required',
            match: [/.+@[\w-]+\.[a-z]{2,12}(.[a-z]+)?/]
        },
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

UserSchema.virtual('friendCount').get(function() {
    if (this.friends) {
        return this.friends.length;
    }
})

const User = model('User', UserSchema);

module.exports = User;