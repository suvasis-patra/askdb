import Navbar from "@/components/custom/navbar";

const PagesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full">
      <Navbar />
    </div>
  );
};

export default PagesLayout;
