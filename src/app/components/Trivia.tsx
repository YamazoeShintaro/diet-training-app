type TriviaNum = { triviaNum: number | undefined };

export default function Trivia({triviaNum}: TriviaNum) {
    const triviaBox = [
        "アブラカタブラの本来の意味は『花粉症退治』",
        "赤ちゃんコアラは母親の糞を食べて必要な栄養を吸収している",
        "ガリガリくんの当たりの確率は『約3％』",
        "通話中に電話から聴こえる声は『声が似ている別人の声』",
        "「テンパる」の本来の意味は『準備が整う』",
        "「ヨッシー」の本名は『T.ヨシザウルス・ムンチャクッパス』",
        "じゃんけんで勝率を上げる方法は『「最初はグー！じゃんけんポン！」を強く言ってパーを出す』",
        "イギリスの面白い法律『妊婦はどこで用を足しても大丈夫』",
        "イギリスの面白い法律『バーで酔っ払ってはいけない』",
        "イギリスの面白い法律『切手の王または女王の肖像を逆さまに貼り付けてはいけない』",
    ];

    return (
        <div className="relative">
            {/* <div className="absolute left-7 -top-3">
                <Image src={TriviaImage} alt="" width={30} height={30}/>
            </div> */}
            <p className="bg-slate-300 text-black border-2 border-slate-100 rounded-md text-sm mb-4 mx-10 px-1.5 py-1.5 max-w-lg flex justify-center">
                {/* 受け取った0~9の乱数番目の雑学を表示 */}
                {triviaBox[triviaNum!]}
            </p>
        </div>
    );
}