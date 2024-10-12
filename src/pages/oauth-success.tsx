import { useEffect, useState } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        await refresh();
        navigate("/buss"); 
      } catch (err) {
        console.error(err);
        setError("Failed to refresh token");
      } finally {
        setLoading(false);
      }
    };

    fetchAccessToken();
  }, [refresh, navigate]);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{error}</h1>
      </div>
    );
  }

  return null; // This should never be reached because of the redirects
};

export default OAuthSuccess;