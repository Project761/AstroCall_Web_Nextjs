"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Get_SingleData_User } from "../utils/api";

export const useUserData = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const loginData = localStorage.getItem("LoginTokenData");
        if (loginData) {
          const parsedData = JSON.parse(loginData);
          const userId = parsedData?.ID || parsedData?.UserID;
          
          if (userId) {
            // Fetch complete user data using the API
            const completeUserData = await Get_SingleData_User(userId);
            if (completeUserData) {
              setUserData(completeUserData);
            } else {
              // Fallback to basic login data if API fails
              setUserData(parsedData);
            }
          } else {
            setError("No user ID found in login data");
            router.push("/");
          }
        } else {
          setError("No login data found");
          router.push("/");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const refreshUserData = async () => {
    if (!userData?.ID && !userData?.UserID) return;
    
    setLoading(true);
    try {
      const userId = userData?.ID || userData?.UserID;
      const refreshedData = await Get_SingleData_User(userId);
      if (refreshedData) {
        setUserData(refreshedData);
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    } finally {
      setLoading(false);
    }
  };

  return { userData, loading, error, refreshUserData };
};
