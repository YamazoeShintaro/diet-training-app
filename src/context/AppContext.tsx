"use client";

import { User, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

type AppProviderProps = {
    children: ReactNode;
};

type AppContextType = {
    userId: string | null;
    currentUserInfo: DocumentData | undefined;
};

type CurrentUserInfo = {
    userId: number;
    name: string;
    currentWeight: number;
    goalWeight: number;
    commitTime: number;
    restTime: number;
    repeatCount: number;
    bodyPart: string;
};

const defaultContextData = {
    userId: null,
    currentUserInfo: undefined,
};

const AppContext = createContext<AppContextType>(defaultContextData);

export function AppProvider({ children }: AppProviderProps) {
    const router = useRouter();

    const [ userId, setUserId ] = useState<string | null>(null);
    const [ currentUserInfo, setCurrentUserInfo ] = useState<DocumentData | undefined>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (newUser) => {
            setUserId(newUser ? newUser.uid : null);

            if (!newUser) {
                router.push("/auth/login");
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    //ログイン中のユーザーのデータを取得
    useEffect(() => {
        if(userId) {
            const fetchUsers = async () => {
                const userDocRef = doc(db, "users", userId);
                const userSnap = await getDoc(userDocRef);

                setCurrentUserInfo(userSnap.data());
            };

            fetchUsers();
        }
    }, [userId]);

    return (
        <AppContext.Provider
            value={{ userId, currentUserInfo }}
        >
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext() {
    return useContext(AppContext);
};