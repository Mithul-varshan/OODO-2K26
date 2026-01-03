const db = require('../db');

// --- Trips ---

const createTrip = async (req, res) => {
  const { title, start_date, end_date, description, cover_photo } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO trips (user_id, title, start_date, end_date, description, cover_photo) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, start_date, end_date, description, cover_photo]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrips = async (req, res) => {
  try {
    const [trips] = await db.query('SELECT * FROM trips WHERE user_id = ? ORDER BY start_date DESC', [req.user.id]);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    const trip = trips[0];

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Get stops
    const [stops] = await db.query('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC', [trip.id]);
    
    // Get activities for each stop
    for (let stop of stops) {
      const [activities] = await db.query('SELECT * FROM activities WHERE stop_id = ?', [stop.id]);
      stop.activities = activities;
    }

    trip.stops = stops;
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTrip = async (req, res) => {
  const { title, start_date, end_date, description, cover_photo } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE trips SET title = ?, start_date = ?, end_date = ?, description = ?, cover_photo = ? WHERE id = ? AND user_id = ?',
      [title, start_date, end_date, description, cover_photo, req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Stops ---

const addStop = async (req, res) => {
  const { city_name, country, arrival_date, departure_date, order_index } = req.body;
  const tripId = req.params.tripId;

  try {
    // Verify trip ownership
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const [result] = await db.query(
      'INSERT INTO stops (trip_id, city_name, country, arrival_date, departure_date, order_index) VALUES (?, ?, ?, ?, ?, ?)',
      [tripId, city_name, country, arrival_date, departure_date, order_index]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStop = async (req, res) => {
  try {
    // Verify ownership via join or two queries. Two queries is safer/easier to read here.
    const [stops] = await db.query('SELECT * FROM stops WHERE id = ?', [req.params.stopId]);
    if (stops.length === 0) return res.status(404).json({ message: 'Stop not found' });
    
    const stop = stops[0];
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [stop.trip_id, req.user.id]);
    if (trips.length === 0) return res.status(401).json({ message: 'Not authorized' });

    await db.query('DELETE FROM stops WHERE id = ?', [req.params.stopId]);
    res.json({ message: 'Stop removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Activities ---

const addActivity = async (req, res) => {
  const { name, type, cost, activity_date, activity_time } = req.body;
  const stopId = req.params.stopId;

  try {
    // Verify ownership
    const [stops] = await db.query('SELECT * FROM stops WHERE id = ?', [stopId]);
    if (stops.length === 0) return res.status(404).json({ message: 'Stop not found' });
    
    const stop = stops[0];
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [stop.trip_id, req.user.id]);
    if (trips.length === 0) return res.status(401).json({ message: 'Not authorized' });

    const [result] = await db.query(
      'INSERT INTO activities (stop_id, name, type, cost, activity_date, activity_time) VALUES (?, ?, ?, ?, ?, ?)',
      [stopId, name, type, cost, activity_date, activity_time]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const [activities] = await db.query('SELECT * FROM activities WHERE id = ?', [req.params.activityId]);
    if (activities.length === 0) return res.status(404).json({ message: 'Activity not found' });

    const activity = activities[0];
    const [stops] = await db.query('SELECT * FROM stops WHERE id = ?', [activity.stop_id]);
    const stop = stops[0];
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [stop.trip_id, req.user.id]);
    if (trips.length === 0) return res.status(401).json({ message: 'Not authorized' });

    await db.query('DELETE FROM activities WHERE id = ?', [req.params.activityId]);
    res.json({ message: 'Activity removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Budget ---

const getTripBudget = async (req, res) => {
  const tripId = req.params.tripId;
  try {
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) return res.status(404).json({ message: 'Trip not found' });

    // Calculate costs from activities
    const [activityCosts] = await db.query(`
      SELECT SUM(cost) as total_activity_cost 
      FROM activities 
      JOIN stops ON activities.stop_id = stops.id 
      WHERE stops.trip_id = ?
    `, [tripId]);

    // Calculate other expenses
    const [expenses] = await db.query('SELECT * FROM expenses WHERE trip_id = ?', [tripId]);
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    res.json({
      trip_id: tripId,
      total_activity_cost: activityCosts[0].total_activity_cost || 0,
      total_expenses: totalExpenses,
      expenses: expenses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addStop,
  deleteStop,
  addActivity,
  deleteActivity,
  getTripBudget
};
