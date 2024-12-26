import { useState, useEffect, createContext } from "react";
import getState from "./flux"

export const Context = createContext();

const StoreWrapper = ({children}) => {
  const [state, setState] = useState(getState({
    getStore: () => state.store,
    getActions: () => state.actions,
    setStore: (updatedStore) => setState({
      store: Object.assign(state.store, updatedStore),
      actions: { ...state.actions }
    })
  }));

  useEffect(() => {
    state.actions.getMessage();
  }, []);

  return (
    <Context.Provider value={state}>
      {children}
    </Context.Provider>
  );
};

export default StoreWrapper;