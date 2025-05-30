"use client";

import React, { useState } from "react";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, password } = formData;

    try {
      const response = await fetch(`http://localhost/api/v1/login`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const jsonData = await response.json();
      setResult("Login: " + JSON.stringify(jsonData));
      setErrorMessage("");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage("Error: " + message);
    }
  };

  const handleLogout = async () => {
    try {
      // Send a logout request to the backend
      const response = await fetch("http://127.0.0.1:80/logout");

      if (response.ok) {
        const jsonData = await response.json();
        setResult("Logout: " + JSON.stringify(jsonData));
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage("Error: " + message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <button type="submit" style={styles.button}>
          Login
        </button>
        <button type="button" style={styles.button} onClick={handleLogout}>
          Logout
        </button>
        <p>Response: {result}</p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center" as const,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
  },
  inputGroup: {
    marginBottom: "15px",
    textAlign: "left" as const,
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default LoginPage;
