import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";
import { fetchClient } from "~/lib/api";

export class UsersAPI {
  queryKey = "users";

  getDefaultAvatar(userId: string) {
    return createAvatar(funEmoji, {
      seed: userId
    });
  }

  updateImage({ image, name }: { image: File; name: string }) {
    return fetchClient().PATCH("/users/me", {
      body: {
        image: image,
        name
      },
      bodySerializer: body => {
        const formData = new FormData();
        formData.set("image", body.image as Blob);
        formData.set("name", body.name ?? "");
        return formData;
      }
    });
  }
}

export const usersApi = new UsersAPI();
