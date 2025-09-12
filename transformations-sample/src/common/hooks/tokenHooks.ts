import React from "react";

export const TokenContext = React.createContext<string | undefined>(undefined);

export const useToken = () => {
    const context = React.useContext(TokenContext);
    if (!context) {
        throw new Error("useToken must be used within a TokenProvider");
    }
    return context;
};
