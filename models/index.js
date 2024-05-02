const {Restaurant} = require('./Restaurant')
const {Menu} = require('./Menu')
const Item = require('./Item')

Restaurant.hasMany(Menu)
Menu.belongsTo(Restaurant)

Menu.belongsToMany(Item, { through: 'MenuItems' }); 
Item.belongsToMany(Menu, { through: 'MenuItems' });


module.exports = { Restaurant, Menu, Item }
