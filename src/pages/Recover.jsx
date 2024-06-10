import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'antd';
import { MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { Input } from '@atoms/Input';

export const RecoverPage = () => {
  const [hasRecoverError, setHasRecoverError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
    shouldUnregister: true,
  });

  const isFormValid = Object.keys(formState.errors).length === 0;

  const onSubmit = async (formData) => {
    setHasRecoverError(false);
    setIsLoading(true);
    try {
      //await signup(formData);
      //navigate('/login');
    } catch {
      setHasRecoverError(true);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-dvh flex justify-center items-center bg-pattern">
      <div className="p-6 py-8 w-full max-w-sm bg-white rounded-lg border border-gray-300">
        <div className="flex flex-col gap-6">
          <div className="w-full flex justify-center">
            <Link to="/">
              <img src="/icon.svg" alt="Logo" width="64" height="64" />
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-2xl mb-2">Recuperar cuenta</h1>
            <h2 className="text-sm text-gray-500">
              Ingresá tu correo electrónico para que un administrador te ayude con el proceso de recuperación de la
              cuenta.
            </h2>
          </div>
          <RecoverForm
            control={control}
            handleSubmit={handleSubmit}
            isFormValid={isFormValid}
            isLoading={isLoading}
            onSubmit={onSubmit}
            setHasRecoverError={hasRecoverError}
          />
        </div>
      </div>
    </main>
  );
};

const RecoverForm = (props) => {
  const { control, handleSubmit, isFormValid, isLoading, onSubmit, setHasRecoverError } = props;
  const navigate = useNavigate();

  const loginHandler = () => {
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        control={control}
        id="email-id"
        name="email"
        label="Correo electrónico"
        placeholder="Correo electrónico"
        prefix={<MailOutlined />}
        rules={{ required: true }}
        size="large"
        type="email"
        disabled={isLoading}
      />
      {setHasRecoverError && (
        <Alert
          type="error"
          description="Ha sucedido un error. Verifique el email ingresado e intente nuevamente."
          showIcon
        />
      )}
      <div className="flex gap-4 mt-1">
        <Button
          shape="default"
          size="large"
          type="default"
          onClick={loginHandler}
          className="w-full !h-14"
          disabled={isLoading}
        >
          Ir al login
        </Button>
        <Button
          disabled={!isFormValid || isLoading}
          htmlType="submit"
          icon={<UserAddOutlined />}
          shape="default"
          size="large"
          type="primary"
          className="w-full !h-14"
          loading={isLoading}
        >
          Recuperar
        </Button>
      </div>
    </form>
  );
};
