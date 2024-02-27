"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import BottomMenu from "@/app/components/BottomMenu";
import { useAppContext } from "@/context/AppContext";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import TopBar from "@/app/components/TopBar";
import Image from "next/image";
import bodyImage from "../../../images/bodyPart.webp";
import graph from "../../../images/graph.webp";
import { useRouter } from "next/navigation";

const Home = () => {
    const router = useRouter();

    const { userId } = useAppContext();
    const [ currentUserInfo, setCurrentUserInfo ] = useState<DocumentData>();

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
        <div className="bg-gray-500 h-full py-4 flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-30">
                <TopBar />
            </div>

            <div className="flex-grow overflow-y-auto mt-11 mb-12 px-4">
                <div className="mb-4">
                    <Image src={graph} alt="体重の推移" />
                </div>

                <div className="text-slate-50 text-sm px-5">
                    <p className="mb-1.5">・目標体重：{currentUserInfo?.goalWeight} kg</p>
                    <p className="mb-1.5">・現在の体重：{currentUserInfo?.currentWeight} kg</p>
                    <p className="mb-1.5">・身長：{currentUserInfo?.height} cm</p>
                    <p className="mb-3">・脂肪を落としたい部位：{currentUserInfo?.bodyPart}</p>
                </div>

                <div className="px-10">
                    <Image src={bodyImage} alt="体の部位の画像" />
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30">
                <BottomMenu currentPage="home" />
            </div>
        </div>
    );
};

export default Home;