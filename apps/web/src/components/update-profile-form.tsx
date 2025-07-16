"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
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
import { authApi, UpdateProfileData } from "~/utils/auth";
import { usersApi } from "~/utils/users";
import AvatarUploader from "./avatar-uploader";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.file()
});

type UpdateProfileFormProps = {
  currentName: string;
  currentImage: string | null | undefined;
};

export function UpdateProfileForm({
  currentName,
  currentImage
}: UpdateProfileFormProps) {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      await usersApi.updateImage({
        image: form.getValues("image"),
        name: data.name
      });
      return authApi.updateProfile(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success("Profile updated successfully!");
    },
    onError: error => {
      toast.error(error.message || "Failed to update profile");
    }
  });

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: currentName
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <div className="flex mt-4">
                      <AvatarUploader
                        preview={currentImage}
                        onChange={file => {
                          field.onChange(file);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          loading={updateProfileMutation.isPending}
          onClick={form.handleSubmit(() =>
            updateProfileMutation.mutate(form.getValues())
          )}
        >
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
