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
  const navigate = useNavigate();

  // Fetch event details
  const fetchEvent = async () => {
    try {
      const res = await eventAPI.getById(id);
      setEvent(res.data);
    } catch (error) {
      console.error('Failed to load event', error);
    }
  };

  // Fetch comments with user details
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const res = await commentAPI.getById(id); 
      console.log("Fetched comments:", res.data);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Load eventet and comments
  useEffect(() => {
    if (id) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchEvent(), fetchComments()]);
        setLoading(false);
      };
      loadData();
    }
  }, [id]);

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
      if (!token) {
        alert("You must be logged in to RSVP");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/rsvp",
        { event_id: id, status: "attending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("RSVP successful!");
       if (role === "user") {
      navigate("/user-dashboard");
      } 
    }catch (error) {
      console.error("RSVP failed:", error.response?.data || error.message);
      alert("Failed to RSVP. Please try again.");
    } finally {
      setRsvpLoading(false);
    }
  };
    const handleInterested = async () => {
    setRsvpLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to mark interest");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/rsvp",
        { event_id: id, status: "interested" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Event saved as Interested!");
      if (role === "user") {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error("Interested action failed:", error.response?.data || error.message);
      alert("Failed to save interest. Please try again.");
    } finally {
      setRsvpLoading(false);
    }
  };


  if (loading) {
    return (
      <>
        <Header />
        <p className="text-center mt-10">Loading event...</p>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Header />
        <p className="text-center mt-10 text-red-500">Event not found.</p>
        <Footer />
      </>
    );
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
          <p className="text-gray-600">Organized by {event.CompanyName || "Company"}</p>
        </div>

        {/* Description */}
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line mb-6">{event.Description}</p>

        {/* RSVP Button */}
       <div className="mt-6 mb-8 flex gap-4">
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
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors shadow-md"
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
                      src={comment.ProfilePic || comment.profilePicture || "/default-user.png"}
                      alt="User"
                      className="w-8 h-8 rounded-full mr-2"
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
