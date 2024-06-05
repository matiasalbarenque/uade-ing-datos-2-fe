import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'antd';
import { UserOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';

import { Icon } from '@atoms/Icon';
import { Input } from '@atoms/Input';
import { Select } from '@atoms/Select';
import { getRoles } from '@services/roles';
import { signup } from '@services/auth';

const SignupForm = (props) => {
  const { control, handleSubmit, isFormValid, onSubmit, roles, hasSignupError, watch } = props;
  const navigate = useNavigate();

  const loginHandler = () => {
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        control={control}
        id="first-name-id"
        name="firstname"
        label="Nombre"
        placeholder="Nombre"
        prefix={<UserOutlined />}
        rules={{ required: true }}
        size="large"
      />
      <Input
        control={control}
        id="last-name-id"
        name="lastname"
        label="Apellido"
        placeholder="Apellido"
        prefix={<UserOutlined />}
        rules={{ required: true }}
        size="large"
      />
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
      />
      <Input
        control={control}
        id="password-id"
        name="password"
        label="Contraseña"
        type="password"
        size="large"
        placeholder="Ingrese su contraseña"
        rules={{ required: true }}
        prefix={<Icon icon="material-symbols-light:vpn-key-outline-rounded" />}
      />
      <Input
        control={control}
        id="password-repeat-id"
        name="passwordRepeat"
        label="Contraseña (Repetir)"
        type="password"
        size="large"
        placeholder="Ingrese su contraseña (Repetir)"
        prefix={<Icon icon="material-symbols-light:vpn-key-outline-rounded" />}
        rules={{
          required: true,
          validate: (val) => val === watch('password'),
        }}
      />
      <Select
        control={control}
        id="role-id"
        name="role_id"
        label="Tipo de usuario"
        size="large"
        placeholder="Tipo de usuario"
        rules={{ required: true }}
        options={roles.map((a) => ({ value: a.id, label: <span>{a.description}</span> }))}
      />
      {hasSignupError && (
        <Alert
          type="error"
          description="El usuario ya existe en el sistema. Ingrese un email distinto e intente nuevamente."
          showIcon
        />
      )}
      <div className="flex gap-4">
        <Button shape="default" size="large" type="default" onClick={loginHandler} className="w-full !h-14">
          Ir al login
        </Button>
        <Button
          disabled={!isFormValid}
          htmlType="submit"
          icon={<UserAddOutlined />}
          shape="default"
          size="large"
          type="primary"
          className="w-full !h-14"
        >
          Registrarme
        </Button>
      </div>
    </form>
  );
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [hasSignupError, setHasSignupError] = useState(false);

  const { control, formState, handleSubmit, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      passwordRepeat: '',
      role_id: null,
    },
    shouldUnregister: true,
  });

  const isFormValid = Object.keys(formState.errors).length === 0;

  useEffect(() => {
    getRolesData();
  }, []);

  const getRolesData = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch {
      // TODO: mostrar error de falla al cargar los roles
    }
  };

  const onSubmit = async ({ passwordRepeat, ...rest }) => {
    try {
      await signup(rest);
      navigate('/login');
    } catch {
      setHasSignupError(true);
      return;
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
            <h1 className="text-2xl">Registro de usuario</h1>
          </div>
          <SignupForm
            control={control}
            handleSubmit={handleSubmit}
            isFormValid={isFormValid}
            onSubmit={onSubmit}
            roles={roles}
            hasSignupError={hasSignupError}
            watch={watch}
          />
        </div>
      </div>
    </main>
  );
}
