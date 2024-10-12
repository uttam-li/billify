import { useEffect } from "react";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { User } from "@/types/schema";
import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const RequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await refresh();
        console.log("Refresh Response:", response)
        navigate("/buss");
      } catch (err) {
        console.error("Failed to refresh token:", err);
        navigate("/login");
      }
    };

    if (!isAuthenticated()) {
      refreshAccessToken();
    }
  }, [isAuthenticated, navigate, refresh]);

  // Get cached data if available
  const cachedUser = queryClient.getQueryData<User>(["user"]);

  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosPrivate.get("/user");
      return data.data;
    },
    staleTime: Infinity,
    initialData: cachedUser,
    enabled: isAuthenticated(),
  });

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default RequireAuth;
