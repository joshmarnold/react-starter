import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAppDispatch } from "../store/store";
import {
  setProfile,
  setSession,
  clearProfile,
  clearSession,
} from "../store/userSlice";
import { useNotification } from "../components/NotificationContext";

export const useAuth = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();

  const fetchAndSetUserProfile = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error(error);
        showNotification({
          message: "Error fetching user profile",
          severity: "error",
        });
        return;
      }

      dispatch(setProfile(data));
      setIsReady(true);
    },
    [dispatch, showNotification]
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      showNotification({
        message: "Error signing out",
        severity: "error",
      });
      return;
    }
    dispatch(clearProfile());
    dispatch(clearSession());
    navigate("/", { replace: true });
  }, [dispatch, navigate, showNotification]);

  const login = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
    if (error) {
      console.error("Error signing in:", error);
      showNotification({
        message: "Error signing in",
        severity: "error",
      });
    }
  }, [showNotification]);

  useEffect(() => {
    if (!dispatch) return;

    const refreshSession = async () => {
      const { data, error }: any = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
      } else if (data) {
        dispatch(setSession(data));
        fetchAndSetUserProfile(data.user.id);
      }
    };

    const refreshInterval = setInterval(() => {
      refreshSession();
    }, 2 * 60 * 60 * 1000); // 2 hours

    return () => clearInterval(refreshInterval);
  }, [dispatch, fetchAndSetUserProfile]);

  useEffect(() => {
    const checkInitialSession = async () => {
      const {
        data: { session },
        error,
      }: any = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
      }

      if (session) {
        dispatch(setSession(session));
        fetchAndSetUserProfile(session.user.id);
      }
    };

    const handleAuthStateChange = (_event: string, session: any) => {
      if (session) {
        dispatch(setSession(session));
        fetchAndSetUserProfile(session.user.id);
      } else {
        dispatch(clearSession());
        dispatch(clearProfile());
      }
    };

    checkInitialSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, fetchAndSetUserProfile]);

  return { login, logout, isReady };
};
