import { useContext, useEffect } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router";

export function useAuth() {
  const token = localStorage.getItem("token");
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const fetchList = async () => {
    const resp = await actions.allList();
    if (resp === false) {
      navigate("/login");
    }
  };
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    fetchList();
  }, [token]);
}
