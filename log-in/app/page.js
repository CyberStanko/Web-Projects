// app/page.js
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "InfantStanko" && password === "Stanko2207") {
      alert("Login successful!");
    } else {
      alert("Invalid username or password.");
    }

  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>LogIn</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Username:
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Password:
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.button}>
            Login
          </button>
          <p style={styles.para}>Forgotten Password?</p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  para:{
    marginTop:"10px",
    color:"black",
    textDecoration: "underline",
    cursor:"pointer",
    fontSize:"12px",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#c4c4c4",
  },
  card: {
    backgroundColor: "#4db8ff",
    borderRadius: "15px",
    padding: "30px",
    height:"400px",
    width: "350px",
    boxShadow: "-50px 50px 25px rgba(0, 0, 0, 0.2)",
    textAlign: "left",
  },
  title: {
    margin: "0 110px 5px",
    fontSize:"30px",
    color: "#000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    margin: "10px 0 5px",
    fontSize: "14px",
    color: "#000",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    marginBottom: "20px",
    boxShadow: "inset 0px 1px 5px rgba(0, 0, 0, 0.1)",
  },
  button: {
    backgroundColor: "#0056b3",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};
