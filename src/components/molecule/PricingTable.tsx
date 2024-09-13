import Link from "next/link";
import React from "react";

import { Check, MoveRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useUserCountry from "~/hooks/useUserCountry";
import { Button } from "../ui/button";
import SubscribeButton from "./SubscribeButton";

function PricingTable() {
  const { country } = useUserCountry();

  return (
    <div className="mx-auto mt-8 grid max-w-5xl gap-8 md:grid-cols-2">
      {/* Free Tier */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl">Free</CardTitle>
          <CardDescription>For individuals and small business.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="mb-4 text-4xl font-bold">
            {country === "MY" ? "RM0" : "$0"}
            <span className="text-xl font-normal">/month</span>
          </p>
          <ul className="space-y-2">
            <FeatureItem>Random generated link</FeatureItem>
            <FeatureItem>Unlimited phone numbers</FeatureItem>
            <FeatureItem>Phone number weightage</FeatureItem>
            <FeatureItem>5-second delay before redirect</FeatureItem>
            <FeatureItem>Generate QR Code</FeatureItem>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full space-x-2" asChild>
            <Link href="/dashboard">
              <span>Choose Free</span>
              <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Pro Tier */}
      <Card className="flex flex-col  border-2 border-zinc-900 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Pro</CardTitle>
          <CardDescription>
            For business with more advance requirement.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="mb-4 text-4xl font-bold">
            {country === "MY" ? "RM9" : "$9"}
            <span className="text-xl font-normal">/month</span>
          </p>
          <ul className="space-y-2">
            <FeatureItem>5 Premium Links</FeatureItem>
            <FeatureItem>Unlimited phone numbers</FeatureItem>
            <FeatureItem>Phone number weightage</FeatureItem>
            <FeatureItem>Instant redirect</FeatureItem>
            <FeatureItem>Generate Customizable QR Code</FeatureItem>
          </ul>
        </CardContent>
        <CardFooter>
          <SubscribeButton className="flex w-full space-x-2">
            <span>Choose Pro</span>
            <MoveRight className="h-4 w-4" />
          </SubscribeButton>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PricingTable;

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center space-x-2">
      <Check className="h-5 w-5 text-black" />
      <span>{children}</span>
    </li>
  );
}
