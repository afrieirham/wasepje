import { UserButton } from "@clerk/nextjs";
import React from "react";

function Header() {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-screen-xl justify-between px-6 py-6">
        <p className="font-bold">MesejKami.com</p>
        <UserButton showName afterSignOutUrl="/" />
      </div>
    </nav>
  );
}

export default Header;
