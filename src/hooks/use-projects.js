import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@services/projects';

const entity = 'projects';

export const useGetProjects = () => {
  const query = useQuery({
    queryKey: [entity],
    queryFn: getProjects,
  });
  return {
    ...query,
    data: query.data || [],
  }
};
