import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";





interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: (newPrams:{}) => void;
}

interface User {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  accessedAt: string;
  avatar: string;
  email: string;
  emailVerification: boolean;
  labels: string[];
  mfa: boolean;
  name: string;
  passwordUpdate: string;
  phone: string;
  phoneVerification: boolean;
  prefs: Record<string, unknown>;
  registration: string;
  status: boolean;
  targets: ExpectedTarget[];
}

interface ExpectedTarget {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  expired: boolean;
  identifier: string;
  name: string;
  providerId?: string | null;  // Make this optional
  providerType: string;
  userId: string;
}




const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {


  const {
    data:user,
    loading,
    refetch,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  return (
    <GlobalContext.Provider
      value={{
        isLogged:!!user,
        user:user||null,
        loading,
        refetch
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};

export default GlobalProvider;