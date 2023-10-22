// routes/spot.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Spot = require('../models/spot');

// Add the JWT middleware for authentication
router.use(authMiddleware);

// Define a route for fetching the tourist spots
router.get('/', async (req, res) => {
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

router.get('/:name', async (req, res) => {
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

router.post('/calculate', async (req, res) => {
    try {
        const r = req.body;

        const spot = await Spot.findOne({
            where: { name: r.touristSpot },
        });

        if (!spot) {
            return res.status(404).json({ error: 'The Selected Tourist spot is not valid' });
        }

        if (spot.cycling) {
            const distance = calculateTimeToSpot(r, spot);
            const timeToReachSpot = Math.ceil((distance / r.cyclingSpeed) / r.dailyCyclingHours);
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
  

module.exports = router;
