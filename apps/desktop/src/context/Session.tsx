import { createContext, useContext, useState } from "react";
import { User } from "../domain/User/User";

export type SessionContextType = {
    currentUser?: User;
    setCurrentUser: (user?: User) => void;
};

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User>();

    return (
        <SessionContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </SessionContext.Provider>
    );
};