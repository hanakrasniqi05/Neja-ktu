import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { eventAPI, commentAPI } from '../../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load event and comments
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      setEvent(null);
      setComments([]);
      
      try {
        // Fetch event
        const eventRes = await eventAPI.getById(id);
        setEvent(eventRes.data);
        
        // Fetch comments
        setCommentsLoading(true);
        const commentsRes = await commentAPI.getByEvent(id);
        setComments(commentsRes.data);
        setCommentsLoading(false);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]); // Only depend on id

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to comment");
        return;
      }

  const res = await commentAPI.create(
 { eventId: id, content: newComment },
 { headers: { Authorization: `Bearer ${token}` } }
);
    setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (error) {
     console.error("Error posting comment:", error.response?.data || error.message);
      alert("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

const [role, setRole] = useState(null);

useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) setRole(userData.role); 
}, []);

  const handleRSVP = async () => {
  setRsvpLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to RSVP");

    const res = await axios.post(
      "http://localhost:5000/api/rsvps",
      { event_id: id, status: "attending" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert(res.data.message || "RSVP successful!");
    // Optional: update state instead of navigating
  } catch (error) {
    console.error("RSVP failed:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to RSVP. Please try again.");
  } finally {
    setRsvpLoading(false);
  }
};
const handleInterested = async () => {
  setRsvpLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to mark interest");

    const res = await axios.post(
      "http://localhost:5000/api/rsvps",
      { event_id: id, status: "interested" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert(res.data.message || "Event saved as Interested!");
    // Optional: update state instead of navigating
  } catch (error) {
    console.error("Interested action failed:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to save interest. Please try again.");
  } finally {
    setRsvpLoading(false);
  }
};

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading event...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto p-6 min-h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-10">
            <h2 className="text-lg font-semibold text-red-800">Error</h2>
            <p className="text-red-600 mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto p-6 min-h-screen">
          <div className="text-center mt-10">
            <p className="text-red-500 text-xl mb-4">Event not found.</p>
            <button 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const startDate = new Date(event.StartDateTime).toLocaleDateString();
  const endDate = new Date(event.EndDateTime).toLocaleDateString();
  const now = new Date();
  const eventEnd = new Date(event.EndDateTime);
  const isPastEvent = eventEnd < now;

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
            src={event.CompanyLogo || event.companyLogo || '/default-company.png'}
            alt="Organizer"
            className="w-12 h-12 rounded-full mr-3"
          />
        <div>
          <p className="text-gray-600">
            Organized by{" "}
           <span className="font-semibold">
             {event.CompanyName || "Unknown Company"}
           </span>
          </p>
          <p className="text-gray-500">
         📍 {event.Location || "Location not specified"}
          </p>
       </div>
      </div>

        {/* Description */}
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line mb-6">{event.Description}</p>

        {/* RSVP Button */}
        <div className="mt-6 mb-8">
  {isPastEvent ? (
    <div className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg text-center font-medium">
      This event has already ended. RSVPs are closed.
    </div>
  ) : (
    <div className="flex gap-4">
      <button
        onClick={handleRSVP}
        disabled={rsvpLoading}
        className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold shadow hover:bg-yellow-500 disabled:opacity-50"
      >
        {rsvpLoading ? "Processing..." : "RSVP"}
      </button>

      <button
        onClick={handleInterested}
        disabled={rsvpLoading}
        className="px-6 py-2 bg-teal-blue text-white rounded-lg font-semibold shadow hover:bg-blue-500 disabled:opacity-50"
      >
        {rsvpLoading ? "Processing..." : "Interested"}
      </button>
    </div>
  )}
</div>

        {/* Comments Section */}
        <div className="mt-8 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">
            Comments ({commentsLoading ? "..." : comments.length})
          </h2>

          {/* Add comment form */}
         <form onSubmit={handleAddComment} className="mb-6">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full border rounded p-3 pr-24 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 resize-vertical"
                rows={3}
              />
              {/* Button */}
              <div className="absolute bottom-3 right-3 z-10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-teal-blue text-white rounded-lg font-semibold shadow hover:bg-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting
                    </span>
                  ) : "Post"}
                </button>
              </div>
            </div>
          </form>

          {/* Comment list */}
          {commentsLoading ? (
            <p className="text-gray-500 text-center py-4">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.CommentID || comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <img
                      src={
                      comment.ProfilePicture
                      ? `http://localhost:5000/${comment.ProfilePicture.replace(/^\/+/, '')}`
                      : '/default-user.png'
                    }
                    alt="User avatar"
                     className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium">
                        {comment.FirstName || comment.firstName} 
                        {comment.LastName || comment.lastName ? ` ${comment.LastName || comment.lastName}` : ''}
                      </p>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.CreatedAt || comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.Content || comment.content || comment.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventDetailsPage;
