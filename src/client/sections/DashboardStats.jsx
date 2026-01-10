import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Users,
  Target,
  Award,
  Star,
  Clock,
  TrendingUp as Fire,
  BarChart3,
  AlertCircle,
  Zap
} from "lucide-react";

export default function AdminStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({});
  const token = localStorage.getItem("token");

  // Calculate peak hour safely
  const calculatePeakHour = (events) => {
    if (!events || events.length === 0) {
      return { display: "No events", hour: "--", fullRange: "N/A" };
    }

    const hourCounts = {};
    let validEvents = 0;

    events.forEach(event => {
      if (event?.date) {
        try {
          const eventDate = new Date(event.date);
          if (!isNaN(eventDate.getTime())) {
            const hour = eventDate.getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
            validEvents++;
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    });

    if (validEvents === 0 || Object.keys(hourCounts).length === 0) {
      return { display: "No time data", hour: "--", fullRange: "N/A" };
    }

    const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
    const peakHourNum = parseInt(peakHour[0]);
    
    // Format for display
    const formatTime = (hour) => {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12} ${ampm}`;
    };

    const nextHour = (peakHourNum + 1) % 24;
    return {
      display: `${formatTime(peakHourNum)} - ${formatTime(nextHour)}`,
      hour: peakHourNum.toString(),
      fullRange: `${peakHourNum}:00 - ${nextHour}:00`,
      count: peakHour[1]
    };
  };

  // Calculate all statistics
  const calculateStats = (events, rsvps) => {
    const now = new Date();
    const validEvents = events?.filter(e => e?.date && !isNaN(new Date(e.date).getTime())) || [];
    
    // Most popular event
    const mostPopularEvent = validEvents.length > 0 
      ? validEvents.reduce((max, e) => (e.rsvp_count || 0) > (max?.rsvp_count || 0) ? e : max)
      : null;

    // Event counts
    const upcomingEvents = validEvents.filter(e => new Date(e.date) > now).length;
    const pastEvents = validEvents.filter(e => new Date(e.date) <= now).length;

    // Success rate
    const successfulEvents = validEvents.filter(e => (e.rsvp_count || 0) > 20).length;
    const successRate = validEvents.length > 0 
      ? Math.round((successfulEvents / validEvents.length) * 100)
      : 0;

    // Average RSVPs
    const totalRsvps = rsvps?.length || 0;
    const avgRsvpsPerEvent = validEvents.length > 0 
      ? (totalRsvps / validEvents.length).toFixed(1)
      : "0.0";

    // Trending category
    const categoryCounts = {};
    validEvents.forEach(event => {
      const category = event.category || event.type || "General";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    const trendingCategory = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])[0] || ["No categories", 0];

    // Peak hour
    const peakHour = calculatePeakHour(validEvents);

    // Growth rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEvents = validEvents.filter(e => new Date(e.date) > thirtyDaysAgo).length;
    const growthRate = validEvents.length > 0 
      ? ((recentEvents / validEvents.length) * 100).toFixed(1)
      : "0.0";

    return {
      totalEvents: validEvents.length,
      upcomingEvents,
      pastEvents,
      mostPopularEvent,
      avgRsvpsPerEvent,
      peakHour,
      successRate,
      trendingCategory: trendingCategory[0],
      growthRate,
      totalRsvps,
      successfulEvents,
      recentEvents: validEvents
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, rsvpsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/events", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/rsvps", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const statsData = calculateStats(eventsRes.data, rsvpsRes.data);
        setStats(statsData);

        // Animate key numbers
        const numbersToAnimate = {
          totalEvents: statsData.totalEvents,
          upcomingEvents: statsData.upcomingEvents,
          successRate: statsData.successRate
        };

        Object.entries(numbersToAnimate).forEach(([key, value]) => {
          setTimeout(() => {
            animateValue(key, 0, value, 800);
          }, 200);
        });

      } catch (error) {
        console.error("Error fetching statistics:", error);
        setStats({
          error: "Failed to load statistics",
          totalEvents: 0,
          upcomingEvents: 0,
          pastEvents: 0,
          peakHour: { display: "Error loading", hour: "--", fullRange: "N/A" },
          successRate: 0,
          avgRsvpsPerEvent: "0.0",
          trendingCategory: "Error",
          growthRate: "0.0",
          totalRsvps: 0,
          successfulEvents: 0,
          recentEvents: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const animateValue = (key, start, end, duration) => {
    const startTime = performance.now();
    
    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(progress * (end - start) + start);
      setAnimatedValues(prev => ({
        ...prev,
        [key]: current
      }));
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    requestAnimationFrame(updateValue);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (stats?.error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark-blue mb-2">Unable to load statistics</h3>
          <p className="text-gray-600 mb-4">Please check your connection and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color, subtitle, className = "" }) => {
    const colorMap = {
      blue: 'text-blue',
      'light-blue': 'text-light-blue',
      'teal-blue': 'text-teal-blue',
      'dark-blue': 'text-dark-blue'
    };

    return (
      <div className={`bg-white rounded-xl shadow-md p-4 sm:p-6 transition-all duration-300 hover:shadow-lg border border-very-light-blue ${className}`}>
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className={`p-2 sm:p-3 rounded-full ${colorMap[color]} bg-opacity-10`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-dark-blue">
          {animatedValues[title.toLowerCase().replace(/\s+/g, '')] ?? value}
        </h3>
        <p className="text-gray-700 font-medium text-sm sm:text-base">{title}</p>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6 md:space-y-8 bg-gradient-to-br from-very-light-blue/5 to-blue/5 min-h-screen">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue to-teal-blue bg-clip-text text-transparent">
          Event Analytics
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1 md:mt-2">
          Real-time insights into your event performance
        </p>
      </div>

      {/* Key Metrics Grid - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="blue"
          subtitle="All time"
        />
        
        <StatCard
          title="Upcoming"
          value={stats.upcomingEvents}
          icon={Target}
          color="light-blue"
          subtitle="Ready to launch"
        />
        
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={Award}
          color="teal-blue"
          subtitle="Events with >20 RSVPs"
          className="col-span-2 lg:col-span-1"
        />
        
        <StatCard
          title="Avg RSVPs"
          value={stats.avgRsvpsPerEvent}
          icon={Users}
          color="dark-blue"
          subtitle="Per event"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {/* Main Dashboard - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column: Star Event & Peak Hour */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Most Popular Event Card */}
          <div className="bg-gradient-to-r from-blue to-dark-blue rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-very-light-blue/10 rounded-full -translate-y-8 sm:-translate-y-10 md:-translate-y-16 translate-x-8 sm:translate-x-10 md:translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-very-light-blue" />
                    <h3 className="text-lg sm:text-xl font-bold">Star Event</h3>
                  </div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold line-clamp-2">
                    {stats.mostPopularEvent?.title || "No events yet"}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold">
                    {stats.mostPopularEvent?.rsvp_count || 0}
                  </div>
                  <p className="text-very-light-blue text-sm">RSVPs</p>
                </div>
              </div>
              <p className="text-very-light-blue opacity-90 text-sm md:text-base line-clamp-2">
                {stats.mostPopularEvent?.description?.slice(0, 80) || "Start creating events to see analytics"}
              </p>
            </div>
          </div>

          {/* Peak Hour Card */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-very-light-blue">
            <div className="flex items-center mb-4 md:mb-6 gap-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-teal-blue" />
              <h3 className="text-lg sm:text-xl font-bold text-dark-blue">Peak Hour</h3>
            </div>
            
            <div className="text-center py-4 md:py-8">
              {stats.peakHour.hour !== "--" ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                    <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                    <div className="text-4xl sm:text-5xl font-bold text-blue">
                      {stats.peakHour.hour}
                    </div>
                  </div>
                  <div className="text-gray-600 mb-2">Most events scheduled at</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-semibold text-dark-blue">
                    {stats.peakHour.display}
                  </div>
                  {stats.peakHour.count && (
                    <div className="text-sm text-gray-500 mt-2">
                      {stats.peakHour.count} events scheduled
                    </div>
                  )}
                </>
              ) : (
                <div className="py-6 md:py-8">
                  <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
                  <div className="text-2xl sm:text-3xl font-bold text-gray-400 mb-2">--</div>
                  <div className="text-gray-500">{stats.peakHour.display}</div>
                </div>
              )}
            </div>
            
            <p className="text-gray-500 text-xs sm:text-sm text-center mt-4">
              Schedule events during peak hours for maximum attendance
            </p>
          </div>
        </div>

        {/* Right Column: Insights */}
        <div className="space-y-4 md:space-y-6">
          {/* Trending Category */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-very-light-blue">
            <div className="flex items-center mb-4 gap-2">
              <Fire className="w-5 h-5 sm:w-6 sm:h-6 text-light-blue" />
              <h3 className="text-lg sm:text-xl font-bold text-dark-blue">Trending Category</h3>
            </div>
            <div className="text-center py-3 md:py-4">
              <div className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-light-blue to-teal-blue rounded-full">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  {stats.trendingCategory}
                </span>
              </div>
              <p className="text-gray-600 mt-3 md:mt-4 text-sm">
                Most popular event type
              </p>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-very-light-blue">
            <div className="flex items-center mb-3 md:mb-4 gap-2">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue" />
              <h3 className="text-lg sm:text-xl font-bold text-dark-blue">Recent Events</h3>
            </div>
            <div className="space-y-3">
              {stats.recentEvents.length > 0 ? (
                stats.recentEvents.map((event, index) => (
                  <div 
                    key={event.id || index} 
                    className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-very-light-blue/10 transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue text-white rounded-lg mr-2 sm:mr-3 font-bold text-sm sm:text-base">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-dark-blue truncate text-sm sm:text-base">
                        {event.title}
                      </h4>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right pl-2">
                      <div className="font-bold text-blue text-sm sm:text-base">
                        {event.rsvp_count || 0}
                      </div>
                      <div className="text-gray-500 text-xs">RSVPs</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No recent events</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-dark-blue to-very-dark-blue rounded-xl shadow-md p-4 md:p-6 text-white">
            <h3 className="text-lg sm:text-xl font-bold mb-3 md:mb-4">Quick Stats</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span>Event Growth</span>
                <span className="font-bold">{stats.growthRate}%</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span>Successful Events</span>
                <span className="font-bold">{stats.successfulEvents}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span>Total RSVPs</span>
                <span className="font-bold">{stats.totalRsvps}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span>Past Events</span>
                <span className="font-bold">{stats.pastEvents}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tip - Responsive */}
      <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-very-light-blue/10 to-light-blue/10 rounded-xl border border-teal-blue/20">
        <p className="text-dark-blue text-sm sm:text-base">
          💡 <span className="font-semibold">Pro Tip:</span>{" "}
          {stats.peakHour.hour !== "--" 
            ? `Schedule events around ${stats.peakHour.display} for better attendance.`
            : "Create more events to discover peak scheduling times."
          }{" "}
          Current success rate is <span className="font-bold">{stats.successRate}%</span>
        </p>
      </div>
    </div>
  );
}