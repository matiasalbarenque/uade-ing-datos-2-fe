import { SaveOutlined } from '@ant-design/icons';
import { formatDate } from '@assets/scripts/helpers';
// import { Input } from '@atoms/Input';
import { ENV } from '@constants';
import { Input, Textarea } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { getTask } from '@services/tasks';
import { Avatar, Button, Table } from 'antd';
import { nanoid } from 'nanoid';
import { ofetch } from 'ofetch';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export const AdminTasksEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  // const { data: skills, isLoading: isLoadingSkills } = useGetSkills();
  // const { data: profiles, isLoading: isLoadingProfiles } = useGetProfiles();
  const [tableItems, setTableItems] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const task = useSWR(params.id === 'new' ? null : `${ENV.API_URL}/tasks/${params.id}`, ofetch, {
    onSuccess([task] = []) {
      if (!task) return;
      setTitle(task.title);
      setDescription(task.description);
      setDuration(task.duration);
      // setSelectedSkill(data.skills_ids);
      // setSelectedUsers(data.employee_ids);
    },
  });
  const skills = useSWR(`${ENV.API_URL}/skills`, ofetch);
  const candidates = useSWR(
    selectedSkill.length
      ? `${ENV.API_URL}/tasks/candidates?required_availability=${duration}&skill_id=${selectedSkill}`
      : null,
    ofetch,
  );

  const { trigger, isMutating } = useSWRMutation(
    `${ENV.API_URL}/tasks`,
    async (key, { arg: event }) => {
      event.preventDefault();
      // const project_id = params.id === 'new' ? nanoid() : params.id;
      const task_id = params.id === 'new' ? nanoid() : params.id;
      await ofetch(key, {
        method: 'POST',
        body: {
          task_id,
          title,
          description,
          duration,
          status: 'pending',
        },
      });
      return Promise.all(
        selectedUsers.map((user_id) => {
          return ofetch(`${key}/${task_id}/assign`, {
            method: 'POST',
            body: { related_to: user_id },
            params: { task_id },
          });
        }),
      );
    },
    {
      onSuccess: () => navigate('/admin/tasks'),
      onError: (e) => {
        console.error(e);
        return alert('Error al guardar los datos');
      },
    },
  );

  // const { trigger: delete} = useSWRMutation(
  //   `${ENV.API_URL}/tasks`,
  //   async (key, { arg: event }) => {

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

  // const employees = [
  //   {
  //     id: 1,
  //     firstname: 'Alfredo',
  //     lastname: 'Euler',
  //     profile_id: 1,
  //     skills_id: [1, 4],
  //     avatar_url: '/avatars/avatar4.jpg',
  //   },
  //   {
  //     id: 2,
  //     firstname: 'Sofia',
  //     lastname: 'Legan',
  //     profile_id: 2,
  //     skills_id: [2, 3],
  //     avatar_url: '/avatars/avatar3.jpg',
  //   },
  //   {
  //     id: 3,
  //     firstname: 'Jose',
  //     lastname: 'Pitarch',
  //     profile_id: 3,
  //     skills_id: [3, 4],
  //     avatar_url: '/avatars/avatar5.jpg',
  //   },
  //   {
  //     id: 4,
  //     firstname: 'Marta',
  //     lastname: 'Fernández',
  //     profile_id: 4,
  //     skills_id: [1, 2],
  //     avatar_url: '/avatars/avatar2.jpg',
  //   },
  // ];

  // useEffect(() => {
  //   if (!isLoadingSkills && !isLoadingProfiles && Array.isArray(watch('employee_ids'))) {
  //     const items = employees
  //       .filter((employee) => watch('employee_ids').includes(employee.id))
  //       .map((employee) => ({
  //         ...employee,
  //         profile: profiles.find((a) => a.id === employee.id)?.name,
  //         skills: skills
  //           .filter((skill) => employee.skills_id.includes(skill.skill_id))
  //           .map((skill) => (
  //             <Tag key={skill.skill_id} color="blue">
  //               {skill.name}
  //             </Tag>
  //           )),
  //         key: employee.id,
  //       }));
  //     setTableItems(items);
  //   }
  // }, [isLoadingSkills, isLoadingProfiles, watch('employee_ids')]);

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
                placeholder="Título de la tarea"
                prefix={<EditOutlined />}
                rules={{ required: true }}
                size="large"
              /> */}
              <Input
                label="Título"
                labelPlacement="outside"
                placeholder="Título de la tarea"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isDisabled={task.isLoading}
                variant="bordered"
                required
              />
            </div>
            <div>
              {/* <Input
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
              /> */}
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                isLoading={task.isLoading}
                label="Horas"
                labelPlacement="outside"
                placeholder="Horas de la tarea"
                type="number"
                variant="bordered"
                // isInvalid={requiredAvailability < 1}
                // errorMessage="Debe ingresar un valor mayor a 0"
                required
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
            placeholder="Descripción de la tarea..."
            rules={{ required: true }}
            size="large"
          /> */}
          <Textarea
            label="Descripción"
            labelPlacement="outside"
            placeholder="Descripción de la tarea..."
            className="max-w-prose"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="bordered"
            required
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
          <div>
            <Select
              variant="bordered"
              labelPlacement="outside"
              label="Habilidad requerida"
              placeholder="Selecciona la habilidad"
              isLoading={skills.isLoading}
              selectedKeys={selectedSkill}
              onSelectionChange={(keys) => {
                return setSelectedSkill(Array.from(keys));
              }}
            >
              {skills.data?.map((skill) => (
                <SelectItem key={skill.skill_id}>{skill.description}</SelectItem>
              ))}
            </Select>
            {/* <Select
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
              options={skills.map((a) => ({ value: a.skill_id, label: a.description }))}
            /> */}
          </div>
          <div>
            <Select
              selectionMode="multiple"
              variant="bordered"
              labelPlacement="outside"
              label="Asignación de empleados"
              placeholder={selectedSkill.length ? 'Selecciona los empleados' : 'Debes seleccionar una habilidad'}
              isLoading={candidates.isLoading}
              isInvalid={selectedSkill && !candidates.isLoading && !candidates.data}
              errorMessage="No se han encontrado habilidades"
              disabled={!selectedSkill.length}
              selectedKeys={selectedUsers}
              onSelectionChange={(keys) => {
                return setSelectedUsers(Array.from(keys));
              }}
            >
              {candidates.data?.map((profile) => (
                <SelectItem key={profile.user_id} textValue={profile.user_id}>
                  {profile.user_name} - {profile.availability} hs disponibles
                </SelectItem>
              ))}
            </Select>
            {/* <Select
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
              // options={employees.map((a) => ({ value: a.id, label: <span>{`${a.firstname} ${a.lastname}`}</span> }))}
              disabled={watch('skills_ids')?.length === 0}
            /> */}
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
