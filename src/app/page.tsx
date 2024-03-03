import Login from "./auth/login/page";

export default function TrainingApplication() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="h-full" style={{ width: "1280px" }}>
        <Login />
      </div>
    </div>
  );
};
