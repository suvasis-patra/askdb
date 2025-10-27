import Sidebar from "@/components/custom/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}
