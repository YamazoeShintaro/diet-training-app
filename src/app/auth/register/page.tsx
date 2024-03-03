"use client";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth, db } from "../../../../firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";
import { useAppContext } from "@/context/AppContext";

type Inputs = {
    email: string;
    password: string;
};

const Register =  () => {
    const router = useRouter();

    const { userId } = useAppContext();
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                signInWithEmailAndPassword(auth, data.email, data.password)
                    .then(() => {
                        setDoc(doc(db, "users", userCredential.user.uid), {
                            currentWeight: "60",
                            goalWeight: "50",
                            bodyPart: "お腹",
                            name: "未設定",
                            userId: userId,
                            height: "170",
                            gender: "男性",
                        });
                        router.push("/auth/initialSetting");
                    })
                    .catch((error) => {
                        if(error.code === "auth/invalid-credential") {
                            alert("パスワードが間違っているか、そのようなユーザーは存在しません。");
                        } else {
                            alert(error.message);
                        }
                    });
            })
            .catch((error) => {
                if(error.code === "auth/email-already-in-use") {
                    alert("このメールアドレスは既に使用されています。");
                } else {
                    alert(error.message);
                }
            })
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-lg shadow-md w-11/12"
            >
                <h1 className="mb-4 text-gray-700 font-medium">新規登録</h1>
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600">Email</label>
                    <input
                        {...register("email", {
                            required: "※メールアドレスは必須です。",
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                                message: "※不適切なメールアドレスです。"
                            },
                        })}
                        type="text"
                        className="text-sm mt-1 border-2 rounded-md w-full p-2"
                    />
                    <div className="text-red-600 text-xs">
                        {errors.email?.message}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-xs text-gray-600">
                        Password
                    </label>
                    <input
                        {...register("password", {
                            required: "※パスワードは必須です。",
                            minLength: {
                                value: 6,
                                message: "※6文字以上入力してください。"
                            },
                        })}
                        type="password"
                        className="text-sm mt-1 border-2 rounded-md w-full p-2"
                    />
                    <div className="text-red-600 text-xs">
                        {errors.password?.message}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="text-sm bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
                    >
                        新規登録
                    </button>
                </div>

                <div className="mt-4">
                    <span className="text-gray-600 text-xs">既にアカウントをお持ちの方はこちら</span>
                    <br />
                    <Link
                        href={"/auth/login"}
                        className="text-blue-500 text-xs font-semibold hover:text-blue-700 py-1.5"
                    >
                        →ログインページへ
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;