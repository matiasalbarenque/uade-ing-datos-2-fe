import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { formatDate } from '@assets/scripts';
import { ENV } from '@constants';
import { useGetProjects } from '@hooks/use-projects';
import { deleteProject } from '@services/projects';
import { Button, Modal, Table } from 'antd';
import { ofetch } from 'ofetch';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

export const AdminProjectsListPage = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading, refetch } = useGetProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const idSelected = useRef('');

  const { trigger: remove } = useSWRMutation(
    `${ENV.API_URL}/projects/`,
    (key, { arg: id }) => {
      if (!confirm('¿Está seguro de eliminar el proyecto?')) return;
      ofetch(key + id, {
        method: 'DELETE',
        params: { project_id: id },
      });
    },
    {
      onSuccess: () => refetch(),
      onError(e) {
        console.error(e);
        alert('Error al eliminar el proyecto');
      },
    },
  );

  const newHandler = () => {
    navigate('/admin/projects/new');
  };

  const handleEdit = (id) => {
    navigate(`/admin/projects/${id}`);
  };

  const handleDelete = (id) => {
    idSelected.current = id;
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    await deleteProject(idSelected.current);
    closeModal();
    refetch();
  };

  const handleModalCancel = () => {
    closeModal();
  };

  const closeModal = () => {
    idSelected.current = null;
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      render: (value, { key }) => {
        return <Link to={`/admin/projects/${key}`}>{value}</Link>;
      },
    },
    {
      title: 'Fecha de entrega',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (value) => formatDate(value),
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      width: 150,
      align: 'center',
    },
  ];

  const tableItems = projects.map((a) => {
    return {
      key: a.project_id,
      title: a.title,
      description: a.description,
      due_date: a.due_date,
      actions: (
        <div className="flex justify-center gap-2">
          <Button type="primary" size="middle" icon={<EditFilled />} onClick={() => handleEdit(a.project_id)} />
          <Button type="primary" size="middle" icon={<DeleteFilled />} danger onClick={() => remove(a.project_id)} />
        </div>
      ),
    };
  });

  return (
    <div>
      <h1 className="font-light text-4xl tracking-wide leading-relaxed">Listado de Proyectos</h1>
      <Button type="primary" icon={<PlusOutlined />} size="large" className="mt-4" onClick={newHandler}>
        Nuevo
      </Button>
      <Table
        columns={columns}
        dataSource={tableItems}
        loading={isLoading}
        className="mt-6 border border-[#ddd] rounded-md bg-white"
      />
      <Modal
        title="Confirmar eliminación"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Eliminar"
        cancelText="Cancelar"
      >
        <p>Está a punto de eliminar el registro seleccionado. ¿Desea continuar?</p>
      </Modal>
    </div>
  );
};
