"use client";

import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { db } from "../../../../firebase";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import bodyImage from "../../../images/体の部位.webp";

type Inputs = {
    currentWeight: number;
    goalWeight: number;
    height: number;
    bodyPart: string;
    name: string;
};

const InitialSetting = () => {
    const { userId } = useAppContext();

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const [ bodyPart, setBodyPart ] = useState("お腹");
    const [ gender, setGender ] = useState("男性");

    // if(!userId) {
    //     router.push("/auth/login");
    // }

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setDoc(doc(db, "users", userId!), {
            currentWeight: data.currentWeight,
            goalWeight: data.goalWeight,
            bodyPart: bodyPart,
            name: data.name,
            commitTime: "30",
            restTime: "10",
            repeatCount: "3",
            userId: userId,
            gender: gender,
            height: data.height,
        });
        router.push("/mainPages/homePage");
    };

    return (
        <div className="h-full py-1 px-2 flex flex-col">
            <div className="bg-custom-blue text-slate-50 flex justify-between px-4 py-3 fixed top-0 left-0 right-0 z-30">
                <h1 className="flex items-center w-36 text-2xl pl-2 font-medium">初期設定</h1>
                <p className="px-2 pt-0.5 text-small-2">
                    ※設定ページからいつでも変更可能です
                </p>
            </div>

            <div className="mt-10 flex-grow overflow-y-auto h-screen flex flex-col items-center justify-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="text-slate-50 w-5/6"
                >
                    <div className="mb-3">
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
                                type="text"
                                className="text-right text-black text-xs ml-1 border-2 rounded-md w-full p-1"
                            />
                        </div>
                        <div className="text-red-700 text-small-3">
                            {errors.name?.message}
                        </div>
                    </div>
                    <div className="mb-3 flex justify-between">
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

                    <div className="px-4 mb-2.5">
                        <Image src={bodyImage} alt="体の部位の参考イメージ" />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="text-sm bg-blue-500 text-white font-medium py-2 px-6 rounded hover:bg-blue-700"
                        >
                            はじめる
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InitialSetting;