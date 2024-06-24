import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
//import { useGetStatus } from '@hooks/use-status';
import { APP, ENV } from '@constants';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '@nextui-org/date-picker';
import { Input, Textarea } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { ofetch } from 'ofetch';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const AdminProjectsEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const cookie = Cookies.get(APP.ACCESS_TOKEN_NAME);
  const { user_id } = jwtDecode(cookie);
  // const { data: tasks, isLoading: isLoadingTasks } = useGetCandidatesTasks();
  //const { data: statusList, isLoading: isLoadingStatus } = useGetStatus();
  // const [tableItems, setTableItems] = useState([]);
  // const [progress, setProgress] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due_date, setDueDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedTasks, setSelectedTasks] = useState([]);

  const { data, isLoading } = useSWR(params.id === 'new' ? null : `${ENV.API_URL}/projects/${params.id}`, ofetch, {
    onSuccess([data] = []) {
      if (!data) return;
      setTitle(data.title);
      setDescription(data.description);
      // setDueDate(data.due_date);
    },
  });

  const { isLoading: tasksLoading } = useSWR(`${ENV.API_URL}/projects/${params.id}/tasks`, ofetch, {
    onSuccess(data) {
      if (!data) return;
      setSelectedTasks(data.map((task) => task.task_id));
    },
  });

  const { data: tasks, isLoading: newTasksLoading } = useSWR(`${ENV.API_URL}/projects/candidatesTasks`, ofetch);

  const { trigger, isMutating } = useSWRMutation(
    `${ENV.API_URL}/projects`,
    async (key, { arg }) => {
      arg.preventDefault();
      const project_id = params.id === 'new' ? nanoid() : params.id;
      await ofetch(key, {
        method: params.id === 'new' ? 'POST' : 'PUT',
        params: {
          user_id: params.id === 'new' ? user_id : undefined,
        },
        body: {
          project_id,
          title,
          description,
          due_date: dayjs(due_date).format('YYYY-MM-DD'),
        },
      });
      return Promise.all(
        selectedTasks.map((task_id) => {
          return ofetch(`${ENV.API_URL}/projects/${project_id}/assign`, {
            method: 'POST',
            body: { related_to: task_id },
            params: { project_id },
          });
        }),
      );
    },
    {
      onSuccess: () => navigate('/admin/projects'),
      onError: (e) => {
        console.error(e);
        return alert('Error al guardar los datos');
      },
    },
  );

  const statusList = [];
  const isLoadingStatus = false;

  const { control, formState, handleSubmit, reset, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      project_id: null,
      title: '',
      description: '',
      due_date: null,
    },
    shouldUnregister: true,
  });

  const isFormValid = Object.keys(formState.errors).length === 0;

  // useEffect(() => {
  //   if (params.id !== 'new') {
  //     getProjectData();
  //   }
  // }, []);

  // const getProjectData = async () => {
  //   try {
  //     const [data] = await getProject(params.id);
  //     if (data) {
  //       reset({
  //         project_id: data.project_id,
  //         title: data.title,
  //         description: data.description,
  //         due_date: dayjs(data.due_date),
  //       });
  //     }
  //   } catch {
  //     // TODO: Tratar el error con una alerta
  //   }
  // };

  // const getStatus = (id) => {
  //   const name = statusList.find((a) => a.task_id === id)?.name;
  //   let taskStatus = 'default';
  //   if (id === STATUS.IN_PROGRESS) {
  //     taskStatus = 'blue';
  //   } else if (id === STATUS.DONE) {
  //     taskStatus = 'success';
  //   }
  //   return (
  //     <Tag key={`tag-${id}`} color={taskStatus}>
  //       {name}
  //     </Tag>
  //   );
  // };

  // useEffect(() => {
  //   if (!isLoadingTasks && !isLoadingStatus && Array.isArray(watch('tasks_ids'))) {
  //     console.log({ tasks, watch: watch('tasks_ids') });
  //     const items = tasks
  //       .filter((a) => watch('tasks_ids').includes(a.task_id))
  //       .map((b) => ({
  //         ...b,
  //         status: getStatus(b.status_id),
  //         key: b.task_id,
  //       }));
  //     setTableItems(items);
  //     // Calculo del progreso
  //     const progressCalc = (items.filter((a) => a.status_id === STATUS.DONE).length * 100) / items.length;
  //     setProgress(Number.parseInt(progressCalc));
  //   }
  // }, [isLoadingTasks, isLoadingStatus, watch('tasks_ids')]);

  // const onSubmit = async ({ id, ...formData }) => {
  //   try {
  //     if (params.id === 'new') {
  //       postProject(formData);
  //     } else {
  //       putProject({ id, ...formData });
  //     }
  //     navigate('/admin/projects');
  //   } catch {
  //     // TODO: tratar el error de guardado
  //   }
  // };

  // const columns = [
  //   {
  //     title: 'Título',
  //     dataIndex: 'title',
  //     key: 'title',
  //   },
  //   {
  //     title: 'Estimación (Horas)',
  //     dataIndex: 'hours',
  //     key: 'hours',
  //   },
  //   {
  //     title: 'Empleados asignados',
  //     dataIndex: 'employees_ids',
  //     key: 'employees_ids',
  //   },
  //   {
  //     title: 'Estado',
  //     dataIndex: 'status',
  //     key: 'status',
  //   },
  // ];

  return (
    <div>
      <h1 className="font-light text-4xl tracking-wide leading-relaxed">
        {params.id === 'new' ? 'Creación del Proyecto' : 'Edición del Proyecto'}
      </h1>
      <form onSubmit={trigger} className="flex flex-col gap-5">
        <div>
          <Input control={control} id="id" name="id" type="hidden" />
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-4">
            <div>
              {/* <Input
                control={control}
                id="title-id"
                name="title"
                label="Título"
                placeholder="Título del proyecto"
                prefix={<EditOutlined />}
                rules={{ required: true }}
                size="large"
              /> */}
              <Input
                label="Título"
                labelPlacement="outside"
                placeholder="Título del proyecto"
                variant="bordered"
                required
                disabled={isLoading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              {/* <DatePicker
                control={control}
                id="deadline-date-id"
                name="due_date"
                label="Fecha de Deadline"
                placeholder="Seleccione la fecha..."
                rules={{ required: true }}
                size="large"
                format={(a) => formatDate(a)}
              /> */}
              <DatePicker
                label="Fecha de Deadline"
                labelPlacement="outside"
                placeholder="Seleccione la fecha..."
                variant="bordered"
                required
                disabled={isLoading}
                value={parseDate(due_date)}
                onChange={(date) => setDueDate(dayjs(date).format('YYYY-MM-DD'))}
              />
            </div>
          </div>
        </div>
        <div>
          {/* <TextArea
            control={control}
            id="description-id"
            name="description"
            label="Descripción"
            placeholder="Descripción del proyecto..."
            rules={{ required: true }}
            size="large"
          /> */}
          <Textarea
            label="Descripción"
            labelPlacement="outside"
            placeholder="Descripción del proyecto..."
            variant="bordered"
            className="max-w-prose"
            required
            disabled={isLoading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          {/* <Select
            control={control}
            mode="multiple"
            showSearch={false}
            id="tasks-ids"
            name="tasks_ids"
            label="Tareas:"
            size="large"
            placeholder="Seleccionar tarea"
            rules={{ required: true }}
            className="w-full"
            options={tasks.map((a) => ({ value: a.task_id, label: `${a.title} - ${a.duration} horas estimadas` }))}
          /> */}
          <Select
            label="Tareas"
            labelPlacement="outside"
            placeholder="Selecciona las tareas"
            className="max-w-prose"
            variant="bordered"
            selectionMode="multiple"
            selectedKeys={selectedTasks}
            onSelectionChange={(keys) => {
              return setSelectedTasks(Array.from(keys));
            }}
            disallowEmptySelection
            isLoading={tasksLoading || newTasksLoading}
            disabled={isLoading || tasksLoading}
          >
            {tasks?.map((task) => (
              <SelectItem key={task.task_id}>{task.title}</SelectItem>
            ))}
          </Select>
        </div>
        {/* {watch('tasks_ids')?.length > 0 && (
          <div className="flex flex-col gap-4">
            <Table
              columns={columns}
              dataSource={tableItems}
              pagination={false}
              className="border border-[#ddd] rounded-md bg-white"
            />
            <ProgressBar label="Progreso del proyecto" percent={progress} />
          </div>
        )} */}
        <div className="mt-4">
          <Button icon={<SaveOutlined />} htmlType="submit" size="large" type="primary" disabled={!isFormValid}>
            {params.id === 'new' ? 'Crear' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
};
