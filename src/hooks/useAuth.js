import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { View, Text } from "react-native";
import * as Google from "expo-google-app-auth";
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut,
} from "@firebase/auth";
import { auth } from "../utils/firebase";

const AuthContext = createContext({});

const config = {
    iosClientId:
        "878544394448-m098achbicvhd82u41ke0ab9ag75cd1a.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(
        () =>
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser(user);
                } else {
                    setUser(null);
                }

                setLoadingInitial(false);
            }),
        []
    );

    const logOut = () => {
        setLoading(true);

        signOut(auth)
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        await Google.logInAsync(config)
            .then(async (loginResult) => {
                if (loginResult.type === "success") {
                    const { idToken, accessToken } = loginResult;
                    const credential = GoogleAuthProvider.credential(
                        idToken,
                        accessToken
                    );

                    await signInWithCredential(auth, credential);
                }

                return Promise.reject();
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    };

    const memoedValue = useMemo(
        () => ({
            user,
            loading,
            error,
            signInWithGoogle,
            logOut,
        }),
        [user, loading, error]
    );
    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
};

export default useAuth = () => {
    return useContext(AuthContext);
};
