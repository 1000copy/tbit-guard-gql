//https://sequelize.org/v5/manual/associations.html#belongs-to-many-associations
// Creating with associations
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Product extends Model {}
Product.init({
  title: Sequelize.STRING
}, { sequelize, modelName: 'product' });
class User extends Model {}
User.init({
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
}, { sequelize, modelName: 'user' });
class Address extends Model {}
Address.init({
  type: Sequelize.STRING,
  line1: Sequelize.STRING,
  line2: Sequelize.STRING,
  city: Sequelize.STRING,
  state: Sequelize.STRING,
  zip: Sequelize.STRING,
}, { sequelize, modelName: 'address' });

Product.User = Product.belongsTo(User);
User.Addresses = User.hasMany(Address);

sequelize.sync()
.then(async () => {	
  await Product.create({
	  title: 'Chair',
	  user: {
	    firstName: 'Mick',
	    lastName: 'Broadstone',
	    addresses: [{
	      type: 'home',
	      line1: '100 Main St.',
	      city: 'Austin',
	      state: 'TX',
	      zip: '78704'
	    },{
	      type: 'office',
	      line1: '100 Main St.',
	      city: 'Austin',
	      state: 'TX',
	      zip: '78704'
	    }]
	  }
	}, {
	  include: [{
	    association: Product.User,
	    include: [ User.Addresses ]
	  }]
	})
})
.then(jane => {
	// console.log(jane.toJSON());
	
});
