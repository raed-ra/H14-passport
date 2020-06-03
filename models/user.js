// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    facebookId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    facebookToken: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    facebookName: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  // Creating a custom metho d for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function (password) {
    if (this.password) {
      return bcrypt.compareSync(password, this.password);
    }
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function (user) {
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });
  return User;
};
