import { SignInButton } from "@clerk/nextjs";
import { countries } from "country-list-json";
import { Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PublicHeader from "~/components/molecule/PublicHeader";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

function Click2Chat() {
  const [value, setValue] = useState("MY");

  return (
    <div className="flex h-[100dvh] flex-col">
      <PublicHeader />
      <div className="mx-auto flex w-full max-w-sm flex-grow flex-col items-center justify-center px-2 ">
        <Label>Enter that unsaved number:</Label>
        <form className="mt-4 flex w-full">
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex h-10 w-[110px] rounded-md rounded-e-none border border-input bg-background px-3 py-2 pr-6 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.dial_code}{" "}
                {country.code === value ? "" : country.name}
              </option>
            ))}
          </select>
          <div className="relative w-full flex-1">
            <Input
              type="num"
              id="search-dropdown"
              className="w-full rounded-s-none border-s-0"
              placeholder="phone number"
              required
            />
          </div>
        </form>
        <Button className="mt-2 w-full" size="lg">
          Whatsapp Je
        </Button>
      </div>
      <div className="mx-auto flex w-full flex-row items-center justify-center space-x-2 px-2 py-6 md:hidden">
        <Button asChild variant="ghost" size="sm" className="text-xs">
          <Link href="https://github.com/afrieirham/whatsappje" target="_blank">
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
