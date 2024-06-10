import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useAuth } from '@hooks/use-auth';
import { useGetSkills } from '@hooks/use-skills';
import { Select } from '@atoms/Select';

export const AdminProfileListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: skills } = useGetSkills();

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      skills_ids: null,
    },
    shouldUnregister: true,
  });

  const isFormValid = Object.keys(formState.errors).length === 0;

  useEffect(() => {
    // getProfileData();
  }, []);

  const getProfileData = async () => {
    try {
      //const data = await getProduct();
      const data = {};
      if (data) {
        reset({
          id: data.id,
          number_devs: data.number_devs,
          number_tasks: data.number_tasks,
          title: data.title,
          description: data.description,
        });
      }
    } catch {
      // TODO: Tratar el error con una alerta
    }
  };

  const onSubmit = async (formData) => {
    try {
      // putProfile(formData);
      navigate('/admin');
    } catch {
      // TODO: tratar el error de guardado
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 flex gap-7">
        <div className="flex-shrink-0 w-[320px]">
          <div className="w-full rounded-full overflow-hidden border-8 border-white shadow-md object-cover">
            <img src={user.avatarUrl || '/avatars/no-avatar.jpg'} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full" />
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 my-8">
          <h1 className="my-2 text-5xl font-semibold">{`${user.firstName} ${user.lastName}`}</h1>
          <span className="text-xl font-semibold">
            Email: <span className="font-normal">{user.email}</span>
          </span>
          <span className="text-xl font-semibold">
            Edad: <span className="font-normal">24 (02/06/2000)</span>
          </span>
          <span className="text-xl font-semibold">
            Perfil: <span className="font-normal">Administrador</span>
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-4">
            <div>
              <Select
                control={control}
                mode="multiple"
                showSearch={false}
                id="skills-ids"
                name="skills_ids"
                label="Habilidades"
                size="large"
                placeholder="Seleccionar habilidades"
                rules={{ required: true }}
                className="w-full"
                options={skills.map((a) => ({ value: a.id, label: a.name }))}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button icon={<SaveOutlined />} htmlType="submit" size="large" type="primary" disabled={!isFormValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
