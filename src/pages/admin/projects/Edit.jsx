import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Table, Tag } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Input } from '@atoms/Input';
import { Select } from '@atoms/Select';
import { DatePicker } from '@atoms/DatePicker';
import { TextArea } from '@atoms/Textarea';
import { ProgressBar } from '@atoms/ProgressBar';
import { getProject, postProject, putProject } from '@services/projects';
import { useGetCandidatesTasks } from '@hooks/use-tasks';
//import { useGetStatus } from '@hooks/use-status';
import { formatDate } from '@assets/scripts/helpers';
import { STATUS } from '@assets/constants';

export const AdminProjectsEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data: tasks, isLoading: isLoadingTasks } = useGetCandidatesTasks();
  //const { data: statusList, isLoading: isLoadingStatus } = useGetStatus();
  const [tableItems, setTableItems] = useState([]);
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    if (params.id !== 'new') {
      getProjectData();
    }
  }, []);

  const getProjectData = async () => {
    try {
      const [data] = await getProject(params.id);
      if (data) {
        reset({
          project_id: data.project_id,
          title: data.title,
          description: data.description,
          due_date: dayjs(data.due_date),
        });
      }
    } catch {
      // TODO: Tratar el error con una alerta
    }
  };

  const getStatus = (id) => {
    const name = statusList.find((a) => a.id === id).name;
    let taskStatus = 'default';
    if (id === STATUS.IN_PROGRESS) {
      taskStatus = 'blue';
    } else if (id === STATUS.DONE) {
      taskStatus = 'success';
    }
    return (
      <Tag key={`tag-${id}`} color={taskStatus}>
        {name}
      </Tag>
    );
  };

  useEffect(() => {
    if (!isLoadingTasks && !isLoadingStatus && Array.isArray(watch('tasks_ids'))) {
      const items = tasks
        .filter((a) => watch('tasks_ids').includes(a.id))
        .map((b) => ({
          ...b,
          status: getStatus(b.status_id),
          key: b.id,
        }));
      setTableItems(items);
      // Calculo del progreso
      const progressCalc = (items.filter((a) => a.status_id === STATUS.DONE).length * 100) / items.length;
      setProgress(Number.parseInt(progressCalc));
    }
  }, [isLoadingTasks, isLoadingStatus, watch('tasks_ids')]);

  const onSubmit = async ({ id, ...formData }) => {
    try {
      if (params.id === 'new') {
        postProject(formData);
      } else {
        putProject({ id, ...formData });
      }
      navigate('/admin/projects');
    } catch {
      // TODO: tratar el error de guardado
    }
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Estimación (Horas)',
      dataIndex: 'hours',
      key: 'hours',
    },
    {
      title: 'Empleados asignados',
      dataIndex: 'employees_ids',
      key: 'employees_ids',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div>
      <h1 className="font-light text-4xl tracking-wide leading-relaxed">
        {params.id === 'new' ? 'Creación del Proyecto' : 'Edición del Proyecto'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <Input control={control} id="id" name="id" type="hidden" />
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-4">
            <div>
              <Input
                control={control}
                id="title-id"
                name="title"
                label="Título"
                placeholder="Título del proyecto"
                prefix={<EditOutlined />}
                rules={{ required: true }}
                size="large"
              />
            </div>
            <div>
              <DatePicker
                control={control}
                id="deadline-date-id"
                name="due_date"
                label="Fecha de Deadline"
                placeholder="Seleccione la fecha..."
                rules={{ required: true }}
                size="large"
                format={(a) => formatDate(a)}
              />
            </div>
          </div>
        </div>
        <div>
          <TextArea
            control={control}
            id="description-id"
            name="description"
            label="Descripción"
            placeholder="Descripción del proyecto..."
            rules={{ required: true }}
            size="large"
          />
        </div>
        <div>
          <Select
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
          />
        </div>
        {watch('tasks_ids')?.length > 0 && (
          <div className="flex flex-col gap-4">
            <Table
              columns={columns}
              dataSource={tableItems}
              pagination={false}
              className="border border-[#ddd] rounded-md bg-white"
            />
            <ProgressBar label="Progreso del proyecto" percent={progress} />
          </div>
        )}
        <div className="mt-4">
          <Button icon={<SaveOutlined />} htmlType="submit" size="large" type="primary" disabled={!isFormValid}>
            {params.id === 'new' ? 'Crear' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
};
