import Link from "next/link";
import React, { useState } from "react";

import { Check, Gift, MoveRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useUserCountry from "~/hooks/useUserCountry";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import SubscribeButton from "./SubscribeButton";

function PricingTable({ showFree }: { showFree?: boolean }) {
  const { country } = useUserCountry();
  const [billing, setBilling] = useState<"monthly" | "annually">("annually");

  return (
    <>
      <div className="mb-4 mt-4 flex flex-col items-center">
        <Tabs
          value={billing}
          onValueChange={(value) => setBilling(value as "monthly" | "annually")}
          className="mb-2"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annually">Annually</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 md:flex-row">
        {/* Free Tier */}
        {showFree && (
          <Card className="flex w-full flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>
                For individuals and small business.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <p className="text-4xl font-bold">
                  {country === "MY" ? "RM0" : "$0"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span>per month, </span>
                  <span>billed {billing}</span>
                </p>
              </div>
              <ul className="space-y-2">
                <FeatureItem>Phone number rotator</FeatureItem>
                <FeatureItem>Unlimited phone numbers</FeatureItem>
                <FeatureItem>Phone number weightage</FeatureItem>
                <FeatureItem>Link clicks count</FeatureItem>
                <FeatureItem>Links with random alphabet attached</FeatureItem>
                <FeatureItem>2-second delay before redirect</FeatureItem>
                <FeatureItem>QR Code (with our logo)</FeatureItem>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full space-x-2" asChild>
                <Link href="/dashboard">
                  <span>Get Started</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Pro Tier */}
        <Card className="flex w-full max-w-none flex-col border-4 border-zinc-900 shadow-2xl sm:max-w-[50%]">
          <CardHeader>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>
              For business with more advance requirement.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-4">
              <p className="text-4xl font-bold">
                {billing === "monthly"
                  ? country === "MY"
                    ? "RM9.00"
                    : "$9.00"
                  : country === "MY"
                  ? "RM7.50"
                  : "$7.50"}
              </p>
              <p className="text-sm text-muted-foreground">
                <span>per month, </span>
                <span>billed {billing}</span>
              </p>

              <Badge
                variant={billing === "annually" ? "default" : "secondary"}
                className={`mt-2 space-x-1  transition ${
                  billing === "annually"
                    ? "animate-in"
                    : "text-zinc-300 line-through animate-out"
                }`}
              >
                <Gift className="h-4 w-4" />
                <span className="text-xs">2 months free</span>
              </Badge>
            </div>
            <ul className="space-y-2">
              <FeatureItem>Phone number rotator</FeatureItem>
              <FeatureItem>Unlimited phone numbers</FeatureItem>
              <FeatureItem>Phone number weightage</FeatureItem>
              <FeatureItem>Link clicks count</FeatureItem>
              <FeatureItem>Premium Links (customizable slug)</FeatureItem>
              <FeatureItem>Instant redirect</FeatureItem>
              <FeatureItem>QR Code (custom logo and color)</FeatureItem>
            </ul>
          </CardContent>
          <CardFooter>
            <SubscribeButton
              billing={billing}
              className="flex w-full space-x-2"
            >
              <span>Choose Pro</span>
              <MoveRight className="h-4 w-4" />
            </SubscribeButton>
          </CardFooter>
        </Card>
      </div>
    </>
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
