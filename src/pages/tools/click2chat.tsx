import { SignInButton } from "@clerk/nextjs";
import { countries } from "country-list-json";
import { Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PublicHeader from "@/components/molecule/PublicHeader";
import SEOHead from "@/components/molecule/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Click2Chat() {
  const [countryCode, setCode] = useState("MY");
  const [phone, setPhone] = useState("");

  const onSubmit = () => {
    if (!phone) return alert("Please enter phone number.");

    const fullPhone =
      String(
        countries.find((country) => country.code === countryCode)?.dial_code,
      ) + phone;

    window.open("https://wa.me/" + fullPhone);
  };

  return (
    <div className="flex h-[100dvh] flex-col">
      <SEOHead
        title="Click to Chat by WasepJe.com"
        description="Stop cluttering your contact list. Click to WhatsApp temporary contacts."
        path="/tools/click2chat"
        ogPath="/click2chat.png"
      />
      <PublicHeader />
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-sm flex-grow flex-col items-center justify-center px-2 "
      >
        <Label>Enter that unsaved number:</Label>
        <div className="mt-4 flex w-full">
          <select
            value={countryCode}
            onChange={(e) => setCode(e.target.value)}
            className="flex h-10 w-[110px] rounded-md rounded-e-none border border-input bg-background px-3 py-2 pr-6 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.dial_code}{" "}
                {country.code === countryCode ? "" : country.name}
              </option>
            ))}
          </select>
          <div className="relative w-full flex-1">
            <Input
              required
              type="num"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="phone number"
              className="w-full rounded-s-none border-s-0"
            />
          </div>
        </div>
        <Button type="submit" className="mt-2 w-full" size="lg">
          Whatsapp Je
        </Button>
      </form>
      <div className="mx-auto flex w-full flex-row items-center justify-center space-x-2 px-2 py-6 md:hidden">
        <Button asChild variant="ghost" size="sm" className="text-xs">
          <Link href="https://github.com/afrieirham/wasepje" target="_blank">
            <Github className="mr-2 h-4 w-4" />
            Star us on GitHub
          </Link>
        </Button>
        <SignInButton>
          <Button variant="outline" size="sm" className="text-xs">
            Sign Up
          </Button>
        </SignInButton>
      </div>
    </div>
  );
}

export default Click2Chat;
