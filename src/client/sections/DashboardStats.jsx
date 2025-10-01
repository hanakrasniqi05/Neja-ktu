import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminStatistics() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, companiesRes, eventsRes, rsvpsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/companies/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/events", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/rsvps", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const users = usersRes.data;
        const companies = companiesRes.data;
        const events = eventsRes.data;
        const rsvps = rsvpsRes.data;

        // Calculate stats
        const userRoles = {
          users: users.filter((u) => u.role === "user").length,
          companies: users.filter((u) => u.role === "company").length,
          admins: users.filter((u) => u.role === "admin").length,
        };

        const companyStatus = {
          pending: companies.filter((c) => c.verification_status === "pending")
            .length,
          verified: companies.filter((c) => c.verification_status === "verified")
            .length,
          rejected: companies.filter((c) => c.verification_status === "rejected")
            .length,
        };

        const now = new Date();
        const eventStats = {
          total: events.length,
          upcoming: events.filter((e) => new Date(e.date) > now).length,
          past: events.filter((e) => new Date(e.date) <= now).length,
        };

        const mostPopularEvent =
          events.length > 0
            ? events.reduce((max, e) =>
                e.rsvp_count > (max?.rsvp_count || 0) ? e : max
              )
            : null;

        setStats({
          userRoles,
          companyStatus,
          eventStats,
          totalRsvps: rsvps.length,
          mostPopularEvent,
          latestUsers: users.slice(-5).reverse(),
          pendingCompanies: companies
            .filter((c) => c.verification_status === "pending")
            .slice(-5)
            .reverse(),
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, [token]);

  if (!stats) return <p>Loading statistics...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {/* Users Overview */}
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <h3 className="font-bold text-lg mb-2">Users</h3>
        <p>Total: {stats.userRoles.users + stats.userRoles.companies + stats.userRoles.admins}</p>
        <p>Users: {stats.userRoles.users}</p>
        <p>Companies: {stats.userRoles.companies}</p>
        <p>Admins: {stats.userRoles.admins}</p>
      </div>

      {/* Companies Overview */}
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <h3 className="font-bold text-lg mb-2">Companies</h3>
        <p>Pending: {stats.companyStatus.pending}</p>
        <p>Verified: {stats.companyStatus.verified}</p>
        <p>Rejected: {stats.companyStatus.rejected}</p>
      </div>

      {/* Events Overview */}
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <h3 className="font-bold text-lg mb-2">Events</h3>
        <p>Total: {stats.eventStats.total}</p>
        <p>Upcoming: {stats.eventStats.upcoming}</p>
        <p>Past: {stats.eventStats.past}</p>
      </div>

      {/* RSVPs */}
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <h3 className="font-bold text-lg mb-2">RSVPs</h3>
        <p>Total RSVPs: {stats.totalRsvps}</p>
        {stats.mostPopularEvent && (
          <p>
            Most Popular: {stats.mostPopularEvent.title} (
            {stats.mostPopularEvent.rsvp_count} RSVPs)
          </p>
        )}
      </div>

      {/* Latest Users */}
      <div className="bg-white shadow rounded-lg p-4 col-span-1 md:col-span-2">
        <h3 className="font-bold text-lg mb-2">Latest Users</h3>
        <ul>
          {stats.latestUsers.map((user) => (
            <li key={user.UserId} className="border-b py-1">
              {user.firstName} {user.lastName} ({user.role})
            </li>
          ))}
        </ul>
      </div>

      {/* Pending Companies */}
      <div className="bg-white shadow rounded-lg p-4 col-span-1 md:col-span-2">
        <h3 className="font-bold text-lg mb-2">Recent Pending Companies</h3>
        <ul>
          {stats.pendingCompanies.map((c) => (
            <li key={c.id} className="border-b py-1">
              {c.company_name} – submitted{" "}
              {c.created_at
                ? new Date(c.created_at).toLocaleDateString()
                : "N/A"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
