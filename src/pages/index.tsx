import Image from "next/image";
import Link from "next/link";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Github, MoveRight } from "lucide-react";

import Footer from "~/components/molecule/Footer";
import SEOHead from "~/components/molecule/SEOHead";
import { Button } from "~/components/ui/button";
import ReactPlayer from "react-player";
import useClient from "~/hooks/useClient";

export default function Index() {
  const { isClient } = useClient();
  return (
    <div className="">
      <SEOHead
        title="WhatsApp Link Rotator | WasepJe.com"
        description="Open-Source WhatsApp Link Rotator, an alternative to wasap.my"
        path="/"
        ogPath="/og.png"
      />

      <header className="w-full border-b bg-white">
        <nav
          className="mx-auto flex max-w-screen-xl items-center justify-between p-4 sm:p-6 sm:px-8"
          aria-label="Global"
        >
          <div className="flex sm:flex-1">
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
          <Button size="sm" variant="ghost" asChild>
            <Link href="/dashboard">Log in</Link>
          </Button>
        </nav>
      </header>

      {/* hero */}
      <div className="mx-auto max-w-screen-xl py-10 lg:flex lg:flex-col lg:items-center">
        <div className="mx-auto max-w-screen-xl px-4 pt-4 text-center lg:mx-0 lg:flex lg:flex-col lg:items-center lg:justify-center lg:pt-8">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">
            One link, multiple numbers. Simple as that.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            wasep je, the open-source whatsapp link rotator, wasap.my
            alternative.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button asChild className="w-full space-x-1 sm:w-auto">
                  <Link href="/dashboard">
                    <span>Get Started</span>
                    <MoveRight className="h-4 w-4" />
                  </Link>
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button asChild className="w-full space-x-1 sm:w-auto">
                <Link href="/dashboard">
                  <span>Go to Dashboard</span>
                  <MoveRight className="h-4 w-4" />
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
                <Github className="h-4 w-4" />
                <span>Star us on GitHub</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-16 flex w-full items-center justify-center px-2">
          <Image
            width={1000}
            height={1000}
            src="/diagram.png"
            className="w-full max-w-screen-md"
            alt="wasepje redirection visualization"
          />
        </div>
      </div>

      {/* features */}
      <div className="w-full bg-white py-10 md:py-16">
        <div className="mx-auto flex max-w-screen-lg flex-col items-center justify-center gap-16 px-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full">
            {isClient && (
              <ReactPlayer
                muted
                loop
                playing
                url="/weightage.mp4"
                wrapper={({ children }) => (
                  <div className="mx-auto max-w-sm overflow-hidden rounded-xl border">
                    {children}
                  </div>
                )}
              />
            )}
          </div>
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-black md:text-3xl">
              Set Phone Number Weightage
            </h2>
            <p className="mt-4 max-w-sm">
              Decide which number gets priority. Duplicate it as many times as
              you need for better visibility.
            </p>
            <Button className="mt-8" asChild>
              <Link href="/dashboard">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
