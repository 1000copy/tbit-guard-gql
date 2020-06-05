//https://sequelize.org/v5/manual/associations.html#belongs-to-many-associations
// Creating with associations
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Product extends Model {}
Product.init({
  title: Sequelize.STRING
}, { sequelize, modelName: 'product' ,timestamps:false});
class User extends Model {}
User.init({
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
}, { sequelize, modelName: 'user' ,timestamps:false});

const Creator = Product.belongsTo(User, { as: 'creator' });

sequelize.sync()
.then(async () => {	
  await Product.create({
	  title: 'Chair',
	  creator: {
	    firstName: 'Matt',
	    lastName: 'Hansen'
	  }
	}, {
	  include: [ Creator ]
	});
})
.then(jane => {
	// console.log(jane.toJSON());
	
});
