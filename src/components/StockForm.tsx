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
    const response = await fetch("/api/alpaca", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await response.json();
    console.log("data", data);
    if (data.symbol) {
      setResponseMessage(data.symbol);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
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
                Choose a symbol, any symbol.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        {responseMessage && <p>{responseMessage}</p>}
      </form>
    </Form>
  );
}
