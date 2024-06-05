import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Input } from '@atoms/Input';
import { TextArea } from '@atoms/Textarea';
import { getProduct, postProject, putProject } from '@services/projects';

export const AdminProjectsEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: null,
      title: '',
      description: '',
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
      const data = await getProduct(params.id);
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
        <div className="mt-4">
          <Button icon={<SaveOutlined />} htmlType="submit" size="large" type="primary" disabled={!isFormValid}>
            {params.id === 'new' ? 'Crear' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
};
