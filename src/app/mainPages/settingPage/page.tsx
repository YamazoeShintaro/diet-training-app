"use client";

import BottomMenu from "@/app/components/BottomMenu";
import TopBar from "@/app/components/TopBar";
import { useAppContext } from "@/context/AppContext";
import { DocumentData, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import bodyImage from "../../../images/bodyPart.webp";

type Inputs = {
    currentWeight: number;
    goalWeight: number;
    height: number;
    bodyPart: string;
    gender: string
    name: string;
};

const Setting = () => {
    const { userId, currentUserInfo } = useAppContext();
    const [ bodyPart, setBodyPart ] = useState(currentUserInfo?.bodyPart);
    const [ gender, setGender ] = useState(currentUserInfo?.gender);

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const input = {
            userId: userId,
            name: data.name,
            currentWeight: data.currentWeight,
            goalWeight: data.goalWeight,
            bodyPart: bodyPart,
            gender: gender,
            height: data.height,
        };

        setDoc(doc(db, "users", userId!), input);

        alert('プロフィールを変更しました。');
    };

    return (
        <div className="h-full py-1 px-2 flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-30">
                <TopBar />
            </div>

            <div className="my-6 flex-grow overflow-y-auto h-screen flex flex-col items-center justify-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="text-slate-50 w-5/6"
                >
                    <div className="mb-2.5">
                        <div className="flex justify-between">
                            <label className="block flex items-center w-36 text-xs">
                                ニックネーム：
                            </label>
                            <input
                                {...register("name", {
                                    required: "※ニックネームは必須です。",
                                    maxLength: {
                                        value: 10,
                                        message: "※10文字以内で入力してください。"
                                    },
                                })}
                                defaultValue={currentUserInfo?.name}
                                type="text"
                                className="text-right text-black text-xs ml-1 border-2 rounded-md w-full p-1"
                            />
                        </div>
                        <div className="text-red-700 text-small-3">
                            {errors.name?.message}
                        </div>
                    </div>
                    <div className="mb-2.5 flex justify-between">
                        <label className="block flex items-center text-xs">
                            性別：
                        </label>
                        <select
                            name="gender"
                            value={gender}
                            className="text-black text-xs rounded px-0.5 py-1 border-2"
                            onChange={(e) => {
                                setGender(e.target.value);
                            }}
                        >
                            <option value="男性">男性</option>
                            <option value="女性">女性</option>
                        </select>
                    </div>
                    <div className="mb-2.5">
                        <div className="flex justify-between">
                            <label className="block flex items-center text-xs">
                                現在の体重：
                            </label>
                            <div className="flex">
                                <input
                                    {...register("currentWeight", {
                                        required: "※現在の体重は必須です。",
                                        min: {
                                            value: 30,
                                            message: "※30以上250以下の値を入力してください。"
                                        },
                                        max: {
                                            value: 250,
                                            message: "※30以上250以下の値を入力してください。"
                                        },
                                    })}
                                    defaultValue={currentUserInfo?.currentWeight}
                                    type="text"
                                    className="mr-1 text-right text-black w-12 text-xs border-2 rounded-md p-1"
                                />
                                <div>kg</div>
                            </div>
                        </div>
                        <div className="text-red-700 text-small-3">
                            {errors.currentWeight?.message}
                        </div>
                    </div>
                    <div className="mb-2.5">
                        <div className="flex justify-between">
                            <label className="block flex items-center text-xs">
                                目標体重：
                            </label>
                            <div className="flex">
                                <input
                                    {...register("goalWeight", {
                                        required: "※目標体重は必須です。",
                                        min: {
                                            value: 30,
                                            message: "※30以上250以下の値を入力してください。"
                                        },
                                        max: {
                                            value: 250,
                                            message: "※30以上250以下の値を入力してください。"
                                        },
                                    })}
                                    defaultValue={currentUserInfo?.goalWeight}
                                    type="text"
                                    className="mr-1 text-right text-black w-12 text-xs border-2 rounded-md p-1"
                                />
                                <div>kg</div>
                            </div>
                        </div>
                        <div className="text-red-700 text-small-3">
                            {errors.goalWeight?.message}
                        </div>
                    </div>
                    <div className="mb-2.5">
                        <div className="flex justify-between">
                            <label className="block flex items-center text-xs">
                                身長：
                            </label>
                            <div className="flex">
                                <input
                                    {...register("height", {
                                        required: "※身長は必須です。",
                                        min: {
                                            value: 100,
                                            message: "※100以上230以下の値を入力してください。"
                                        },
                                        max: {
                                            value: 230,
                                            message: "※100以上230以下の値を入力してください。"
                                        },
                                    })}
                                    defaultValue={currentUserInfo?.height}
                                    type="text"
                                    className="mr-1 text-right text-black w-12 text-xs border-2 rounded-md p-1"
                                />
                                <div>cm</div>
                            </div>
                        </div>
                        <div className="text-red-700 text-small-3">
                            {errors.height?.message}
                        </div>
                    </div>
                    <div className="mb-2.5 flex justify-between">
                        <label className="block flex items-center text-xs">
                            脂肪を落としたい部分：
                        </label>
                        <select
                            name="bodyPart"
                            value={bodyPart}
                            className="text-black text-xs rounded px-0.5 py-1 border-2"
                            onChange={(e) => {
                                setBodyPart(e.target.value);
                            }}
                        >
                            <option value="お腹">お腹</option>
                            <option value="背中">背中</option>
                            <option value="腕">腕</option>
                            <option value="脚">脚</option>
                        </select>
                    </div>

                    <div className="px-6 mb-2">
                        <Image src={bodyImage} alt="体の部位の参考イメージ" />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="text-xs bg-blue-500 text-white font-medium py-2 px-6 rounded hover:bg-blue-700"
                        >
                            更新
                        </button>
                    </div>
                </form>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30">
                <BottomMenu currentPage="setting" />
            </div>
        </div>
    );
};

export default Setting;