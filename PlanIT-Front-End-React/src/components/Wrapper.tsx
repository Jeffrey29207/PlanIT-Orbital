// Wrap the home components to ensure that it is accessible only after login

import { useState, useEffect, type PropsWithChildren } from "react";
import supabase from "../helper/Config.ts";
import { Navigate } from "react-router-dom";

function Wrapper({ children }: PropsWithChildren) {
  const [authenticated, setAuthenticated] = useState(false);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setAuthenticated(!!session);
      setProcessing(false);
    };
    checkLogin();
  }, []);

  if (processing) {
    return;
  }

  if (authenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" />;
  }
}

export default Wrapper;
