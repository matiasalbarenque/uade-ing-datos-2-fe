import { useQuery } from '@tanstack/react-query';
import { getSkills } from '@services/skills';

const entity = 'skills';

export const useGetSkills = () => {
  return useQuery({
    queryKey: [entity],
    queryFn: getSkills,
    initialData: [],
    refetchOnMount: ({ state }) => {
      const refetch = state.data.length === 0;
      return refetch ? 'always' : false;
    },
    staleTime: 60 * 1000,
  });
};
