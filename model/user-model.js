const mongoose = require('mongoose');
const Schema = mongoose.Schema;
      bcrypt = require('bcrypt'),
      SALT_WORK_FACTOR = 10;


// create user schema and model

const UserSchema = new Schema({

    first_name: {
        type: String,
        required: [true, 'First Name is required'],
        validate: {
            validator: function (arr) {
                return arr.length > 2;
            },
            message: "Enter valid first name."
        }
    },

    last_name: {
        type: String,
        required: [true, 'last Name is required'],
        validate: {
            validator: function (arr) {
                return arr.length > 2;
            },
            message: "Enter valid last name."
        }
    },

    email: {
        type: String,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Enter valid email."
        },
        required: [true, 'Email is required'],

    },

    address: {
        type: String,
        required: true
    },

    mobile_number: {
        type: String,
        unique: true,
        required: [true, 'This field is required'],
        validate: {
            validator: function(v) {
                var re = /^\d{10}$/;
                return (v == null || v.trim().length < 1) || re.test(v)
            },
            message: 'Provided phone number is invalid.'
        }
    },

    password : {
        type : String,
        unique : true,
        required: [true, 'This field is required'],
        min : 6,
        max : 1024
    },

});


UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('user', UserSchema);
module.exports = User
