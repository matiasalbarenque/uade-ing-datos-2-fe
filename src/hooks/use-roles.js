import { useQuery } from '@tanstack/react-query';
import { getRoles } from '@services/roles';

const entity = 'roles';

export const useGetRoles = () => {
  return useQuery({
    queryKey: [entity],
    queryFn: getRoles,
    initialData: [],
    refetchOnMount: ({ state }) => {
      const refetch = state.data.length === 0;
      return refetch ? 'always' : false;
    },
    staleTime: 60 * 1000,
  });
};
