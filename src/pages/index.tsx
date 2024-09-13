import Image from "next/image";
import Link from "next/link";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Github, MoveRight } from "lucide-react";

import Footer from "~/components/molecule/Footer";
import SEOHead from "~/components/molecule/SEOHead";
import { Button } from "~/components/ui/button";

export default function Example() {
  return (
    <div className="bg-white">
      <SEOHead
        title="WhatsApp Link Rotator | WasepJe.com"
        description="Open-Source WhatsApp Link Rotator, an alternative to wasap.my"
        path="/"
        ogPath="/og.png"
      />

      <header className="h-[10dvh] w-full">
        <nav
          className="flex items-center justify-between max-w-screen-xl p-4 mx-auto sm:p-6 sm:px-8"
          aria-label="Global"
        >
          <div className="flex sm:flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                width={40}
                height={40}
                className="w-10 h-10"
                src="/logo.png"
                alt="wasepje.com logo"
              />
              <p className="font-bold">WasepJe.com</p>
            </Link>
          </div>
          <Button size="sm" variant="ghost" asChild>
            <Link href="/dashboard">Log in</Link>
          </Button>
        </nav>
      </header>
      <div className="mx-auto h-[90dvh] max-w-screen-xl pb-24 pt-10 sm:pb-32 lg:flex lg:flex-col lg:items-center">
        <div className="max-w-screen-xl px-4 pt-4 mx-auto text-center lg:mx-0 lg:flex lg:flex-col lg:items-center lg:justify-center lg:pt-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            One link, multiple numbers. Simple as that.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            wasep je, the open-source whatsapp link rotator, wasap.my
            alternative.
          </p>
          <div className="flex flex-col items-center justify-center gap-2 mt-10 sm:flex-row">
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button asChild className="w-full space-x-1 sm:w-auto">
                  <Link href="/dashboard">
                    <span>Get Started</span>
                    <MoveRight className="w-4 h-4" />
                  </Link>
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button asChild className="w-full space-x-1 sm:w-auto">
                <Link href="/dashboard">
                  <span>Go to Dashboard</span>
                  <MoveRight className="w-4 h-4" />
                </Link>
              </Button>
            </SignedIn>
            <Button
              asChild
              className="w-full space-x-1 sm:w-auto"
              variant="secondary"
            >
              <Link
                href="https://github.com/afrieirham/wasepje"
                target="_blank"
              >
                <Github className="w-4 h-4" />
                <span>Star us on GitHub</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center w-full">
          <Image
            width={1000}
            height={1000}
            src="/diagram.png"
            className="w-full max-w-screen-md"
            alt="wasepje redirection visualization"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
