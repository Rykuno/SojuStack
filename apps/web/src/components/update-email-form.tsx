"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form";
import { authApi, ChangeEmailData } from "~/utils/auth";

const changeEmailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password is required")
});

type UpdateEmailFormProps = {
  currentEmail: string;
  emailVerified: boolean;
};

export function UpdateEmailForm({
  currentEmail,
  emailVerified
}: UpdateEmailFormProps) {
  const queryClient = useQueryClient();

  const changeEmailMutation = useMutation({
    mutationFn: (data: ChangeEmailData) => authApi.changeEmail(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      form.reset();
      toast.success(
        "Email updated successfully! Please check your email for verification."
      );
    },
    onError: error => {
      toast.error(error.message || "Failed to update email");
    }
  });

  const verifyEmailMutation = useMutation({
    mutationFn: () => authApi.sendVerificationEmail(currentEmail),
    onSuccess: () => {
      toast.success("Verification email sent! Please check your inbox.");
    },
    onError: error => {
      toast.error(error.message || "Failed to send verification email");
    }
  });

  const form = useForm<z.infer<typeof changeEmailSchema>>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
      password: ""
    }
  });

  const onSubmit = (data: z.infer<typeof changeEmailSchema>) => {
    changeEmailMutation.mutate(data);
  };

  const onSendVerificationEmail = () => {
    verifyEmailMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          Manage your email address and verification status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Current Email</p>
            <p className="text-sm text-muted-foreground">{currentEmail}</p>
          </div>
          <div className="flex items-center gap-2">
            {!emailVerified && (
              <Button
                variant="outline"
                onClick={onSendVerificationEmail}
                disabled={verifyEmailMutation.isPending}
              >
                {verifyEmailMutation.isPending ? "Sending..." : "Verify Email"}
              </Button>
            )}
          </div>
        </div>

        <Form {...form}>
          <FormField
            control={form.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter new email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => form.handleSubmit(onSubmit)}
          loading={changeEmailMutation.isPending}
        >
          Update Email
        </Button>
      </CardFooter>
    </Card>
  );
}
