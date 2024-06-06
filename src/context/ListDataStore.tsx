import { Admin } from "@/pages/admins/Admins";
import { ReactNode, createContext, useReducer } from "react";

const ListDataContext = createContext({
  admins: [], //admins list in the system
  setAdmins: (payloada: Payload) => {}, //function to get the list of registered admins
});

// the initial/default value of the reducer hook

type InitialState = {
  admins: Admin[];
};

export type Payload = Admin[];

type Action = {
  type: string;
  payload?: Payload;
};

const defaultValues: InitialState = {
  admins: [],
};

// reducer fuction that handles state changes depending on the dispatched action
const Reducer = (state: InitialState, action: Action): any => {
  // check if the type of action is the same as the dispatched action

  switch (action.type) {
    case "ADMINS": {
      const newAdmins = action.payload;
      return {
        ...state,
        admins: newAdmins,
      };
    }
    default:
      return state;
  }
};

type ContextProps = {
  children: ReactNode;
};
// create the context provider
export const ListDataContextProvider = ({ children }: ContextProps) => {
  const [state, dispatchAction] = useReducer(Reducer, defaultValues);

  return (
    <ListDataContext.Provider
      value={{
        admins: state.admins,
        setAdmins: (payload: Payload) =>
          dispatchAction({ type: "ADMINS", payload: payload }),
      }}
    >
      {children}
    </ListDataContext.Provider>
  );
};

export default ListDataContext;
