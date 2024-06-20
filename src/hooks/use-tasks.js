import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@services/tasks';

const entity = 'tasks';

export const useGetTasks = () => {
  const query = useQuery({
    queryKey: [entity],
    queryFn: getTasks,
  });
  return {
    ...query,
    data: query.data || [],
  };
};

export const useGetCandidatesTasks = () => {
  const query = useQuery({
    queryKey: [entity, 'candidates'],
    queryFn: getTasks,
  });
  return {
    ...query,
    data: query.data || [],
  };
};
