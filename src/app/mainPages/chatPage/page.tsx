"use client";

import { Timestamp, addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../../firebase";
import { useAppContext } from "@/context/AppContext";
import { FaPaperPlane } from "react-icons/fa";
import OpenAI from "openai";
import BottomMenu from "@/app/components/BottomMenu";
import LoadingIcons from 'react-loading-icons'
import TopBar from "@/app/components/TopBar";
import { useRouter } from "next/navigation";

type Message = {
    text: String;
    sender: String;
    createdAt: Timestamp;
};

type Props = {
    openaiApiKey: string | undefined;
}

const Chat = ({openaiApiKey}: Props) => {
    const router = useRouter();

    const openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true,
    });

    const { userId, currentUserInfo } = useAppContext();

    const [ messages, setMessages ] = useState<Message[]>([]);
    const [ isLoading, setIsLoading ] = useState<Boolean>();
    const [ placeForm, setPlaceForm ] = useState("ジム");
    const [ timeForm, setTimeForm ] = useState("30");

    const scrollBottomRef = useRef<HTMLDivElement>(null);

    // if(!userId) {
    //     router.push("/auth/login");
    // }

    //ログイン中のユーザーのメッセージを取得
    useEffect(() => {
        if(userId) {
            const fetchMessages = async () => {

                const userDocRef = doc(db, "users", userId);
                const messagesCollectionRef = collection(userDocRef, "messages");

                const q = query(
                    messagesCollectionRef,
                    orderBy("createdAt"),
                );

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
                    setMessages(newMessages);
                });

                return () => {
                    unsubscribe();
                };
            };

            fetchMessages();
        }
    }, [userId]);

    useEffect(() => {
        scrollBottomRef?.current?.scrollIntoView();
    }, [messages]);

    const sendMessage = async () => {
        // チャットに表示する文章
        const createDisplayMessage = `今日は${placeForm}で${timeForm}分トレーニングします！`

        const messageData = {
            text: createDisplayMessage,
            sender: "user",
            createdAt: serverTimestamp(),
        };

        if (placeForm === "ジム") {
            const createSendMessage =
                `
                    優秀なトレーナーになりきって答えてください。
                    難しい専門用語は使わずに答えてください。
                    私は身長${currentUserInfo?.height}cm、体重${currentUserInfo?.currentWeight}kgの${currentUserInfo?.gender}です。
                    体重${currentUserInfo?.goalWeight}kgを目標にダイエットをしています。
                    特に、${currentUserInfo?.bodyPart}の脂肪を落としたいです。
                    合計${timeForm}分以内でできる、トレーニングマシンを使ったトレーニングメニューをナンバリング付きの箇条書きで、1行ずつ空けて教えてください。
                    使えるトレーニングマシンは、ショルダープレス、チェストプレス、アブドミナル、ラットプルダウン、アームカール、ディップス、レッグプレス、アダクション、アブダクション、トレッドミル、エアロバイクの11種類です。
                    トレーニングメニューの横に（）で時間配分をつけてください。
                    また、それぞれのトレーニングメニューの下に、意識するポイントを簡単に書いてください。
                `;

            console.log(createSendMessage);

            //ユーザーメッセージをdbに保存
            const userDocRef = doc(db, "users", userId!);
            const messageCollectionRef = collection(userDocRef, "messages");
            await addDoc(messageCollectionRef, messageData);

            setIsLoading(true);

            //OpenAIからの返信
            const gptResponse = await openai.chat.completions.create({
                messages: [ { role: "user", content: createSendMessage } ],
                model: "gpt-3.5-turbo",
            });

            setIsLoading(false);

            const botResponse = gptResponse.choices[0].message.content;

            // OpenAIメッセージをdbに保存
            await addDoc(messageCollectionRef, {
                text: botResponse,
                sender: "bot",
                createdAt: serverTimestamp(),
            });
        }

        if (placeForm === "家") {
            const createSendMessage =
                `
                    優秀なトレーナーになりきって答えてください。
                    難しい専門用語は使わずに答えてください。
                    私は身長${currentUserInfo?.height}cm、体重${currentUserInfo?.currentWeight}kgの${currentUserInfo?.gender}です。
                    体重${currentUserInfo?.goalWeight}kgを目標にダイエットをしています。
                    特に、${currentUserInfo?.bodyPart}の脂肪を落としたいです。
                    家で合計${timeForm}分以内できる、器具を使わないトレーニングメニューを、ナンバリング付きの箇条書きで、1行ずつ空けて教えてください。
                    トレーニングメニューの横に（）で時間配分をつけてください。
                    また、それぞれのトレーニングメニューの下に、意識するポイントを簡単に書いてください。
                `;

            console.log(createSendMessage);

            //ユーザーメッセージをdbに保存
            const userDocRef = doc(db, "users", userId!);
            const messageCollectionRef = collection(userDocRef, "messages");
            await addDoc(messageCollectionRef, messageData);

            setIsLoading(true);

            //OpenAIからの返信
            const gptResponse = await openai.chat.completions.create({
                messages: [ { role: "user", content: createSendMessage } ],
                model: "gpt-3.5-turbo",
            });

            setIsLoading(false);

            const botResponse = gptResponse.choices[0].message.content;

            // OpenAIメッセージをdbに保存
            await addDoc(messageCollectionRef, {
                text: botResponse,
                sender: "bot",
                createdAt: serverTimestamp(),
            });
        }
    };

    return (
        <div className="bg-gray-500 h-full py-4 px-2 flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-30">
                <TopBar />
            </div>

            <div
                className="flex-grow overflow-y-auto mt-10 mb-20"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={message.sender === "user" ? "text-right" : "text-left"}
                    >
                        <div
                            className={message.sender === "user"
                            ? "bg-blue-500 inline-block rounded px-2 py-2 mb-2"
                            : "bg-green-500 inline-block rounded px-2 py-2 mb-2 w-5/6"}
                        >
                            <p className="text-xs text-white whitespace-pre-wrap">{message.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={scrollBottomRef}></div>
                {isLoading &&
                    <div className="text-xs">
                        <LoadingIcons.TailSpin />
                    </div>
                }
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30">
                <div className="p-2 bg-gray-500">
                    <div className="bg-white text-sm flex-shrink-0 relative border rounded w-full focus:outline-none py-1">
                        <div
                            className="text-black text-right mr-12"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  sendMessage();
                                }
                              }}
                        >
                            <select
                                name="place"
                                value={placeForm}
                                className="rounded p-0.5 mx-1 border border-black"
                                onChange={(e) => setPlaceForm(e.target.value)}
                            >
                                <option value="ジム">ジム</option>
                                <option value="家">家</option>
                            </select>
                            <label>で</label>
                            <select
                                name="time"
                                value={timeForm}
                                className="rounded p-0.5 mx-1 border border-black"
                                onChange={(e) => setTimeForm(e.target.value)}
                            >
                                <option value="30">30</option>
                                <option value="60">60</option>
                                <option value="90">90</option>
                                <option value="120">120</option>
                            </select>
                            <label>分 トレーニング</label>
                        </div>

                        <button
                            className="absolute inset-y-0 right-2 flex items-center px-2 hover:text-blue-500 duration-150"
                            onClick={() => sendMessage()}
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>

                <div>
                    <BottomMenu currentPage="chat" />
                </div>
            </div>
        </div>
    );
};

export default Chat;