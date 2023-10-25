import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Github, MoveRight } from "lucide-react";
import Link from "next/link";
import PublicHeader from "~/components/molecule/PublicHeader";
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

      <PublicHeader />

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
