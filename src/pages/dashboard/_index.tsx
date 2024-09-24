import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { SignedIn, useUser } from "@clerk/nextjs";
import copy from "copy-to-clipboard";
import { customAlphabet } from "nanoid";
import slugify from "slugify";

import {
  Copy,
  Ellipsis,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";

import Header from "@/components/molecule/Header";
import PricingTable from "@/components/molecule/PricingTable";
import QRCodeGenerator from "@/components/molecule/QRCodeGenerator";
import SEOHead from "@/components/molecule/SEOHead";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useHostname } from "@/hooks/useHostname";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePlan } from "@/hooks/usePlan";
import type { RouterOutputs } from "@/utils/api";
import { api } from "@/utils/api";

type LinkOutput = RouterOutputs["link"]["getAll"][number];

export default function Dashboard() {
  const { user } = useUser();

  const sync = api.user.sync.useMutation();
  const getAll = api.link.getAll.useQuery();

  useEffect(() => {
    if (user) {
      sync.mutate({
        email: user.primaryEmailAddress?.emailAddress ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (getAll.isLoading)
    return (
      <SignedIn>
        <main>
          <SEOHead
            title="Dashboard | WasepJe.com"
            description="Open-Source WhatsApp Link Rotator, an alternative to wasap.my"
            path="/"
            ogPath="/og.png"
          />
          <Header />
          <div className="border-b border-zinc-200 bg-white">
            <div className="mx-auto flex w-full max-w-screen-xl justify-between px-6 py-10">
              <h1 className="text-2xl">My Links</h1>
              <CreateLinkForm />
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-screen-xl flex-col justify-between px-4 sm:px-6">
            <div className="mt-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
          <UpgradeCTA />
        </main>
      </SignedIn>
    );

  if (!getAll.data?.length)
    return (
      <SignedIn>
        <main>
          <SEOHead
            title="Dashboard | WasepJe.com"
            description="Open-Source WhatsApp Link Rotator, an alternative to wasap.my"
            path="/"
            ogPath="/og.png"
          />
          <Header />
          <div className="border-b border-zinc-200 bg-white">
            <div className="mx-auto flex w-full max-w-screen-xl justify-between px-6 py-10">
              <h1 className="text-2xl">My Links</h1>
              <CreateLinkForm />
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-screen-xl flex-col justify-between px-4 sm:px-6">
            <div className="mt-8">
              <p>You have no links yet.</p>
            </div>
          </div>
          <UpgradeCTA />
        </main>
      </SignedIn>
    );

  const totalClicks = getAll.data
    .map((link) => link._count.clicks)
    .reduce((total, link) => total + link);

  return (
    <SignedIn>
      <main>
        <SEOHead
          title="Dashboard | WasepJe.com"
          description="Open-Source WhatsApp Link Rotator, an alternative to wasap.my"
          path="/"
          ogPath="/og.png"
        />
        <Header />
        <div className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex w-full max-w-screen-xl justify-between px-6 py-10">
            <h1 className="text-2xl">My Links</h1>
            <CreateLinkForm />
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-screen-xl flex-col justify-between px-4 sm:px-6">
          <div className="mt-8">
            <p>Total clicks: {totalClicks} (last 30 days)</p>
            {getAll.data.map((link) => (
              <LinkItem link={link} key={link.id} />
            ))}
          </div>
        </div>
        <UpgradeCTA />
      </main>
    </SignedIn>
  );
}

function UpgradeCTA() {
  const plan = usePlan();

  if (plan === "pro") return null;
  return (
    <div className="px-4 py-16">
      <p className="text-center text-2xl font-bold">Upgrade to Pro today!</p>
      <PricingTable showFree />
    </div>
  );
}

function CreateLinkForm() {
  const { smOrHigher } = useMediaQuery();
  const plan = usePlan();
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 5);
  const random = nanoid(5);

  const host = useHostname();
  const ctx = api.useContext();

  const create = api.link.create.useMutation({
    onSuccess: () => {
      void ctx.link.getAll.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Cannot create link!",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [phones, setPhones] = useState([{ value: "" }]);

  const resetFormFields = () => {
    setName("");
    setSlug("");
    setMessage("");
    setPhones([{ value: "" }]);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    create.mutate({ name, slug, phones, message });
    setOpen(false);
    resetFormFields();
    toast({
      title: "Link successfully created!",
      description: `${host}/${slug}`,
    });
  };

  const onAddPhoneNumber = () => {
    setPhones([...phones, { value: "" }]);
  };

  const onDeletePhone = (index: number) => {
    const newPhones = phones.filter((_phone, i) => i !== index);
    setPhones(newPhones);
  };

  const setPhoneValue = (value: string, index: number) => {
    const updatedPhones = phones.map((phone, i) => {
      if (i === index) {
        return {
          ...phone,
          value,
        };
      }
      return phone;
    });

    setPhones(updatedPhones);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Create Link</Button>
      </SheetTrigger>
      <SheetContent
        className="max-h-[100dvh] overflow-scroll sm:max-w-[425px]"
        side={smOrHigher ? "right" : "bottom"}
      >
        <form onSubmit={onSubmit}>
          <SheetHeader>
            <SheetTitle>Create a new link</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Syarikat Saya"
                value={name}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  if (value.length > 0) {
                    setSlug(
                      `${slugify(value, {
                        lower: true,
                        strict: true,
                      })}${plan === "free" ? `-${random}` : ""}`,
                    );
                  } else {
                    setSlug(plan === "free" ? random : "");
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="slug">Slug</Label>
                {plan === "free" && (
                  <Link
                    href="/#pricing"
                    className="rounded-sm border  bg-black px-2 py-1 text-xs font-medium text-white hover:bg-gray-800"
                  >
                    Unlock premium slug
                  </Link>
                )}
              </div>
              <Input
                id="slug"
                name="slug"
                placeholder="syarikat-saya"
                value={slug}
                disabled={plan === "free"}
                onChange={(e) => setSlug(`${e.target.value.trim()}`)}
              />
              <p className="text-xs text-muted-foreground">
                {host}/{slug}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message" className="">
                Pre-filled Text (Optional)
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Hi, barang A masih available?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Phone Number</Label>
              <p className="text-xs text-muted-foreground">
                Include country code.
              </p>
              {phones?.map((phone, i) => (
                <div key={i} className="flex space-x-1">
                  <Input
                    required
                    type="tel"
                    name={`phone-${i}`}
                    placeholder="60131231234"
                    value={phone.value}
                    onChange={(e) => setPhoneValue(e.target.value.trim(), i)}
                  />
                  {phones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onDeletePhone(i)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button type="button" variant="ghost" onClick={onAddPhoneNumber}>
                <Plus className="mr-2 h-4 w-4" /> Add phone number
              </Button>
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Create Link</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function LinkItem({ link }: { link: LinkOutput }) {
  const host = useHostname();
  const ctx = api.useContext();
  const url = `${host}/${link.slug}`;

  const deleteLink = api.link.delete.useMutation({
    onSuccess: () => {
      void ctx.link.getAll.invalidate();
    },
  });

  const onClickCopy = () => {
    copy(url);
    toast({ title: "Link copied!", description: url });
  };

  const onDeleteLink = () => {
    deleteLink.mutate({ id: link.id });
    toast({ title: "Link successfully deleted!", description: url });
  };

  return (
    <div className="mt-2 flex items-center justify-between rounded border bg-white p-4 hover:border-zinc-400">
      <div className="flex flex-col justify-center space-y-1">
        <p className="font-semibold">{link.name}</p>
        <p className="text-xs text-zinc-500">{url}</p>
        <p className="text-xs text-zinc-500">
          {link._count.clicks} clicks (last 30 days)
        </p>
      </div>
      <div className="flex">
        <QRCodeGenerator url={url} />

        <a
          target="_blank"
          href={url}
          className="flex h-9 items-center justify-center whitespace-nowrap border border-e-0 p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-muted disabled:hover:bg-opacity-30 disabled:hover:text-muted"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
        <button
          onClick={onClickCopy}
          className="flex h-9 min-h-[36px] min-w-[36px] items-center justify-center whitespace-nowrap rounded-none border p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-muted disabled:hover:bg-opacity-30 disabled:hover:text-muted"
        >
          <Copy className="h-4 w-4" />
        </button>

        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-9 min-h-[36px] min-w-[36px] items-center justify-center whitespace-nowrap rounded-e border border-s-0 p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-muted disabled:hover:bg-opacity-30 disabled:hover:text-muted"
                type="button"
              >
                <Ellipsis className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${link.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                Warning: This action cannot be undone. Are you sure you want to
                permanently delete this link?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={onDeleteLink}>
                Confirm Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
