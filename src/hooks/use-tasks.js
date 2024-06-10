import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@services/tasks';

const entity = 'tasks';

export const useGetTasks = () => {
  return useQuery({
    queryKey: [entity],
    queryFn: getTasks,
    initialData: [],
  });
};
