import { Models } from "appwrite";
import { createContext, useContext } from "react";

type IUserContext = [
  user: Models.User<Models.Preferences> | null,
  setUser: React.Dispatch<React.SetStateAction<Models.User<Models.Preferences> | null>>
]

export const UserContext = createContext<IUserContext | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if(!context) throw new Error('useUser must be used with UserContext provider')
  return context
}