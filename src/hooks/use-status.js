import { useQuery } from '@tanstack/react-query';
import { getStatus } from '@services/status';

const entity = 'status';

export const useGetStatus = () => {
  return useQuery({
    queryKey: [entity],
    queryFn: getStatus,
    initialData: [],
    refetchOnMount: ({ state }) => {
      const refetch = state.data.length === 0;
      return refetch ? 'always' : false;
    },
    staleTime: 60 * 1000,
  });
};
