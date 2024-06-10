import { useQuery } from '@tanstack/react-query';
import { getProfiles } from '@services/profiles';

const entity = 'profiles';

export const useGetProfiles = () => {
  return useQuery({
    queryKey: [entity],
    queryFn: getProfiles,
    initialData: [],
  });
};
