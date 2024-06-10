import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@services/projects';

const entity = 'projects';

export const useGetProjects = () => {
  return useQuery({
    queryKey: [entity],
    queryFn: getProjects,
    initialData: [],
  });
};
