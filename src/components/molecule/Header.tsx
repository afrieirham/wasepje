import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";

import { useHostname } from "~/hooks/useHostname";
import { usePlan } from "~/hooks/usePlan";
import { api } from "~/utils/api";

function Header() {
  const hostname = useHostname();
  const plan = usePlan();
  const { user } = useUser();
  const { signOut } = useClerk();

  const createPortalSession = api.user.createPortalSession.useQuery(
    {
      returnUrl: `${hostname}/dashboard`,
    },
    { enabled: plan !== "free", retry: plan !== "free" },
  );

  useEffect(() => {
    if (user?.publicMetadata.banned) {
      void signOut();
    }
  }, [user, signOut]);

  if (plan === "free")
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
          <div className="space-x-2">
            <UserButton
              showName
              appearance={{
                elements: { userButtonTrigger: "bg-zinc-100 py-1.5 px-2" },
              }}
            />
          </div>
        </div>
      </nav>
    );

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
        <div className="space-x-2">
          {createPortalSession.data && (
            <UserButton
              showName
              appearance={{
                elements: { userButtonTrigger: "bg-gray-100 py-1.5 px-2" },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Manage Billing"
                  labelIcon={<CreditCard className="h-4 w-4" />}
                  href={createPortalSession.data.url}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
