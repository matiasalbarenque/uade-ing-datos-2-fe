import { useState } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { APP, ENV } from '@constants';
import { useAuth } from '@hooks/use-auth';
import { useGetSkills } from '@hooks/use-skills';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Button } from 'antd';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { ofetch } from 'ofetch';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export const AdminProfileListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: skills } = useGetSkills();

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedHours, setSelectedHours] = useState(0);

  const cookie = Cookies.get(APP.ACCESS_TOKEN_NAME);
  const { user_id } = jwtDecode(cookie);

  const { isLoading: isLoadingProfile } = useSWR(`${ENV.API_URL}/profiles/${user_id}`, ofetch, {
    onSuccess([profile] = []) {
      setSelectedHours(profile.availability);
    },
  });

  const { isLoading: isLoadingSkills } = useSWR(`${ENV.API_URL}/profiles/${user_id}/skills`, ofetch, {
    onSuccess(skills = []) {
      setSelectedSkills(skills.map((s) => s.skill_id));
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    `${ENV.API_URL}/profiles`,
    (key, { arg }) => {
      arg.preventDefault();
      return Promise.all([
        ofetch(key, {
          method: 'PUT',
          body: {
            ...user,
            user_id,
            user_name: user.firstName + user.lastName,
            description: '',
            availability: selectedHours,
          },
        }),
        ...selectedSkills.map((skill_id) => {
          return ofetch(`${ENV.API_URL}/profiles/${user_id}/skills`, {
            method: 'POST',
            params: { user_id },
            body: { related_to: skill_id },
          });
        }),
      ]);
    },
    {
      onSuccess: () => navigate('/admin'),
      onError: (e) => {
        console.error(e);
        return alert('Error al guardar los datos');
      },
    },
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 flex gap-7">
        <div className="flex-shrink-0 w-[280px]">
          <div className="w-full rounded-full overflow-hidden border-8 border-white shadow-md object-cover">
            <img
              src={user.avatarUrl || '/avatars/no-avatar.jpg'}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full"
            />
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
      <form onSubmit={(e) => trigger(e)} className="flex flex-col gap-5">
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-4">
            <div>
              <Select
                selectionMode="multiple"
                variant="bordered"
                labelPlacement="outside"
                name="skills_ids"
                label="Habilidades"
                disabled={isLoadingSkills}
                placeholder="Selecciona las habilidades"
                selectedKeys={selectedSkills}
                onSelectionChange={(keys) => {
                  return setSelectedSkills(Array.from(keys));
                }}
                disallowEmptySelection
                isLoading={!skills.length}
              >
                {skills?.map((skill) => (
                  <SelectItem key={skill.skill_id}>{skill.description}</SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Input
                label="Disponibilidad semanal (hs)"
                placeholder="horas"
                type="number"
                value={selectedHours}
                onChange={(e) => setSelectedHours(e.target.value)}
                variant="bordered"
                labelPlacement="outside"
                disabled={isLoadingProfile}
                required
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button icon={<SaveOutlined />} htmlType="submit" size="large" type="primary" disabled={isMutating}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
