import Image from "next/image";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex items-center h-screen justify-center max-w-[1650px] mx-auto">
      <div className="flex-1">
        <div className="mb-8 text-center space-y-3">
          <h3 className="text-5xl font-bold text-amber-400">
            Welcome to AskDB
          </h3>
          <p className="text-white text-lg max-w-md font-semibold mx-auto">
            Your intelligent assistant for exploring and querying your company’s
            database — get instant answers with natural language.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src={"/askdb-authpage.svg"}
            alt="auth-image"
            width={600}
            height={800}
          />
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AuthLayout;
