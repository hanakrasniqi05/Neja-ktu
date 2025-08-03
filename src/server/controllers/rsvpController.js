const RSVP = require('../models/rsvp');

// Create RSVP
exports.createRSVP = async (req, res) => {
  const { user_id, event_id, status } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ success: false, message: 'user_id and event_id are required' });
  }

  try {
    //exists?
    const existing = await RSVP.getRSVP(user_id, event_id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'RSVP already exists for this user and event' });
    }

    const rsvpId = await RSVP.createRSVP(user_id, event_id, status);
    res.status(201).json({ success: true, message: 'RSVP created', rsvp_id: rsvpId });
  } catch (error) {
    console.error('CREATE RSVP ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all RSVPs for event
exports.getRSVPsByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const rsvps = await RSVP.getRSVPsByEvent(eventId);
    res.json({ success: true, data: rsvps });
  } catch (error) {
    console.error('GET RSVPS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update RSVP status
exports.updateRSVP = async (req, res) => {
  const { user_id, event_id, status } = req.body;

  if (!user_id || !event_id || !status) {
    return res.status(400).json({ success: false, message: 'user_id, event_id, and status are required' });
  }

  try {
    const affected = await RSVP.updateRSVP(user_id, event_id, status);

    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'RSVP not found' });
    }

    res.json({ success: true, message: 'RSVP status updated' });
  } catch (error) {
    console.error('UPDATE RSVP ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete RSVP
exports.deleteRSVP = async (req, res) => {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ success: false, message: 'user_id and event_id are required' });
  }

  try {
    const affected = await RSVP.deleteRSVP(user_id, event_id);

    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'RSVP not found' });
    }

    res.json({ success: true, message: 'RSVP deleted' });
  } catch (error) {
    console.error('DELETE RSVP ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
