const EventCategory = require('../models/eventCategory');

exports.getCategories = async (req, res) => {
  try {
    const categories = await EventCategory.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { category } = req.query;
    const events = category 
      ? await EventCategory.getEventsByCategory(category)
      : await EventCategory.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};