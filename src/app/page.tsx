import { useAppContext } from "@/context/AppContext";
import Login from "./auth/login/page";
import Home from "./mainPages/homePage/page";
// import { GetServerSideProps } from "next";

// export const getServerSideProps: GetServerSideProps = async() => {
//   const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

//   return {
//       props: {
//           openaiApiKey,
//       }
//   };
// };

export default function TrainingApplication() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="h-full" style={{ width: "1280px" }}>
        <Login />
      </div>
    </div>
  );
};
