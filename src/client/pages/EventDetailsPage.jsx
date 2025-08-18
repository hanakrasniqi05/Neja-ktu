import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventAPI, commentAPI } from '../../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const res = await eventAPI.getById(id);
      setEvent(res.data);
    } catch (error) {
      console.error('Failed to load event', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await commentAPI.getByEvent(id);
      setComments(res.data);
    } catch (error) {
      console.error('Failed to load comments', error);
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchComments();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading event...</p>;
  }

  if (!event) {
    return <p className="text-center mt-10 text-red-500">Event not found.</p>;
  }

  const startDate = new Date(event.StartDateTime).toLocaleDateString();
  const endDate = new Date(event.EndDateTime).toLocaleDateString();

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-6">
        {/* Banner */}
        <div className="relative h-64 w-full mb-6">
          <img
            src={event.Image || '/default-event.jpg'}
            alt={event.Title}
            className="w-full h-full object-cover rounded-lg shadow"
          />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded">
            <h1 className="text-2xl font-bold">{event.Title}</h1>
            <p>{startDate} – {endDate}</p>
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center mb-4">
          <img
            src={event.companyLogo || '/default-company.png'}
            alt="Organizer"
            className="w-12 h-12 rounded-full mr-3"
          />
          <p className="text-gray-600">Organized by Company</p>
        </div>

        {/* Description */}
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{event.Description}</p>

        {/* RSVP Button */}
        <div className="mt-6">
          <button className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold shadow hover:bg-yellow-500">
            RSVP
          </button>
        </div>

        {/* Comments */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Comments</h2>
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <ul className="space-y-2">
              {comments.map((c) => (
                <li key={c.CommentID} className="border p-2 rounded bg-gray-50">
                  <p className="text-sm">{c.content}</p>
                  <span className="text-xs text-gray-500">— {c.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventDetailsPage;
