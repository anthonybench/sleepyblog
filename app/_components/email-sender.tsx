"use client";

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
import { ThemeContext } from "../_lib/themes";

// params
const FormSchema = z.object({
  email: z.string().email(),
});
const sendButton = (emailWasSent: boolean, style: string) => {
  return emailWasSent ? (
    <Button type="submit" className={`${style}`}>
      <CheckIcon width="18" height="18" color="green" />
    </Button>
  ) : (
    <Button type="submit" className={`border ${style}`}>
      <PaperPlaneIcon className={``} />
    </Button>
  );
};

// view
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
    <ThemeContext.Consumer>
      {(selectedTheme) => (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`w-2/3 space-y-6 `}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem
                  className={`mb-5 rounded-lg border ${selectedTheme.pkg.emailSender} p-1`}
                >
                  <FormLabel>
                    {sendButton(emailSent, selectedTheme.pkg.button)} Send my
                    resume to your inbox
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`${selectedTheme.pkg.searchBar}`}
                      placeholder="my_address@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </ThemeContext.Consumer>
  );
}
