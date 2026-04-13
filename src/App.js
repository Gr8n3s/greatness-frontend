import { useState } from "react";

function App() {

  // ========================
  // STATE
  // ========================

  const API = process.env.REACT_APP_API_URL;

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
  // LOGIN
  // ========================

  const login = async () => {

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
      }),
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      alert("Login successful");
    } else {
      alert(data.message);
    }

  };

  // ========================
  // CREATE GIVEAWAY
  // ========================

  const createGiveaway = async () => {

    await fetch(`${API}/create-giveaway`, {
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

  // ========================
  // LOAD DATA
  // ========================

  const getGiveaway = async () => {

    const res = await fetch(`${API}/giveaway`);
    const data = await res.json();

    setGiveaway(data);

  };

  const getUsers = async () => {

    const res = await fetch(`${API}/users`);
    const data = await res.json();

    setUsers(data.users);

  };

  const getHistory = async () => {

    const res = await fetch(`${API}/history`);
    const data = await res.json();

    setHistory(data.history);

  };

  const getFairness = async () => {

    const res = await fetch(`${API}/fairness`);
    const data = await res.json();

    setFairness(data.users);

  };

  // ========================
  // ACTIONS
  // ========================

  const sendToGreatness = async () => {

    await fetch(`${API}/greatness`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    getGiveaway();
    getHistory();

  };

  const accept = async () => {

    await fetch(`${API}/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        user: name,
      }),
    });

    getGiveaway();

  };

  const transfer = async () => {

    await fetch(`${API}/transfer`, {
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

      {!token ? (

        <div
          style={{
            maxWidth: "400px",
            margin: "auto",
            background: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >

          <h3>Login</h3>

          <input
            placeholder="Name"
            onChange={(e) =>
              setName(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
            }}
          />

          <br /><br />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
            }}
          />

          <br /><br />

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "10px",
            }}
          >
            Login
          </button>

        </div>

      ) : (

        <div style={{ maxWidth: "600px", margin: "auto" }}>

          <button onClick={getUsers}>
            Load Users
          </button>

          <button
            onClick={getGiveaway}
            style={{ marginLeft: "10px" }}
          >
            Load Giveaway
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
            Load Fairness
          </button>

        </div>

      )}

    </div>
  );
}

export default App;