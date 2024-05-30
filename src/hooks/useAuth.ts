import { useEffect, useState } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "supabase";
import { useAppStore, useAppDispatch } from "@store/store";
import {
  setProfile,
  setSession,
  clearProfile,
  clearSession,
} from "../store/userSlice";
import { useNotification } from "@components/NotificationContext";

const fetchAndSetUserProfile = async (
  userId: string,
  dispatch: any,
  setIsReady: (ready: boolean) => void,
  showNotification: any
) => {
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
};

const refreshSession = async (dispatch: any) => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error("Error refreshing session:", error);
  } else if (data) {
    dispatch(setSession(data));
    fetchAndSetUserProfile(data.user.id, dispatch);
  }
};

export const useAuth = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch(clearProfile());
    dispatch(clearSession());
    navigate("/", { replace: true });
  };

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      redirectUrl: window.location.href,
    });
  };

  // refresh session every 2 hours
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshSession(dispatch);
    }, 2 * 60 * 60 * 1000); // 2 hours

    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  // Check session on initial load and set up session change listener
  useEffect(() => {
    const checkInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        dispatch(setSession(session));
        fetchAndSetUserProfile(
          session.user.id,
          dispatch,
          setIsReady,
          showNotification
        );
      }
    };

    const handleAuthStateChange = (event: string, session: any) => {
      if (session) {
        dispatch(setSession(session));
        fetchAndSetUserProfile(
          session.user.id,
          dispatch,
          setIsReady,
          showNotification
        );
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
  }, [dispatch]);

  return { login, logout, isReady };
};
