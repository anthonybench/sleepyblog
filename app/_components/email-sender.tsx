"use client";
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// react
import { useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";
// 3rd party
import { PaperPlaneIcon, CheckIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// 1st party
import { sendResumeEmail } from "@/app/_lib/actions";
import { Button } from "@/app/_components/button";
import { Input } from "@/app/_components/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/form";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
const FormSchema = z.object({
  email: z.string().min(6, {
    message: "Email must be at least 6 characters.",
  }),
});
const sendButton = (emailWasSent: boolean) => {
  return emailWasSent ? (
    <Button type="submit">
      <CheckIcon />
    </Button>
  ) : (
    <Button type="submit">
      <PaperPlaneIcon />
    </Button>
  );
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function EmailSender() {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    sendResumeEmail(data.email);
    setEmailSent(true);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className={`border-grey-500 mb-5 rounded-lg border p-1`}>
              <FormLabel>
                {sendButton(emailSent)} Send my resume to your inbox
              </FormLabel>
              <FormControl>
                <Input placeholder="my-address@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
