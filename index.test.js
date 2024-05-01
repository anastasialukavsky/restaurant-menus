const { db } = require('./db');
const { Restaurant, Menu } = require('./models/index');
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
