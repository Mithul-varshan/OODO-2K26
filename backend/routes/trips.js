const express = require('express');
const router = express.Router();
const db = require('../db');

// Simple helper to extract YYYY-MM-DD from any date string
const toDateString = (dateStr) => {
  if (!dateStr) return null;
  if (typeof dateStr === 'string' && dateStr.includes('T')) {
    return dateStr.split('T')[0];
  }
  return dateStr;
};

// GET all trips
router.get('/', async (req, res) => {
  try {
    const [trips] = await db.query(`
      SELECT * FROM trips 
      ORDER BY created_at DESC
    `);

    // For each trip, get stops and activities
    for (let trip of trips) {
      const [stops] = await db.query(`
        SELECT * FROM stops 
        WHERE trip_id = ? 
        ORDER BY order_index ASC
      `, [trip.id]);

      // For each stop, get activities
      for (let stop of stops) {
        const [activities] = await db.query(`
          SELECT * FROM activities 
          WHERE stop_id = ? 
          ORDER BY order_index ASC
        `, [stop.id]);
        
        stop.activities = activities;
      }

      trip.stops = stops;

      // Get suggested activities
      const [suggestedActivities] = await db.query(`
        SELECT * FROM suggested_activities 
        WHERE trip_id = ?
      `, [trip.id]);
      
      trip.selectedActivities = suggestedActivities;
    }

    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// GET single trip by ID
router.get('/:id', async (req, res) => {
  try {
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ?', [req.params.id]);
    
    if (trips.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const trip = trips[0];

    // Get stops
    const [stops] = await db.query(`
      SELECT * FROM stops 
      WHERE trip_id = ? 
      ORDER BY order_index ASC
    `, [trip.id]);

    // For each stop, get activities
    for (let stop of stops) {
      const [activities] = await db.query(`
        SELECT * FROM activities 
        WHERE stop_id = ? 
        ORDER BY order_index ASC
      `, [stop.id]);
      
      stop.activities = activities;
    }

    trip.stops = stops;

    // Get suggested activities
    const [suggestedActivities] = await db.query(`
      SELECT * FROM suggested_activities 
      WHERE trip_id = ?
    `, [trip.id]);
    
    trip.selectedActivities = suggestedActivities;

    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// CREATE new trip
router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      tripName,
      name,
      toDateString(startDate),
      toDateString(endDate),
      selectedPlace,
      budget,
      stops = [],
      selectedActivities = []
    } = req.body;

    // Validate required dates for stops
    if (stops.length > 0) {
      for (const stop of stops) {
        if (!stop.arrivalDate || !stop.departureDate) {
          await connection.rollback();
          return res.status(400).json({ 
            error: 'All stops must have arrival and departure dates' 
          });
        }
      }
    }

    // Insert trip
    const [tripResult] = await connection.query(`
      INSERT INTO trips (
        user_id, name, start_date, end_date, 
        destination, budget
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      1, // Default user ID (you can add authentication later)
      tripName || name || selectedPlace || 'Unnamed Trip',
      toDateString(startDate),
      toDateString(endDate),
      selectedPlace || '',
      budget || 0
    ]);

    const tripId = tripResult.insertId;

    // Insert stops
    if (stops.length > 0) {
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        const [stopResult] = await connection.query(`
          INSERT INTO stops (
            trip_id, city_name, city_country, 
            city_lat, city_lng, arrival_date, 
            departure_date, order_index, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          tripId,
          stop.city?.name || stop.cityName || stop.city_name || '',
          stop.city?.country || stop.cityCountry || '',
          stop.city?.latitude || null,
          stop.city?.longitude || null,
          formatDateForMySQL(stop.arrivalDate),
          formatDateForMySQL(stop.departureDate),
          i,
          stop.notes || ''
        ]);

        const stopId = stopResult.insertId;

        // Insert activities for this stop
        if (stop.activities && stop.activities.length > 0) {
          for (let j = 0; j < stop.activities.length; j++) {
            const activity = stop.activities[j];
            await connection.query(`
              INSERT INTO activities (
                stop_id, name, type, cost, icon, 
                location, date, time, notes, 
                is_custom, order_index
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              stopId,
              activity.name || '',
              activity.type || '',
              activity.cost || 0,
              activity.icon || '',
              activity.location || '',
              formatDateForMySQL(activity.date),
              activity.time || '',
              activity.notes || '',
              activity.isCustom || false,
              j
            ]);
          }
        }
      }
    }

    // Insert suggested activities
    if (selectedActivities.length > 0) {
      for (const activity of selectedActivities) {
        await connection.query(`
          INSERT INTO suggested_activities (
            trip_id, name, type, cost, icon, location, image
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          tripId,
          activity.title || activity.name || '',
          activity.type || '',
          parseFloat(activity.cost?.replace('$', '')) || 0,
          activity.icon || '',
          activity.location || '',
          activity.image || ''
        ]);
      }
    }

    await connection.commit();

    // Fetch the complete trip with all relations
    const [trips] = await connection.query('SELECT * FROM trips WHERE id = ?', [tripId]);
    const trip = trips[0];

    // Get stops with activities
    const [stopsResult] = await connection.query(`
      SELECT * FROM stops 
      WHERE trip_id = ? 
      ORDER BY order_index ASC
    `, [tripId]);

    for (let stop of stopsResult) {
      const [activities] = await connection.query(`
        SELECT * FROM activities 
        WHERE stop_id = ? 
        ORDER BY order_index ASC
      `, [stop.id]);
      stop.activities = activities;
    }

    trip.stops = stopsResult;

    const [suggestedActivitiesResult] = await connection.query(`
      SELECT * FROM suggested_activities 
      WHERE trip_id = ?
    `, [tripId]);
    trip.selectedActivities = suggestedActivitiesResult;

    res.status(201).json(trip);
  } catch (error) {
    await connection.rollback();
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  } finally {
    connection.release();
  }
});

// UPDATE trip
router.put('/:id', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const tripId = req.params.id;
    const { name, toDateString(startDate), toDateString(endDate), budget, stops = [] } = req.body;

    // Validate required dates for stops
    if (stops.length > 0) {
      for (const stop of stops) {
        if (!stop.arrivalDate || !stop.departureDate) {
          await connection.rollback();
          return res.status(400).json({ 
            error: 'All stops must have arrival and departure dates' 
          });
        }
      }
    }

    // Update trip
    await connection.query(`
      UPDATE trips 
      SET name = ?, start_date = ?, end_date = ?, budget = ?
      WHERE id = ?
    `, [name, formatDateForMySQL(startDate), formatDateForMySQL(endDate), budget || 0, tripId]);

    // Delete existing stops and activities (cascade will handle activities)
    await connection.query('DELETE FROM stops WHERE trip_id = ?', [tripId]);

    // Insert new stops
    if (stops.length > 0) {
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        const [stopResult] = await connection.query(`
          INSERT INTO stops (
            trip_id, city_name, city_country, 
            city_lat, city_lng, arrival_date, 
            departure_date, order_index, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          tripId,
          stop.city?.name || stop.cityName || stop.city_name || '',
          stop.city?.country || stop.cityCountry || '',
          stop.city?.latitude || null,
          stop.city?.longitude || null,
          formatDateForMySQL(stop.arrivalDate),
          formatDateForMySQL(stop.departureDate),
          i,
          stop.notes || ''
        ]);

        const stopId = stopResult.insertId;

        // Insert activities for this stop
        if (stop.activities && stop.activities.length > 0) {
          for (let j = 0; j < stop.activities.length; j++) {
            const activity = stop.activities[j];
            await connection.query(`
              INSERT INTO activities (
                stop_id, name, type, cost, icon, 
                location, date, time, notes, 
                is_custom, order_index
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              stopId,
              activity.name || '',
              activity.type || '',
              activity.cost || 0,
              activity.icon || '',
              activity.location || '',
              formatDateForMySQL(activity.date),
              activity.time || '',
              activity.notes || '',
              activity.isCustom || false,
              j
            ]);
          }
        }
      }
    }

    await connection.commit();

    // Fetch updated trip
    const [trips] = await connection.query('SELECT * FROM trips WHERE id = ?', [tripId]);
    const trip = trips[0];

    const [stopsResult] = await connection.query(`
      SELECT * FROM stops 
      WHERE trip_id = ? 
      ORDER BY order_index ASC
    `, [tripId]);

    for (let stop of stopsResult) {
      const [activities] = await connection.query(`
        SELECT * FROM activities 
        WHERE stop_id = ? 
        ORDER BY order_index ASC
      `, [stop.id]);
      stop.activities = activities;
    }

    trip.stops = stopsResult;

    res.json(trip);
  } catch (error) {
    await connection.rollback();
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  } finally {
    connection.release();
  }
});

// UPDATE trip budget
router.patch('/:id/budget', async (req, res) => {
  try {
    const { budget } = req.body;
    
    await db.query(`
      UPDATE trips 
      SET budget = ?
      WHERE id = ?
    `, [budget || 0, req.params.id]);

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ?', [req.params.id]);
    
    if (trips.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trips[0]);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// DELETE trip
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM trips WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

module.exports = router;
