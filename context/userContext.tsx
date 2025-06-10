import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type UserContextType = {
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [userName, setUserName] = useState('');
  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;