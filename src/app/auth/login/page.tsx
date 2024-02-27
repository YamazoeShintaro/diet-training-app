"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Inputs = {
    email: string;
    password: string;
};

const Login =  () => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await signInWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                router.push("/mainPages/homePage");
            })
            .catch((error) => {
                if(error.code === "auth/invalid-credential") {
                    alert("パスワードが間違っているか、そのようなユーザーは存在しません。");
                } else {
                    alert(error.message);
                }
            });
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-lg shadow-md w-11/12"
            >
                <h1 className="mb-4 text-gray-700 font-medium">ログイン</h1>
                <div className="mb-4">
                    <label className="block text-xs text-gray-600">Email</label>
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
                        ログイン
                    </button>
                </div>

                <div className="mt-4">
                    <span className="text-gray-600 text-xs">はじめてご利用の方はこちら</span>
                    <br />
                    <Link
                        href={"/auth/register"}
                        className="text-blue-500 text-xs font-semibold hover:text-blue-700 py-1.5"
                    >
                        →新規登録ページへ
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;