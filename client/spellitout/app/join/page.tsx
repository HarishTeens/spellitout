"use client";
import React from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  prefLang: z.string().min(2, {
    message: "Language must be at least 2 characters.",
  }),
});

const JoinPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      prefLang: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    const { name, prefLang } = data;

    localStorage.setItem("prefLang", prefLang);
    localStorage.setItem("name", name[0].toUpperCase() + name.slice(1));

    router.push("/view");
    form.reset();
  };

  return (
    <main className=" min-h-screen w-full bg-gradient-to-r from-gray-900 to-black text-white flex items-center justify-center flex-col gap-y-4 mx-auto px-4 md:px-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full max-w-lg flex flex-col items-center space-y-4 text-black"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prefLang"
            render={({ field }) => (
              <FormItem className="w-full">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Preferred Language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button
            className="w-full hover:bg-slate-900 bg-gray-700"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default JoinPage;
