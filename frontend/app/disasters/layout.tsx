import Sidebar from "../components/Sidebar";

import { ReactNode } from "react";

export default function DisastersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#1A2526] text-white">
      <Sidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
