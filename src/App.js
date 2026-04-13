import { useState } from "react";

function App() {

  // ========================
  // STATE
  // ========================

  const [newItem, setNewItem] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");

  const [giveaway, setGiveaway] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [history, setHistory] = useState([]);
  const [fairness, setFairness] = useState([]);

  // ========================
  // API CALLS
  // ========================

  const login = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      alert("Login successful");
    } else {
      alert(data.message);
    }
  };

  const createGiveaway = async () => {
    await fetch("http://localhost:5000/create-giveaway", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        item: newItem,
        owner: newOwner,
      }),
    });

    alert("Giveaway Created!");

    getGiveaway();
  };

  const getGiveaway = async () => {
    const res = await fetch("http://localhost:5000/giveaway");
    const data = await res.json();
    setGiveaway(data);
  };

  const getUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data.users);
  };

  const getHistory = async () => {
    const res = await fetch("http://localhost:5000/history");
    const data = await res.json();
    setHistory(data.history);
  };

  const getFairness = async () => {
    const res = await fetch("http://localhost:5000/fairness");
    const data = await res.json();
    setFairness(data.users);
  };

  const sendToGreatness = async () => {
    await fetch("http://localhost:5000/greatness", {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    getGiveaway();
    getHistory();
  };

  const accept = async () => {
    await fetch("http://localhost:5000/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ user: name }),
    });

    getGiveaway();
  };

  const transfer = async () => {
    await fetch("http://localhost:5000/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        from: name,
        to: selectedUser,
      }),
    });

    getGiveaway();
    getHistory();
  };

  // ========================
  // UI
  // ========================

  return (
    <div
      style={{
        fontFamily: "Arial",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        padding: "20px",
      }}
    >

      <h1 style={{ textAlign: "center" }}>
        🎁 GREATNESS GIVEAWAY
      </h1>

      {/* LOGIN */}

      {!token ? (

        <div
          style={{
            maxWidth: "400px",
            margin: "auto",
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >

          <h3>Login</h3>

          <input
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          />

          <br /><br />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          />

          <br /><br />

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Login
          </button>

        </div>

      ) : (

        <div style={{ maxWidth: "600px", margin: "auto" }}>

          {/* ADMIN PANEL */}

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >

            <h3>Dashboard</h3>

            <h4>Admin Panel 👑</h4>

            <input
              placeholder="Giveaway Item"
              onChange={(e) => setNewItem(e.target.value)}
              style={{ padding: "8px", marginRight: "10px" }}
            />

            <select
              onChange={(e) =>
                setNewOwner(e.target.value)
              }
            >

              <option>Select Owner</option>

              {users.map((u, i) => (
                <option key={i} value={u.name}>
                  {u.name}
                </option>
              ))}

            </select>

            <button
              onClick={createGiveaway}
              style={{ marginLeft: "10px" }}
            >
              Create Giveaway 🎁
            </button>

            <br /><br />

            <button onClick={getGiveaway}>
              Load Giveaway
            </button>

            <button
              onClick={getUsers}
              style={{ marginLeft: "10px" }}
            >
              Load Users
            </button>

            <button
              onClick={getHistory}
              style={{ marginLeft: "10px" }}
            >
              Load History
            </button>

            <button
              onClick={getFairness}
              style={{ marginLeft: "10px" }}
            >
              Load Fairness 📊
            </button>

          </div>

          {/* GIVEAWAY DISPLAY */}

          {giveaway && (

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              }}
            >

              <h2>{giveaway.item}</h2>

              <p>
                <strong>Owner:</strong>{" "}
                {giveaway.currentOwner}
              </p>

              <p>
                <strong>Accepted:</strong>{" "}
                {giveaway.accepted ? "Yes" : "No"}
              </p>

              <button onClick={sendToGreatness}>
                🎲 Send to GREATNESS
              </button>

              <button
                onClick={accept}
                style={{ marginLeft: "10px" }}
              >
                ✅ Accept
              </button>

              <br /><br />

              <select
                onChange={(e) =>
                  setSelectedUser(e.target.value)
                }
              >

                <option>Select User</option>

                {users.map((u, i) => (
                  <option key={i} value={u.name}>
                    {u.name}
                  </option>
                ))}

              </select>

              <button
                onClick={transfer}
                style={{ marginLeft: "10px" }}
              >
                🔁 Transfer
              </button>

              <br /><br />

              {/* HISTORY */}

              <h4>History</h4>

              {history.length > 0 ? (
                <p>
                  {history.join(" → ")}
                </p>
              ) : (
                <p>No history yet</p>
              )}

              {/* FAIRNESS */}

              <h4>Fairness Dashboard 📊</h4>

              {fairness.length > 0 ? (

                <ul>
                  {fairness.map((u, i) => (
                    <li key={i}>
                      {u.name} — {u.receivedCount} times
                    </li>
                  ))}
                </ul>

              ) : (
                <p>No fairness data yet</p>
              )}
              

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default App;