import { useState, useEffect } from "react";
import { api } from "./api";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await api("/members");
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  return (
    <>
      <h3>Library members ({members.length})</h3>

      {error && <div className="error">{error}</div>}

      {members.length === 0 && !error && <p>No members yet.</p>}

      {members.length > 0 && (
        <table className="issued-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member._id}>
                <td>{index + 1}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}