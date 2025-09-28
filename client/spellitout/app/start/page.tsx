"use client";

import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const StartPage = () => {
  const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      localStorage.clear();
      const { password } = data;
      localStorage.setItem("password", password);
      const resp = await axios.post(`${base_url}/start`, {
        password: password,
      });
      router.push("/join");

      // form.reset();
    } catch (err: any) {
      console.log(err);
      const outp = err?.response?.data?.message;
      if (outp == "Meeting already running") {
        router.push("/join");
        return;
      }
      toast({
        title: "Uh oh! Something went wrong.",
        description: outp ?? "Enter correct password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-gray-900 to-black text-white flex items-center justify-center flex-col gap-y-4 mx-auto  px-4 md:px-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 font-bold mb-8 text-center">
        Please Enter your password below
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-lg flex flex-col items-center space-y-4 text-black"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Password"
                    className="border-4 border-red-800"
                    type="password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full hover:bg-slate-900 bg-gray-700"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default StartPage;
