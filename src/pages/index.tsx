import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Github, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SEOHead from "~/components/molecule/SEOHead";
import { Button } from "~/components/ui/button";

export default function Example() {
  return (
    <div>
      <SEOHead
        title="WhatsApp Link Rotator | WhatsappJe.com"
        description="Open-Source WhatsApp Link Rotator built with Next.js, TailwindCSS, tRPC, shadcn/ui."
        path="/"
      />

      <header className="border-b bg-white">
        <nav
          className="mx-auto flex max-w-screen-xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex  lg:flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                width={40}
                height={40}
                className="h-10 w-10"
                src="/logo.png"
                alt="whatsappje.com logo"
              />
              <p className="font-bold">WhatsappJe.com</p>
            </Link>
          </div>

          <div className="hidden space-x-4 md:flex md:flex-1 md:justify-end">
            <Button asChild variant="outline">
              <Link
                href="https://github.com/afrieirham/whatsappje"
                target="_blank"
              >
                <Github className="mr-2 h-4 w-4" />
                Star us on GitHub
              </Link>
            </Button>
            <SignedOut>
              <SignInButton redirectUrl="/dashboard">
                <Button>Sign Up</Button>
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

      <div className="flex flex-col items-center justify-center pt-8 text-center sm:pt-16">
        <h1 className="sm:text-4x px-4 text-3xl font-bold tracking-tight text-gray-900">
          Open-source WhatsApp Link Rotator
        </h1>
        <div className="mt-6 flex w-full max-w-md flex-col space-y-2 px-4 md:hidden">
          <SignedOut>
            <SignInButton redirectUrl="/dashboard">
              <Button size="lg">Sign Up</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button asChild size="lg">
              <Link href="/dashboard">
                Go to Dashboard
                <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </SignedIn>
          <Button asChild variant="outline">
            <Link
              href="https://github.com/afrieirham/whatsappje"
              target="_blank"
            >
              <Github className="mr-2 h-4 w-4" />
              Star us on GitHub
            </Link>
          </Button>
        </div>
        <p className="mt-4">Watch to learn more ⤵</p>
        <iframe
          className="mx-auto mt-2 h-[360px] max-h-[480px] w-full max-w-[853.33px] object-cover px-4  sm:h-[480px] "
          src="https://www.youtube.com/embed/pJYsyMvQy74?si=Jpnn1jt2Vs6QT1e5"
          title="WhatsappJe.com video guide"
          allowFullScreen
        />
      </div>
    </div>
  );
}
