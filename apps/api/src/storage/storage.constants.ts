export const StorageBucket = {
  Public: 'public',
  Private: 'private',
} as const;

export type StorageBucket = (typeof StorageBucket)[keyof typeof StorageBucket];
