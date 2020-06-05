// sudo apt install python 编译sqlite3时需要
// npm install --save sequelize
// npm i sqlite3 -S

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
const User = sequelize.define('user', {
  // attributes
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING
    // allowNull defaults to true
  }
}, {
  // options
});
class Book extends Model {}
Book.init({
  title: DataTypes.STRING,  
}, { sequelize});

class Author extends Model {}
Author.init({
  name: DataTypes.STRING,  
}, { sequelize});
// Book.hasOne(Author)
Author.hasMany(Book)
// Book.belongsTo(Author)
sequelize.sync()
.then(async () => {
	await User.create({firstName:"1",lastName: '2',})
	await Author.create({id:1,name: 'reco',})
	var rita = await Author.create({id:2,name: 'rita',})  	
	// var rita = await Author.create({id:2,name: 'rita',books:[{id:5,title: 'b5'},{id:6,title: 'b6'}]})  	
	await Book.create({id:1,title: 'the http book',AuthorId:1})
	var cat = await Book.create({id:3,title: 'my brother cat'})
	rita.addBook(cat)
	return await Book.create({id:2,title: 'the little prince',AuthorId:1})  	
})
.then(jane => {
	console.log(jane.toJSON());
	var options = { include: [{
	    model: Book,
	    // through: {
	    //   attributes: ['createdAt', 'startedAt', 'finishedAt'],
	    //   where: {completed: true}
	    // }
	  }]}
	Author.findAll(options).then((authors)=>{
		 
		console.log(JSON.stringify(authors, null, 2));
	})
	User.findAll({}).then((authors)=>{
		 
		console.log(JSON.stringify(authors, null, 2));
	})
});