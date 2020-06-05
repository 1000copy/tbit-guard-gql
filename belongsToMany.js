// sudo apt install python 编译sqlite3时需要
// npm install --save sequelize
// npm i sqlite3 -S

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}
User.init({/* ... */}, { sequelize, modelName: 'user' ,timestamps:false})
class Project extends Model {}
Project.init({/* ... */}, { sequelize, modelName: 'project' ,timestamps:false})


Project.belongsToMany(User, {through: 'UserProject'});
User.belongsToMany(Project, {through: 'UserProject'});

sequelize.sync()
.then(async () => {	

})
.then(jane => {
	// console.log(jane.toJSON());
	
});
