const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/index");
var Message = require("./Message") 

class Account extends Model {}
Account.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pubKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM("online","typing","offline"),
      allowNull: false,
    },
    // type: {
    //   type: DataTypes.ENUM("user", "admin", "control"),
    // },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Account", // We need to choose the model name
    timestamps: true,
  }
);

Account.hasMany(Message) ;
Message.belongsTo(Account, { onDelete: "CASCADE" });


// the defined model is the class itself
//console.log(Account === sequelize.models.Account); // true
module.exports = Account;
