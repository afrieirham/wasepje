import Link from "next/link";
import React, { type MutableRefObject, useRef, useState } from "react";

import { Check, Clipboard, Download, QrCode } from "lucide-react";
import { QRCode } from "react-qrcode-logo";

import { useMediaQuery } from "@/hooks/use-media-query";
import { usePlan } from "@/hooks/use-plan";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Switch } from "../ui/switch";
import { toast } from "../ui/use-toast";

function QRCodeGenerator({ url }: { url: string }) {
  const { smOrHigher } = useMediaQuery();

  const [open, setOpen] = useState(false);

  if (smOrHigher) {
    return (
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogTrigger asChild>
          <button
            className="flex h-9 items-center justify-center whitespace-nowrap rounded-s border border-e-0 p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-muted disabled:hover:bg-opacity-30 disabled:hover:text-muted"
            type="button"
          >
            <QrCode className="h-4 w-4" />
          </button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden bg-gray-100 p-0 sm:max-w-[425px]">
          <DialogHeader className="border-b bg-white p-4">
            <DialogTitle className="text-center">Download QR Code</DialogTitle>
          </DialogHeader>

          <QRControl url={url} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
      <SheetTrigger asChild>
        <button
          className="flex h-9 items-center justify-center whitespace-nowrap rounded-s border border-e-0 p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-muted disabled:hover:bg-opacity-30 disabled:hover:text-muted"
          type="button"
        >
          <QrCode className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[100dvh] overflow-scroll bg-gray-100 p-0 sm:max-w-[425px]"
      >
        <SheetHeader className="border-b bg-white p-4">
          <SheetTitle className="text-center">Download QR Code</SheetTitle>
        </SheetHeader>
        <QRControl url={url} />
      </SheetContent>
    </Sheet>
  );
}

export default QRCodeGenerator;

function QRControl({ url }: { url: string }) {
  const plan = usePlan();

  const [copied, setCopied] = useState(false);

  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgCOlor] = useState("#000000");
  const [showLogo, setShowLogo] = useState(true);
  const [userLogo, setUserLogo] = useState("");

  const qrRef = useRef<QRCode>(null);
  const qrCanvasRef = useRef<HTMLDivElement>(null);
  const logoUploadRef = useRef<HTMLInputElement>(null);

  const onClickCopy = async () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);

    try {
      const canvas = qrCanvasRef.current?.querySelector("canvas");

      if (!canvas) {
        throw new Error("QR code canvas not found.");
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve),
      );

      if (!blob) {
        throw new Error("Failed to create image blob.");
      }

      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      return;
    } catch (error) {
      toast({
        title: "Error copying image to clipboard: ",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center p-4">
        <div className="overflow-hidden rounded-lg border" ref={qrCanvasRef}>
          <QRCode
            ref={qrRef as MutableRefObject<QRCode>}
            value={url}
            logoImage={(() => {
              const displayLogo = userLogo ? userLogo : "/qr-logo.png";
              return showLogo ? displayLogo : undefined;
            })()}
            qrStyle="dots"
            fgColor={fgColor}
            bgColor={bgColor}
            removeQrCodeBehindLogo
          />
        </div>
      </div>

      <div className="space-y-4 px-8">
        {plan === "free" && (
          <div className="text-center">
            <Button size="sm" variant="outline" asChild>
              <Link href="/#pricing">Unlock QR Customization</Link>
            </Button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Switch
            id="show-logo"
            checked={showLogo}
            disabled={plan === "free"}
            onCheckedChange={() => setShowLogo(!showLogo)}
          />
          <Label
            aria-disabled={plan === "free"}
            className="aria-disabled:opacity-50"
            htmlFor="show-logo"
          >
            Show Logo
          </Label>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label
            aria-disabled={plan === "free"}
            className="aria-disabled:opacity-50"
            htmlFor="custom-logo"
          >
            Custom Logo
          </Label>
          <Input
            id="custom-logo"
            type="file"
            ref={logoUploadRef}
            disabled={plan === "free"}
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  setUserLogo(reader.result as string); // Set the uploaded logo image
                };
                reader.readAsDataURL(file); // Convert image file to data URL
              }
            }}
          />
          <Button
            size="sm"
            variant="link"
            className="text-start"
            disabled={plan === "free"}
            onClick={() => {
              if (logoUploadRef.current) {
                logoUploadRef.current.value = "";
              }
              setUserLogo("");
            }}
          >
            Remove logo
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={bgColor}
            disabled={plan === "free"}
            onChange={(e) => setBgColor(e.currentTarget.value)}
            className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 disabled:opacity-50"
          ></input>
          <label
            aria-disabled={plan === "free"}
            className="text-sm font-medium aria-disabled:opacity-50"
          >
            Background Color
          </label>
        </div>
        <div className="group flex items-center space-x-2">
          <input
            type="color"
            value={fgColor}
            disabled={plan === "free"}
            onChange={(e) => setFgCOlor(e.currentTarget.value)}
            className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 disabled:opacity-50"
          ></input>
          <label
            aria-disabled={plan === "free"}
            className="text-sm font-medium aria-disabled:opacity-50"
          >
            Foreground Color
          </label>
        </div>
      </div>

      <div className="flex flex-col space-x-0 space-y-2 p-4 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Button
          size="sm"
          type="button"
          className="w-full space-x-2"
          onClick={() => void onClickCopy()}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
          <span>Copy</span>
        </Button>
        <Button
          size="sm"
          type="button"
          className="w-full space-x-2"
          onClick={() => qrRef.current?.download("png", "QR")}
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
      </div>
    </>
  );
}
