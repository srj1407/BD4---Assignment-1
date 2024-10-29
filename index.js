const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function filterRestaurants(minRating) {
  let query = 'select * from restaurants';
  let queryResult = await db.all(query, []);
  return { restaurants: queryResult };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await filterRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found.`,
      });
    }
    res.status(200).json(result.restaurants);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterRestaurantsById(id) {
  let query = 'select * from restaurants where id = ?';
  let queryResult = await db.get(query, [id]);
  return { restaurants: queryResult };
}

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await filterRestaurantsById(id);
    if (result.restaurants === undefined) {
      return res.status(404).json({
        message: `No restaurants found with id : ${id}.`,
      });
    }
    res.status(200).json(result.restaurants);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterRestaurantsByCuisine(cuisine) {
  let query = 'select * from restaurants where cuisine = ?';
  let queryResult = await db.all(query, [cuisine]);
  return { restaurants: queryResult };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let result = await filterRestaurantsByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found with cuisine : ${cuisine}.`,
      });
    }
    res.status(200).json(result.restaurants);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterRestaurantsByLuxury(isVeg, isLuxury, hasOutdoorSeating) {
  let query =
    'select * from restaurants where isVeg = ? and isLuxury = ? and hasOutdoorSeating = ?';
  let queryResult = await db.all(query, [isVeg, isLuxury, hasOutdoorSeating]);
  return { restaurants: queryResult };
}

app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let isLuxury = req.query.isLuxury;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let result = await filterRestaurantsByLuxury(
      isVeg,
      isLuxury,
      hasOutdoorSeating
    );
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found.`,
      });
    }
    res.status(200).json(result.restaurants);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortedRestaurantsByRating() {
  let query = 'select * from restaurants order by rating desc';
  let queryResult = await db.all(query, []);
  return { restaurants: queryResult };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await sortedRestaurantsByRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found.`,
      });
    }
    res.status(200).json(result.restaurants);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchDishes() {
  let query = 'select * from dishes';
  let queryResult = await db.all(query, []);
  return { dishes: queryResult };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: `No dishes found.`,
      });
    }
    res.status(200).json(result.dishes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterDishesById(id) {
  let query = 'select * from dishes where id = ?';
  let queryResult = await db.get(query, [id]);
  return { dishes: queryResult };
}

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await filterDishesById(id);
    if (result.dishes === undefined) {
      return res.status(404).json({
        message: `No dishes found with id : ${id}.`,
      });
    }
    res.status(200).json(result.dishes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterDishes(isVeg) {
  let query = 'select * from restaurants where isVeg = ?';
  let queryResult = await db.all(query, [isVeg]);
  return { dishes: queryResult };
}

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let result = await filterDishes(isVeg);
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: `No dishes found.`,
      });
    }
    res.status(200).json(result.dishes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortedDishesByRating() {
  let query = 'select * from dishes order by price';
  let queryResult = await db.all(query, []);
  return { dishes: queryResult };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await sortedDishesByRating();
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: `No dishes found.`,
      });
    }
    res.status(200).json(result.dishes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
