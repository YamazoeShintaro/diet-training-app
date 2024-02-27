"use client";

import React, { useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { IoTimer } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

type Props = {
    currentPage: String;
};

export default function BottomMenu(props: Props) {
    const router = useRouter();

    const handleHomePage = () => {
        router.push("/mainPages/homePage");
    };

    const handleTimerPage = () => {
        router.push("/mainPages/timerPage");
    };

    const handleChatPage = () => {
        router.push("/mainPages/chatPage");
    };

    const handleSettingPage = () => {
        router.push("/mainPages/settingPage");
    };

    return (
        <ul className="bg-custom-blue flex justify-around text-slate-50">
            <li
                className={props.currentPage === "home"
                ? "text-blue-500 pb-1.5 pt-1 px-5 hover:bg-slate-700 duration-150 text-4xl"
                : "text-slate-100 py-2.5 px-5 hover:bg-slate-700 duration-150 text-2xl"}
                onClick={() => handleHomePage()}
            >
                <IoMdHome />
            </li>
            <li
                className={props.currentPage === "timer"
                ? "text-blue-500 pb-1.5 pt-1 px-5 hover:bg-slate-700 duration-150 text-4xl"
                : "text-slate-100 py-2.5 px-5 hover:bg-slate-700 duration-150 text-2xl"}
                onClick={() => handleTimerPage()}
            >
                <IoTimer />
            </li>
            <li
                className={props.currentPage === "chat"
                ? "text-blue-500 pb-1.5 pt-1 px-5 hover:bg-slate-700 duration-150 text-4xl"
                : "text-slate-100 py-2.5 px-5 hover:bg-slate-700 duration-150 text-2xl"}
                onClick={() => handleChatPage()}
            >
                <IoChatboxEllipses />
            </li>
            <li
                className={props.currentPage === "setting"
                ? "text-blue-500 pb-1.5 pt-1 px-5 hover:bg-slate-700 duration-150 text-4xl"
                : "text-slate-100 py-2.5 px-5 hover:bg-slate-700 duration-150 text-2xl"}
                onClick={() => handleSettingPage()}
            >
                <IoMdSettings />
            </li>
        </ul>
    );
};