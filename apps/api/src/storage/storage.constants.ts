export const StorageBucket = {
  Public: 'public',
  Private: 'private',
} as const;

export type StorageBucketType = (typeof StorageBucket)[keyof typeof StorageBucket];
