import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (user?.publicMetadata.banned) {
      void signOut();
    }
  }, [user, signOut]);

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-screen-xl justify-between px-6 py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            width={40}
            height={40}
            className="h-10 w-10"
            src="/logo.png"
            alt="wasepje.com logo"
          />
          <p className="font-bold">WasepJe.com</p>
        </Link>
        <UserButton showName afterSignOutUrl="/" />
      </div>
    </nav>
  );
}

export default Header;
