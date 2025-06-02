const { Sequelize } = require('sequelize');
const UserModel = require('./user');
const TransactionModel = require('./transaction');
const CategoryModel = require('./category');
const BudgetModel = require('./budget');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const User = UserModel(sequelize);
const Transaction = TransactionModel(sequelize);
const Category = CategoryModel(sequelize);
const Budget = BudgetModel(sequelize);

// Relationships
User.hasMany(Transaction);
Transaction.belongsTo(User);

User.hasMany(Category);
Category.belongsTo(User);

User.hasMany(Budget);
Budget.belongsTo(User);

Category.hasMany(Transaction);
Transaction.belongsTo(Category);

module.exports = {
  sequelize,
  User,
  Transaction,
  Category,
  Budget
};