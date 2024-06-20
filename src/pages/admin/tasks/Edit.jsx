import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Avatar, Button, Table, Tag } from 'antd';
import { ClockCircleOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Input } from '@atoms/Input';
import { Select } from '@atoms/Select';
import { TextArea } from '@atoms/Textarea';
import { useGetSkills } from '@hooks/use-skills';
import { useGetProfiles } from '@hooks/use-profiles';
import { getTask } from '@services/tasks';
import { formatDate } from '@assets/scripts/helpers';

export const AdminTasksEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data: skills, isLoading: isLoadingSkills } = useGetSkills();
  const { data: profiles, isLoading: isLoadingProfiles } = useGetProfiles();
  const [tableItems, setTableItems] = useState([]);

  const { control, formState, handleSubmit, reset, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: null,
      title: '',
      hours: 1,
      description: '',
      employee_ids: [],
      skills_ids: [],
    },
    shouldUnregister: true,
  });

  const isFormValid = Object.keys(formState.errors).length === 0;

  useEffect(() => {
    if (params.id !== 'new') {
      getTaskData();
    }
  }, []);

  const getTaskData = async () => {
    try {
      const data = await getTask(params.id);
      if (data) {
        reset({
          id: data.id,
          title: data.title,
          hours: data.hours,
          description: data.description,
          employee_ids: data.employee_ids,
          skills_ids: data.skills_ids,
        });
      }
    } catch {
      // TODO: Tratar el error con una alerta
    }
  };

  const employees = [
    {
      id: 1,
      firstname: 'Alfredo',
      lastname: 'Euler',
      profile_id: 1,
      skills_id: [1, 4],
      avatar_url: '/avatars/avatar4.jpg',
    },
    {
      id: 2,
      firstname: 'Sofia',
      lastname: 'Legan',
      profile_id: 2,
      skills_id: [2, 3],
      avatar_url: '/avatars/avatar3.jpg',
    },
    {
      id: 3,
      firstname: 'Jose',
      lastname: 'Pitarch',
      profile_id: 3,
      skills_id: [3, 4],
      avatar_url: '/avatars/avatar5.jpg',
    },
    {
      id: 4,
      firstname: 'Marta',
      lastname: 'Fernández',
      profile_id: 4,
      skills_id: [1, 2],
      avatar_url: '/avatars/avatar2.jpg',
    },
  ];

  useEffect(() => {
    if (!isLoadingSkills && !isLoadingProfiles && Array.isArray(watch('employee_ids'))) {
      const items = employees
        .filter((a) => watch('employee_ids').includes(a.id))
        .map((b) => ({
          ...b,
          profile: profiles.find((a) => a.id === b.id).name,
          skills: skills
            .filter((c) => b.skills_id.includes(c.id))
            .map((d) => (
              <Tag key={d.id} color="blue">
                {d.name}
              </Tag>
            )),
          key: b.id,
        }));
      setTableItems(items);
    }
  }, [isLoadingSkills, isLoadingProfiles, watch('employee_ids')]);

  const columns = [
    {
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      width: '10%',
      align: 'center',
      render: (avatar_url, { key }) => (
        <Avatar size={40} key={key} src={<img src={avatar_url || '/avatars/no-avatar.jpg'} />} />
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'firstname',
      key: 'firstname',
    },
    {
      title: 'Apellido',
      dataIndex: 'lastname',
      key: 'lastname',
    },
    {
      title: 'Perfil',
      dataIndex: 'profile',
      key: 'profile',
    },
    {
      title: 'Habilidades',
      dataIndex: 'skills',
      key: 'skills',
    },
  ];

  const onSubmit = async ({ id, ...formData }) => {
    const submitData = {
      id,
      ...formData,
      deadline: formatDate(new Date(formData.deadline), 'yyyy-MM-dd'),
    };
    console.log(submitData);
    // try {
    //   if (params.id === 'new') {
    //     postTask(formData);
    //   } else {
    //     putTask({ id, ...formData });
    //   }
    //   navigate('/admin/tasks');
    // } catch {
    //   // TODO: tratar el error de guardado
    // }
  };

  return (
    <div>
      <h1 className="font-light text-4xl tracking-wide leading-relaxed">
        {params.id === 'new' ? 'Creación de la tarea' : 'Edición de la tarea'}
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
                placeholder="Título de la tarea"
                prefix={<EditOutlined />}
                rules={{ required: true }}
                size="large"
              />
            </div>
            <div>
              <Input
                control={control}
                id="hours-id"
                name="hours"
                label="Horas"
                placeholder="Horas de la tarea"
                prefix={<ClockCircleOutlined />}
                rules={{ required: true }}
                size="large"
                type="number"
                min={1}
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
            placeholder="Descripción de la tarea..."
            rules={{ required: true }}
            size="large"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <Select
              control={control}
              mode="multiple"
              showSearch={false}
              id="skills-ids"
              name="skills_ids"
              label="Habilidades requeridas:"
              size="large"
              placeholder="Seleccionar habilidad"
              rules={{ required: true }}
              className="w-full"
              options={skills.map((a) => ({ value: a.id, label: a.description }))}
            />
          </div>
          <div>
            <Select
              control={control}
              mode="multiple"
              showSearch={false}
              id="employee-ids"
              name="employee_ids"
              label="Asignación de empleados:"
              size="large"
              placeholder="Seleccionar empleado"
              rules={{ required: true }}
              className="w-full"
              options={employees.map((a) => ({ value: a.id, label: <span>{`${a.firstname} ${a.lastname}`}</span> }))}
              disabled={watch('skills_ids')?.length === 0}
            />
          </div>
        </div>
        {watch('employee_ids')?.length > 0 && (
          <div>
            <Table
              columns={columns}
              dataSource={tableItems}
              pagination={false}
              className="border border-[#ddd] rounded-md bg-white"
            />
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
