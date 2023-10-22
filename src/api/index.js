require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const data = require("./data.json");
const Spot = require('./models/spot');

const authRoutes = require('./routes/auth');
const spotRoutes = require('./routes/spot');
const calculateRoutes = require('./routes/calculate');

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/spots', spotRoutes);
app.use('/calculate', calculateRoutes);


const populateDatabase = async () => {
  try {
    // Check the current count of records in the "spots" table
    const recordCount = await Spot.count();

    if (recordCount === 0) {
      // If there are fewer than 0 records, insert new records
      const recordsToInsert = data.touristSpots.length;

      // Create an array of promises for parallel insertion
      const promisesArr = [];

      for (let i = 0; i < recordsToInsert; i++) {
        promisesArr.push(
          Spot.create(data.touristSpots[i])
        );
      }

      await Promise.all(promisesArr);

      console.log(`Database populated with ${recordsToInsert} new records.`);
    } else {
      console.log('Database already contains records. No need to populate.');
    }
  } catch (error) {
    console.error('Error populating the database:', error);
  }
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  populateDatabase();
});