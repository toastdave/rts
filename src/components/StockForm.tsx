import { useState } from "react";
import type { FormEvent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Session } from "better-auth";

const formSchema = z.object({
  symbol: z.string().max(14, {
    message: "Symbol can only be 14 characters or less.",
  }),
});

export default function StockForm() {
  const [responseMessage, setResponseMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const trimmedValues = {
      symbol: values.symbol.trim()
    };

    const response = await fetch("/api/alpaca", {
      method: "POST",
      body: JSON.stringify(trimmedValues),
    });
    const data = await response.json();
    console.log("data", data);
    if (data.open) {
      setResponseMessage(data.open);
    }
    if (data.message) {
      setResponseMessage(data.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md flex flex-col items-center">
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Find Any Stock Open Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="Symbol"
                  {...field}
                  id="symbol"
                  name="symbol"
                  autoComplete="symbol"
                  required
                />
              </FormControl>
              <FormDescription>
                Choose a symbol and submit to find the open price.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-green-400 text-white hover:bg-neutral-900 hover:border-green-400 hover:border-1 hover:cursor-pointer">Submit</Button>
        {responseMessage && <p id="responseMessage">{responseMessage}</p>}
      </form>
    </Form>
  );
}
