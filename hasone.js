// sudo apt install python 编译sqlite3时需要
// npm install --save sequelize
// npm i sqlite3 -S

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Person extends Model {}
Person.init({ /* ... */}, { sequelize, modelName: 'person' ,timestamps: false})
// also possible:
Person.hasOne(Person, {as: 'Dad', foreignKey: 'DadId'},)
// this will add the attribute DadId to Person
// In both cases you will be able to do:
// console.log(Person.setDad)
// console.log(Person.getDad)

sequelize.sync()
.then(async () => {
	var p= await Person.create({})
	var c =  await Person.create({})
	await c.setDad(p)
	// await c.save()
	console.log((await c.getDad()).id , p.id)

})
.then(jane => {
	// console.log(jane.toJSON());
	
});