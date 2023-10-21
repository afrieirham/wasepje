import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import SEOHead from "~/components/molecule/SEOHead";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <>
      <SEOHead
        title="WhatsApp Link Rotator | WhatsappJe.com"
        description="Open-Source WhatsApp Link Rotator built with Next.js, TailwindCSS, tRPC, shadcn/ui."
        path="/"
      />
      <main className="flex h-screen w-full flex-col items-center justify-center">
        <SignedOut>
          <SignInButton redirectUrl="/dashboard">
            <Button>Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </SignedIn>
      </main>
    </>
  );
}
