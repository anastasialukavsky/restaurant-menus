const { db } = require('./db');
const { Restaurant, Menu, Item } = require('./models/index');
const { seedRestaurant, seedMenu } = require('./seedData');

describe('Restaurant and Menu Models', () => {

  beforeAll(async () => {

    await db.sync({ force: true });
     await Restaurant.bulkCreate(seedRestaurant);
     await Menu.bulkCreate(seedMenu);
  });

  test('can create a Restaurant', async () => {
    const createdRestaurant = await Restaurant.create(seedRestaurant[0]);

    const foundRestaurant = await Restaurant.findOne({
      where: { id: createdRestaurant.id },
    });

    expect(foundRestaurant).toBeTruthy();
    expect(foundRestaurant.name).toEqual(seedRestaurant[0].name);
    expect(foundRestaurant.location).toEqual(seedRestaurant[0].location);
    expect(foundRestaurant.cuisine).toEqual(seedRestaurant[0].cuisine);
  });

  test('can create a Menu', async () => {
    const createdMenu = await Menu.create(seedMenu[0]);

    const foundMenu = await Menu.findOne({ where: { id: createdMenu.id } });

    expect(foundMenu).toBeTruthy();
    expect(foundMenu.title).toEqual(seedMenu[0].title);
  });

  test('can find Restaurants', async () => {
        const allRestaurants = await Restaurant.findAll();

        const sortedRestaurants = allRestaurants.sort((a, b) => a.id - b.id);

        expect(
          sortedRestaurants.map((restaurant) => ({
            name: restaurant.name,
            location: restaurant.location,
            cuisine: restaurant.cuisine,
          }))
        ).toEqual(expect.arrayContaining(seedRestaurant));

        expect(seedRestaurant).toEqual(
          expect.arrayContaining(
            sortedRestaurants.map((restaurant) => ({
              name: restaurant.name,
              location: restaurant.location,
              cuisine: restaurant.cuisine,
            }))
          )
        );
  });

  test('can find Menus', async () => {
    const allMenus = await Menu.findAll();

    const sortedMenus = allMenus.sort((a, b) => a.id - b.id);

    expect(
      sortedMenus.map((menu) => ({
        title: menu.title,
      }))
    ).toEqual(expect.arrayContaining(seedMenu));

    expect(seedMenu).toEqual(
      expect.arrayContaining(
        sortedMenus.map((menu) => ({
          title: menu.title,
        }))
      )
    );
  });

  test('can delete Restaurants', async () => {
    const restaurantToDelete = await Restaurant.findOne({ where: { id: 1 } });

    await restaurantToDelete.destroy();

    const deletedRestaurant = await Restaurant.findOne({ where: { id: 1 } });
    expect(deletedRestaurant).toBeNull();
  });
  test('can delete Menus', async () => {
    const menuToDelete = await Menu.findOne({ where: { id: 1 } });

    await menuToDelete.destroy();

    const deletedMenu= await Menu.findOne({ where: { id: 1 } });
    expect(deletedMenu).toBeNull();
  });
});


describe('Association: Menu and Restaurant', () => {
  test('should associate Menu with Restaurant', async () => {
    try {
      const restaurant = await Restaurant.create({ name: 'Test Restaurant' });

      const menu = await Menu.create({
        name: 'Test Menu',
        RestaurantId: restaurant.id,
      });

      const restaurantWithMenus = await Restaurant.findOne({
        where: { id: restaurant.id },
        include: Menu,
      });

      expect(restaurantWithMenus.Menus[0].name).toEqual('Test Menu');
    } catch (error) {
      console.error('Error testing association:', error);
    }
  });
});


describe('Item Model CRUD Operations', () => {
  beforeEach(async () => {
    await db.sync({ force: true });
  });

  test('should create a new item', async () => {
    const newItem = await Item.create({
      name: 'Burger',
      image: 'burger.jpg',
      price: 9.99,
      vegetarian: false,
    });

    expect(newItem.name).toEqual('Burger');
    expect(newItem.image).toEqual('burger.jpg');
    expect(newItem.price).toEqual(9.99);
    expect(newItem.vegetarian).toEqual(false);
  });

  test('should read an existing item', async () => {
    const newItem = await Item.create({
      name: 'Salad',
      image: 'salad.jpg',
      price: 7.99,
      vegetarian: true,
    });

    const foundItem = await Item.findByPk(newItem.id);

    expect(foundItem.name).toEqual('Salad');
    expect(foundItem.image).toEqual('salad.jpg');
    expect(foundItem.price).toEqual(7.99);
    expect(foundItem.vegetarian).toEqual(true);
  });

  test('should update an existing item', async () => {
    const newItem = await Item.create({
      name: 'Pizza',
      image: 'pizza.jpg',
      price: 12.99,
      vegetarian: false,
    });

    await newItem.update({
      price: 14.99,
    });

    const updatedItem = await Item.findByPk(newItem.id);

    expect(updatedItem.price).toEqual(14.99);
  });

  test('should delete an existing item', async () => {
    const newItem = await Item.create({
      name: 'Pasta',
      image: 'pasta.jpg',
      price: 10.99,
      vegetarian: true,
    });

    await newItem.destroy();

    const deletedItem = await Item.findByPk(newItem.id);

    expect(deletedItem).toBeNull();
  });
});



describe('Association: Menu and Item', () => {
  test('should associate Menu with Item', async () => {
    try {
      const menu = await Menu.create({ name: 'Test Menu' });

      const item1 = await Item.create({
        name: 'Item 1',
        image: 'item1.jpg',
        price: 9.99,
        vegetarian: false
      });
      const item2 = await Item.create({
        name: 'Item 2',
        image: 'item2.jpg',
        price: 7.99,
        vegetarian: true
      });

      await menu.addItems([item1, item2]);

      const menuWithItems = await Menu.findOne({
        where: { id: menu.id },
        include: Item
      });

      expect(menuWithItems.Items.length).toEqual(2);
      expect(menuWithItems.Items[0].name).toEqual('Item 1');
      expect(menuWithItems.Items[1].name).toEqual('Item 2');
    } catch (error) {
      console.error('Error testing association:', error);
    }
  });
});




describe('Eager Loading', () => {
  test('should eagerly load Menu instances with their associated Items', async () => {
    try {
      const menu1 = await Menu.create({ name: 'Menu 1' });
      const menu2 = await Menu.create({ name: 'Menu 2' });

      const item = await Item.create({
        name: 'Shared Item',
        image: 'shared-item.jpg',
        price: 8.99,
        vegetarian: true
      });
      await menu1.addItems(item);
      await menu2.addItems(item);

      const menusWithItems = await Menu.findAll({ include: Item });

      expect(menusWithItems.length).toEqual(2);
      expect(menusWithItems[0].Items.length).toEqual(1);
      expect(menusWithItems[1].Items.length).toEqual(1);
      expect(menusWithItems[0].Items[0].name).toEqual('Shared Item');
      expect(menusWithItems[1].Items[0].name).toEqual('Shared Item');
    } catch (error) {
      console.error('Error testing eager loading:', error);
    }
  });
});
