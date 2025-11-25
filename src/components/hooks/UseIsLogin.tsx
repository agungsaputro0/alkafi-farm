import { useState, useEffect } from "react";

function useIsLogin(): boolean {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      try {
        const storedUser = localStorage.getItem("currentUser");
        if (!storedUser) {
          setIsLoggedIn(false);
          return;
        }

        const user = JSON.parse(storedUser);

        // pastikan data valid dan user aktif
        if (user && typeof user === "object" && user.active === true) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error parsing currentUser from localStorage:", error);
        setIsLoggedIn(false);
      }
    };

    checkLogin();

    // optional: listen perubahan login/logout di tab lain
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser") checkLogin();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return isLoggedIn;
}

export default useIsLogin;
