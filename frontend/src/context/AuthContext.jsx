import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authTokens, setAuthTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = async (username, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data.token);
        setUser(data.user);
        localStorage.setItem("authTokens", JSON.stringify(data.token));
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || "Something went wrong" };
      }
    } catch (error) {
      return { success: false, error: "Server is offline" };
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
  };

  const completeQuest = async (questId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/quests/${questId}/complete/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: authTokens ? `Token ${authTokens}` : "",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const syncGithub = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/github/sync/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: authTokens ? `Token ${authTokens}` : "",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Sync failed" };
    }
  };

  useEffect(() => {
    const savedTokens = localStorage.getItem("authTokens");
    const savedUser = localStorage.getItem("user");

    if (savedTokens && savedUser) {
      setAuthTokens(JSON.parse(savedTokens));
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    completeQuest: completeQuest,
    syncGithub: syncGithub,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
