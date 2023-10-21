require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const haversine = require('haversine')

const app = express();
const port = process.env.PORT || 3000;

const data = require("./data.json");
const authMiddleware = require('./authMiddleware');
const Spot = require('./models/spot');
const User = require('./models/user');

app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET;

// Define a POST raoute for user authentication
app.post('/auth', async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = await User.findOne({
    where: { username: username, password: password },
  });

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });

  res.json({ token });
});

// Define a route for fetching the tourist spots
app.get('/spots', authMiddleware, async (req, res) => {
  try {
    // Fetch the 10 spots and select only the name field
    const spots = await Spot.findAll({
      attributes: ['name', 'cycling'],
      limit: 10,
    });

    res.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/spots/:name', authMiddleware, async (req, res) => {
  try {
    const { name } = req.params;
    const spot = await Spot.findOne({
      where: { name: name },
    });
    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }
    res.json(spot);
  } catch (error) {
    console.error('Error getting spot information:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/calculate', authMiddleware, async (req, res) => {
  try {
    const r = req.body;

    const spot = await Spot.findOne({
      where: { name: r.touristSpot },
    });

    if (!spot) {
      return res.status(404).json({ error: 'The Selected Tourist spot is not valid' });
    }

    if (spot.cycling) {
      const distance = calculateTimeToSpot(r,spot);
      const timeToReachSpot = Math.ceil((distance / r.cyclingSpeed)/r.dailyCyclingHours);
      res.json({ timeToReachSpot }); // in days
    } else {
      res.json({ msg: 'Tourist Spot is not accessible by cycling' });
    }

  } catch (error) {
    console.error('Error getting spot information:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const calculateTimeToSpot = (r,spot) => {
  const start = {
    latitude: r.latitude,
    longitude: r.longitude
  }
  const end = {
    latitude: spot.latitude,
    longitude: spot.latitude,
  }

  return Math.round(haversine(start, end, {unit: 'km'}));
}

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