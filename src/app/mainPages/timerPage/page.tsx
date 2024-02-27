"use client";

import BottomMenu from "@/app/components/BottomMenu";
import TopBar from "@/app/components/TopBar";
import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase";
// import TimerSection from "../../components/TimerSection";
import { SubmitHandler, useForm } from "react-hook-form";
import Trivia from "@/app/components/Trivia";

type Inputs = {
    commitTimeString: string;
    restTimeString: string;
    repeatCountString: string;
};

const Timer = () => {
    const [ commitTimeString, setCommitTimeString ] = useState<string>("30");
    const [ restTimeString, setRestTimeString ] = useState<string>("10");
    const [ repeatCountString, setRepeatCountString ] = useState<string>("3");

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const commitTime: number = Number(commitTimeString);
    const restTime: number = Number(restTimeString);
    const repeatCount: number = Number(repeatCountString);

    // タイマーを稼働する総時間を計算（単位は"秒"）
    const initialCount = (commitTime * repeatCount) + (restTime * (repeatCount - 1));

    const [count, setCount] = useState<number>(initialCount);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [display, setDisplay] = useState<string>("開始前");
    const [triviaNum, setTriviaNum] = useState<number | undefined>();

    // // "勉強に入る時"と"休憩に入る時"で２種類の音を用意
    // const startTimer = new Audio(startSound);
    // const finishTimer = new Audio(finishSound);

    const start = () => setIsRunning(true);
    const pause = () => setIsRunning(false);
    const reset = () => {
        setCount(initialCount);
        setIsRunning(false);
    };
    const tick = () => {
        if (count > 0) setCount((prevCount) => prevCount - 1);
    };

    useEffect(() => {
        let timerId: any;

        if (isRunning && count > 0) {
            timerId = setInterval(() => {
                tick()
            }, 1000);
        }

        // 総時間の残りの秒数によってdisplayを変更
        for (let k = 0; k <= repeatCount; k++) {
            if (count === initialCount) {
                setDisplay("開始前");
            }
            if (count === (initialCount - (commitTime * k) - (restTime * k)) && count !== initialCount) {
                // startTimer.play();
            }
            if (count <= (initialCount - (commitTime * k) - (restTime * k)) && count > (initialCount - (commitTime * (k + 1)) - (restTime * k))) {
                setDisplay(`${k + 1}セット目`);
            }
            if (count === (initialCount - (commitTime * (k + 1)) - (restTime * k))) {
                // finishTimer.play();

                // 休憩ごとにランダムで雑学を表示する
                setTriviaNum(Math.floor(Math.random() * 10));
            }
            if (count <= (initialCount - (commitTime * (k + 1)) - (restTime * k)) && count > (initialCount - (commitTime * (k + 1)) - (restTime * (k + 1)))) {
                setDisplay(`${k + 1}セット後の休憩`);
            }
            if (count === 0) {
                setDisplay("終了後");
            }
        }

        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [ isRunning, count ]);

    return (
        <div className="bg-gray-500 h-full py-4 flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-30">
                <TopBar />
            </div>

            <div className="text-sm flex-grow overflow-y-auto mt-10 mb-20">
                <div className="text-slate-200">
                    <ul className="flex justify-center mb-1 pt-2">
                        <li>コミットタイム：{commitTimeString}秒&nbsp;</li>
                        <li>／ 休憩：{restTimeString}秒</li>
                    </ul>
                    <div className="flex justify-center">
                        <p
                            className="flex justify-center mb-5 pb-3 border-b border-slate-200 w-5/6 max-w-md"
                        >
                            【 {repeatCountString}セット 】
                        </p>
                    </div>
                </div>

                {/*------------------- TimerSection ----------------------------------------------------------------------------*/}
                <div>
                    <div className="text-slate-200 flex flex-col items-center justify-center">
                        {/* displayによって表示内容を変更 */}
                        {display === "開始前" && (
                            <p className="flex justify-center text-xl mt-2 mb-8">頑張りましょう！</p>
                        )}
                        {display === "1セット目" && (
                            <div>
                                <p className="flex justify-center text-xl mb-5">〜1セット目〜</p>
                                <div className="flex">
                                    <p className="flex items-center pr-3 pl-6 text-sm">残り</p>
                                    <p className="text-white text-8xl mb-5">
                                        {count - (commitTime * (repeatCount - 1)) - (restTime * (repeatCount - 1))}
                                    </p>
                                    <p className="flex items-center pl-4 pr-10 text-sm">秒</p>
                                </div>
                            </div>
                        )}
                        {display === "1セット後の休憩" && (
                            <div>
                                <Trivia triviaNum={triviaNum}/>
                                <p className="text-sm pl-16 py-1">2セット目まで</p>
                                <div className="flex justify-center">
                                    <p className="flex items-center pr-3 pl-6 text-sm">残り</p>
                                    <p className="text-white text-8xl mb-4">
                                        {count - (commitTime * (repeatCount - 1)) - (restTime * (repeatCount - 2))}
                                    </p>
                                    <p className="flex items-center pl-4 pr-5 text-sm">秒</p>
                                </div>
                            </div>
                        )}
                        {display === "2セット目" && (
                            <div>
                                <p className="flex justify-center text-xl mb-5">〜2セット目〜</p>
                                <div className="flex">
                                    <p className="flex items-center pr-3 pl-6 text-sm">残り</p>
                                    <p className="text-white text-8xl mb-4">
                                        {count - (commitTime * (repeatCount - 2)) - (restTime * (repeatCount - 2))}
                                    </p>
                                    <p className="flex items-center pl-4 pr-10 text-sm">秒</p>
                                </div>
                            </div>
                        )}
                        {display === "2セット後の休憩" && (
                            <div>
                                <Trivia triviaNum={triviaNum}/>
                                <p className="text-lg pl-16 py-1">3セット目まで</p>
                                <div className="flex justify-center">
                                    <p className="flex items-center pr-3 pl-6 text-sm">残り</p>
                                    <p className="text-white text-8xl mb-4">
                                        {count - (commitTime * (repeatCount - 2)) - (restTime * (repeatCount - 3))}
                                    </p>
                                    <p className="flex items-center pl-4 pr-5 text-sm">秒</p>
                                </div>
                            </div>
                        )}
                        {display === "3セット目" && (
                            <div>
                                <p className="flex justify-center text-xl mb-5">〜3セット目〜</p>
                                <div className="flex">
                                    <p className="flex items-center pr-3 pl-6 text-sm">残り</p>
                                    <p className="text-white text-8xl mb-4">
                                        {count - (commitTime * (repeatCount - 3)) - (restTime * (repeatCount - 3))}
                                    </p>
                                    <p className="flex items-center pl-4 pr-10 text-sm">秒</p>
                                </div>
                            </div>
                        )}
                        {display === "3セット後の休憩" && (
                            <div>
                                <Trivia triviaNum={triviaNum}/>
                                <p className="text-lg pl-16 py-1">4セット目まで</p>
                                <div className="flex justify-center">
                                    <p className="flex items-center pr-3 pl-6 text-sm">残り</p>
                                    <p className="text-white text-8xl mb-4">
                                        {count - (commitTime * (repeatCount - 3)) - (restTime * (repeatCount - 4))}
                                    </p>
                                    <p className="flex items-center pl-4 pr-5 text-sm">秒</p>
                                </div>
                            </div>
                        )}
                        {display === "4セット目" && (
                            <div>
                                <p className="flex justify-center text-xl mb-5">〜4セット目〜</p>
                                <div className="flex">
                                    <p className="flex items-center pr-3 pl-6 text-sm">残り</p>
                                    <p className="text-white text-8xl mb-4">
                                        {count - (commitTime * (repeatCount - 4)) - (restTime * (repeatCount - 4))}
                                    </p>
                                    <p className="flex items-center pl-4 pr-10 text-sm">秒</p>
                                </div>
                            </div>
                        )}
                        {display === "4セット後の休憩" && (
                            <div>
                                <Trivia triviaNum={triviaNum}/>
                                <p className="text-lg pl-16 py-1">5セット目まで</p>
                                <div className="flex justify-center">
                                    <p className="flex items-center pr-3 pl-6 text-sm">残り</p>
                                    <p className="text-white text-8xl mb-4">
                                        {count - (commitTime * (repeatCount - 4)) - (restTime * (repeatCount - 5))}
                                    </p>
                                    <p className="flex items-center pl-4 pr-5 text-sm">秒</p>
                                </div>
                            </div>
                        )}
                        {display === "5セット目" && (
                            <div>
                                <p className="flex justify-center text-xl mb-5">〜5セット目〜</p>
                                <div className="flex">
                                    <p className="flex items-center pr-3 pl-6 text-sm">残り</p>
                                    <p className="text-white text-8xl mb-4">
                                        {count - (commitTime * (repeatCount - 5)) - (restTime * (repeatCount - 5))}
                                    </p>
                                    <p className="flex items-center pl-4 pr-10 text-sm">秒</p>
                                </div>
                            </div>
                        )}
                        {display === "終了後" && (
                            <p className="text-2xl mt-2 mb-8">お疲れ様でした！</p>
                        )}

                        <div className="flex pb-4">
                            <div
                                className="text-xs bg-blue-500 text-slate-50 font-medium py-3 px-2.5 mx-1 rounded hover:bg-blue-700"
                                onClick={() => start()}
                            >スタート／再開</div>
                            <div
                                className="text-xs bg-blue-500 text-slate-50 font-medium py-3 px-2.5 mx-1 rounded hover:bg-blue-700"
                                onClick={() => pause()}
                            >一時停止</div>
                            <div
                                className="text-xs bg-blue-500 text-slate-50 font-medium py-3 px-2.5 mx-1 rounded hover:bg-blue-700"
                                onClick={() => reset()}
                            >リセット</div>
                        </div>
                        {/* <p style={{ borderColor: "#101841" }} className="text-xs border-b pb-2 px-6 mx-2">
                            <SoundWarningIcon style={{ fontSize: 16, color: "#f6d60f" }} />
                            音が出ますので音量にご注意ください
                            <SoundWarningIcon style={{ fontSize: 16, color: "#f6d60f" }} />
                        </p> */}
                    </div>
                </div>
                {/*-------------------------------------------------------------------------------------------------------------------*/}

                {/* タイマー作動中は非表示にする */}
                {!isRunning &&
                    <div className="fixed bottom-12 left-0 right-0 z-30 px-1 pb-0.5">
                        <div
                            className="bg-slate-300 text-black text-xs py-1 flex-shrink-0 relative border border-slate-100 rounded w-full focus:outline-none py-1"
                            // onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="flex justify-center py-1">
                                <div className="mb-0.5">
                                    <label>コミットタイム：</label>
                                    <select
                                        name="commitTime"
                                        value={commitTime}
                                        className="rounded p-1 mx-1 border border-black"
                                        onChange={(e) => {
                                            setCommitTimeString(e.target.value);
                                        }}
                                    >
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="60">60</option>
                                    </select>
                                    <label htmlFor="commitTime">秒&nbsp;</label>
                                </div>
                                <div className="mb-0.5">
                                    <label>／ 休憩：</label>
                                    <select
                                        name="restTime"
                                        value={restTime}
                                        className="rounded p-1 mx-1 border border-black"
                                        onChange={(e) => {
                                            setRestTimeString(e.target.value);
                                        }}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="60">60</option>
                                    </select>
                                    <label htmlFor="restTime">秒</label>
                                </div>
                            </div>
                            <div className="flex justify-center py-1">
                                <div>
                                    <label>【</label>
                                    <select
                                        name="repeatCount"
                                        value={repeatCount}
                                        className="rounded ml-1 p-1 pl-2.5 border border-black"
                                        onChange={(e) => {
                                            setRepeatCountString(e.target.value);
                                        }}
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                    <label> セット 】</label>
                                </div>
                            </div>
                            {/* <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="text-small-2 bg-blue-500 text-white font-medium mr-2 my-6 px-3 rounded hover:bg-blue-700"
                                    // onClick={() => setTimer()}
                                >
                                    タイマーをセット
                                </button>
                            </div> */}
                        </div>
                    </div>
                }
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30">
                <BottomMenu currentPage="timer" />
            </div>
        </div>
    );
};

export default Timer;