import Link from "next/link";
import { useRouter } from "next/router";
import React, { type FormEvent, useEffect, useState } from "react";

import { type Phone } from "@prisma/client";
import { ChevronLeft, Loader2, Pencil, Plus, Trash } from "lucide-react";
import slugify from "slugify";

import DashboardLayout from "@/components/layout/dashboard-layout";
import SEOHead from "@/components/molecule/seo-head";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useHostname } from "@/hooks/use-hostname";
import { usePlan } from "@/hooks/use-plan";
import { api } from "@/utils/api";

function EditLink() {
  const router = useRouter();
  const plan = usePlan();
  const host = useHostname();
  const ctx = api.useContext();

  const getOne = api.link.getOne.useQuery({ id: String(router.query.id) });
  const update = api.link.update.useMutation({
    onError: (error) => {
      toast({
        title: "Please use different slug.",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const addOnePhone = api.phone.addOne.useMutation({
    onSuccess: () => {
      void ctx.link.getOne.invalidate();
    },
  });

  const [addPhoneDialog, setAddPhoneDialog] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [postfix, setPostfix] = useState("");

  const link = getOne.data;

  useEffect(() => {
    if (link) {
      setName(link.name);
      setSlug(link.slug);
      setMessage(link.message ?? "");

      if (plan === "free") {
        setPostfix(link.slug.substring(link.slug.length - 5));
      }
    }
  }, [link, plan]);

  if (!link) return null;

  const onSubmitGeneral = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!getOne.data) {
      return;
    }

    update.mutate({ id: getOne.data.id, name, slug, message });
    toast({
      title: "Link successfully updated!",
      description: `${host}/${slug}`,
    });
  };

  const onAddPhone = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { phone } = Object.fromEntries(new FormData(e.currentTarget)) as {
      phone: string;
    };

    addOnePhone.mutate({ linkId: link.id, number: phone });
    toast({ title: "Phone successfully added!", description: phone });
    setAddPhoneDialog(false);
  };

  return (
    <DashboardLayout>
      <SEOHead
        title="Edit Link | WasepJe.com"
        description="Open-Source WhatsApp Link Rotator, an alternative to wasap.my"
        path="/"
        ogPath="/og.png"
      />
      <div>
        <Button variant="link" size="sm" className="-ml-3" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            <span>Links</span>
          </Link>
        </Button>
      </div>
      <div className="mt-4 w-full pb-8">
        <p className="text-lg font-bold">General</p>
        <form
          onSubmit={onSubmitGeneral}
          className="mt-4 flex flex-col rounded-lg border bg-white"
        >
          <div className="p-4 sm:p-10">
            <div className="flex flex-col">
              <Label htmlFor="name" className="">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={name}
                className="mt-2 w-full max-w-md"
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);

                  if (value.length > 0) {
                    setSlug(
                      `${slugify(value, {
                        lower: true,
                        strict: true,
                      })}${plan === "free" ? `-${postfix}` : ""}`,
                    );
                  } else {
                    setSlug(plan === "free" ? postfix : "");
                  }
                }}
              />
            </div>
            <div className="mt-4 flex flex-col">
              <div className="flex items-center space-x-2">
                <Label htmlFor="slug" className="">
                  Slug
                </Label>
                {plan === "free" && (
                  <Link
                    href="/#pricing"
                    className="rounded-sm border bg-black px-2 py-1 text-xs font-medium text-white hover:bg-gray-800"
                  >
                    Unlock premium slug
                  </Link>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {host}/{slug}
              </p>
              <Input
                id="slug"
                name="slug"
                className="mt-2 w-full max-w-md"
                value={slug}
                disabled={plan === "free"}
                onChange={(e) => setSlug(e.target.value.trim())}
              />
            </div>
            <div className="mt-4 flex flex-col">
              <Label htmlFor="message" className="">
                Pre-filled Text (Optional)
              </Label>

              <Textarea
                id="message"
                name="message"
                className="mt-2 w-full max-w-md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="border-t bg-zinc-100 p-4 sm:px-10 sm:py-6">
            <Button type="submit">
              {update.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
        <p className="mt-8 text-lg font-bold">Manage Phone Numbers</p>
        <div className="mt-4 flex flex-col rounded-lg border bg-white">
          <div className="p-4 sm:p-10">
            <Label>Phone Numbers</Label>
            <p className="text-xs text-muted-foreground">
              Must have at least 1 active number.
            </p>
            {link.phones?.map((phone) => (
              <PhoneItem key={phone.id} phone={phone} phones={link.phones} />
            ))}

            <div className="mt-4">
              <Dialog onOpenChange={setAddPhoneDialog} open={addPhoneDialog}>
                <DialogTrigger asChild>
                  <Button type="button" variant="ghost">
                    <Plus className="mr-2 h-4 w-4" /> Add phone
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={onAddPhone}>
                    <DialogHeader>
                      <DialogTitle>Add phone</DialogTitle>
                      <DialogDescription>
                        Please include country code without the plus (+) sign.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" name="phone" required />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Submit</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditLink;

function PhoneItem({ phone, phones }: { phone: Phone; phones: Phone[] }) {
  const ctx = api.useContext();

  const [open, setOpen] = useState(false);
  const [phoneInput, setPhone] = useState(phone.number);

  const deleteOnePhone = api.phone.deleteOne.useMutation({
    onSuccess: () => {
      void ctx.link.getOne.invalidate();
    },
  });

  const updateOnePhone = api.phone.updateOne.useMutation({
    onSuccess: () => {
      void ctx.link.getOne.invalidate();
    },
  });

  const onEditPhone = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateOnePhone.mutate({ id: phone.id, number: phoneInput });
    toast({ title: "Phone successfully updated!" });
    setOpen(false);
  };

  const onDeletePhone = () => {
    deleteOnePhone.mutate({ id: phone.id });
    toast({
      title: "Phone successfully deleted!",
      description: phone.number,
    });
  };

  return (
    <div className="mt-2 flex space-x-1">
      <Input
        required
        value={phone.number}
        onChange={() => null}
        className="w-full max-w-md"
        readOnly
        disabled
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={onEditPhone}>
            <DialogHeader>
              <DialogTitle>Edit phone</DialogTitle>
              <DialogDescription>
                Please include country code without the plus (+) sign.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                required
                value={phoneInput}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {phones.length > 1 && (
        <Button
          size="icon"
          type="button"
          variant="ghost"
          onClick={onDeletePhone}
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
