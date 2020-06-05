//https://sequelize.org/v5/manual/associations.html#belongs-to-many-associations
// Creating with associations
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Product extends Model {}
Product.init({
  title: Sequelize.STRING
}, { sequelize, modelName: 'product' ,timestamps:false});
class Tag extends Model {}
Tag.init({
  name: Sequelize.STRING
}, { sequelize, modelName: 'tag' });

Product.hasMany(Tag);

sequelize.sync()
.then(async () => {	
  await Product.create({
	  id: 1,
	  title: 'Chair',
	  tags: [
	    { name: 'Alpha'},
	    { name: 'Beta'}
	  ]
	}, {
	  include: [ Tag ]
	})
})
.then(jane => {
	// console.log(jane.toJSON());
	
});
