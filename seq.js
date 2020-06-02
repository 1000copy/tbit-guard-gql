// sudo apt install python 编译sqlite3时需要
// npm install --save sequelize
// npm i sqlite3 -S

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

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
sequelize.sync()
.then(() => {
	Author.create({id:1,name: 'reco',})
	Author.create({id:2,name: 'rita',})  	
	Book.create({id:1,title: 'the http book',AuthorId:1})
	return Book.create({id:2,title: 'the little prince',AuthorId:1})  	
})
.then(jane => {
	console.log(jane.toJSON());
	Author.findAll().then((authors)=>{
		 
		console.log(JSON.stringify(authors, null, 2));
	})
});