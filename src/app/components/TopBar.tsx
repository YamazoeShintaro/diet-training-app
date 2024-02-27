"use client";

import { DocumentData, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { RiLogoutBoxLine } from "react-icons/ri";

const TopBar = () => {
    const { userId } = useAppContext();

    const [ currentUserInfo, setCurrentUserInfo ] = useState<DocumentData | undefined>();

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

    const router = useRouter();

    const handleLogOut = () => {
        auth.signOut();
        router.push("/auth/login");
    };

    return (
        <div className="bg-custom-blue flex justify-between text-slate-50">
            <div className="font-medium py-3 px-3 text-slate-100">
                {currentUserInfo?.name} さん
            </div>
            <div
                className="flex items-center justify-evenly cursor-pointer py-2.5 pl-2.5 pr-1.5 text-slate-100 hover:bg-slate-700 duration-150"
                onClick={() => handleLogOut()}
            >
                <RiLogoutBoxLine />
                <span className="pl-0.5">ログアウト</span>
            </div>
        </div>
    );
};

export default TopBar;