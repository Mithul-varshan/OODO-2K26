const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTrips).post(protect, createTrip);
router.route('/:id').get(protect, getTripById).put(protect, updateTrip).delete(protect, deleteTrip);

router.route('/:tripId/stops').post(protect, addStop);
router.route('/stops/:stopId').delete(protect, deleteStop);

router.route('/:stopId/activities').post(protect, addActivity);
router.route('/activities/:activityId').delete(protect, deleteActivity);

router.route('/:tripId/budget').get(protect, getTripBudget);

module.exports = router;
