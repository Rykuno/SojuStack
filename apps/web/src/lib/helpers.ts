import { createAvatar } from '@dicebear/core';
import { funEmoji } from '@dicebear/collection';

export function getUserAvatar(
  user: { id: string; image?: string | null },
  options?: Partial<funEmoji.Options>,
) {
  if (user.image) return user.image;
  const avatar = createAvatar(funEmoji, {
    ...options,
    seed: user.id,
  });

  return avatar.toDataUri();
}
