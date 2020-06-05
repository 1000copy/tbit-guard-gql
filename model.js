//https://sequelize.org/v5/manual/associations.html#belongs-to-many-associations
// Creating with associations
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Project extends Model {}
Project.init({
  title: Sequelize.STRING,
  description: Sequelize.TEXT
}, { sequelize, modelName: 'project' });

class Task extends Model {}
Task.init({
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  deadline: Sequelize.DATE
}, { sequelize, modelName: 'task' })

sequelize.sync()
.then(async () => {	
 //  await Product.create({
	//   id: 1,
	//   title: 'Chair',
	//   tags: [
	//     { name: 'Alpha'},
	//     { name: 'Beta'}
	//   ]
	// }, {
	//   include: [ Tag ]
	// })
})
.then(jane => {
	// console.log(jane.toJSON());
	
});
