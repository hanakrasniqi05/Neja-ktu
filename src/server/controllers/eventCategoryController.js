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

    if (!category) {
      const events = await EventCategory.getAllEvents();
      return res.json(events);
    }

    // category=1,2,3 → [1,2,3]
    const categoryIds = category.split(',').map(Number);

    const events = await EventCategory.getEventsByCategories(categoryIds);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
