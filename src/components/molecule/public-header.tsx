import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Github, MoveRight } from "lucide-react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

function PublicHeader() {
  return (
    <header className="border-b bg-white">
      <nav
        className="mx-auto flex max-w-screen-xl items-center justify-center p-4 md:justify-between md:p-6 md:px-8"
        aria-label="Global"
      >
        <div className="flex md:flex-1">
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
        </div>

        <div className="hidden space-x-4 md:flex md:flex-1 md:justify-end">
          <Button asChild variant="outline">
            <Link href="https://github.com/afrieirham/wasepje" target="_blank">
              <Github className="mr-2 h-4 w-4" />
              Star us on GitHub
            </Link>
          </Button>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button>
                <Link href="/dashboard">Sign Up</Link>
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard
                <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default PublicHeader;
