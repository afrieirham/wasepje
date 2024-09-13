import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Github, MoveRight } from "lucide-react";
import BackgroundPlayer from "next-video/background-player";

import Footer from "~/components/molecule/Footer";
import SEOHead from "~/components/molecule/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";

export default function Index() {
  const [openItem, setOpenItem] = useState("1");
  const onValueChange = (value: string) => setOpenItem(value);

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
      <div className="mx-auto max-w-screen-xl border-b py-16 lg:flex lg:flex-col lg:items-center">
        <div className="mx-auto max-w-screen-xl px-4 text-center lg:mx-0 lg:flex lg:flex-col lg:items-center lg:justify-center">
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
            priority
            width={1000}
            height={1000}
            src="/diagram.png"
            className="w-full max-w-screen-md"
            alt="wasepje redirection visualization"
          />
        </div>
      </div>

      {/* how it works */}
      <div className="flex w-full flex-col bg-white px-8 py-10 md:py-16">
        <h3 className="mx-auto max-w-screen-lg text-3xl font-black md:text-3xl">
          Create links easily
        </h3>
        <div className="mx-auto mt-8 w-full max-w-screen-lg">
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 ">
            <div className="flex w-full flex-col justify-center">
              <Accordion
                type="single"
                value={openItem}
                onValueChange={onValueChange}
              >
                <AccordionItem value="1">
                  <AccordionTrigger className="font-bold hover:no-underline">
                    Choose a unique link slug
                  </AccordionTrigger>
                  <AccordionContent>
                    Start by creating a unique link with a custom slug that
                    makes it easy to share and remember.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="2">
                  <AccordionTrigger className="font-bold hover:no-underline">
                    Write a pre-filled text
                  </AccordionTrigger>
                  <AccordionContent>
                    Optionally, write a prefilled text that users will see when
                    they click the link, making communication faster and more
                    convenient.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="3">
                  <AccordionTrigger className="font-bold hover:no-underline">
                    Add phone numbers
                  </AccordionTrigger>
                  <AccordionContent>
                    Add all the phone numbers you want to connect to the link,
                    allowing customers to reach you on multiple numbers with a
                    single click.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="4">
                  <AccordionTrigger className="font-bold hover:no-underline">
                    Set phone number weightage
                  </AccordionTrigger>
                  <AccordionContent>
                    Decide which number gets priority. Duplicate it as many
                    times as you need for better visibility.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/dashboard">Get Started Now</Link>
                </Button>
              </div>
            </div>
            <div className="order-first w-full md:order-last">
              <BackgroundPlayer
                src="/demo.mp4"
                className="mx-auto max-w-sm overflow-hidden rounded-xl border"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
