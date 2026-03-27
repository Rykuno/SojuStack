import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { queryClient, api } = await parent();
  await queryClient.prefetchQuery(api.todos.findMany());
};
