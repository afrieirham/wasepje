import Link from "next/link";
import React, { useState } from "react";

import { ChevronLeft, Trash } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialField = {
  name: "",
  type: "",
  required: false,
};

function FormIndex() {
  const [parent] = useAutoAnimate();

  const [fields, setFields] = useState([{ ...initialField, id: 0 }]);
  const [counter, setCounter] = useState(1);

  return (
    <DashboardLayout>
      <div>
        <Button variant="link" size="sm" className="-ml-3" asChild>
          <Link href="/dashboard/forms">
            <ChevronLeft className="h-4 w-4" />
            <span>Forms</span>
          </Link>
        </Button>
      </div>
      <div className="mt-4 w-full pb-8">
        <h1 className="text-lg font-bold">Create Form</h1>
        <form className="mt-4 flex flex-col rounded-lg border bg-white">
          <div className="space-y-6 p-4 sm:p-6" ref={parent}>
            {fields.map((q, i) => (
              <div
                key={q.id}
                className="max-w-md space-y-4 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <p>Field {i + 1}</p>
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    hidden={fields.length === 1}
                    aria-hidden={fields.length === 1}
                    className="space-x-1 text-xs aria-hidden:hidden"
                    onClick={() =>
                      setFields(fields.filter((f) => f.id !== q.id))
                    }
                  >
                    <Trash className="h-4 w-4" />
                    <span>Remove</span>
                  </Button>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="question-name">Question</Label>
                  <Input
                    id="question-name"
                    type="text"
                    placeholder="What's your name?"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Short answer</SelectItem>
                    <SelectItem value="textarea">Paragraph</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Full date</SelectItem>
                    <SelectItem value="datetime">Date & Time</SelectItem>
                    <SelectItem value="tel">Telephone</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Checkbox id="required" />
                  <Label htmlFor="required">Required</Label>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setFields([...fields, { ...initialField, id: counter }]);
                  setCounter(counter + 1);
                }}
              >
                Add Question
              </Button>
            </div>
          </div>
          <div className="border-t bg-zinc-100 p-4 sm:px-10 sm:py-6">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default FormIndex;
