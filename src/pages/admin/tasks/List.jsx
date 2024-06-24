import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { ENV } from '@constants';
import { useGetTasks } from '@hooks/use-tasks';
import { deleteTask } from '@services/tasks';
import { Button, Modal, Table } from 'antd';
import { ofetch } from 'ofetch';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

export const AdminTasksListPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: tasks, isLoading, refetch } = useGetTasks();
  const idSelected = useRef('');

  const { trigger: remove } = useSWRMutation(
    `${ENV.API_URL}/tasks/`,
    (key, { arg: id }) => {
      if (!confirm('¿Está seguro de eliminar la tarea?')) return;
      ofetch(key + id, {
        method: 'DELETE',
        params: { task_id: id },
      });
    },
    {
      onSuccess: () => refetch(),
      onError(e) {
        console.error(e);
        alert('Error al eliminar la tarea');
      },
    },
  );

  const newHandler = () => {
    navigate('/admin/tasks/new');
  };

  const handleEdit = (id) => {
    navigate(`/admin/tasks/${id}`);
  };

  const handleDelete = (id) => {
    idSelected.current = id;
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    await deleteTask(idSelected.current);
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
    },
    {
      title: 'Estimación (Horas)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      width: 150,
      align: 'center',
    },
  ];

  const tableItems = tasks.map((a) => ({
    key: a.task_id,
    title: a.title,
    duration: a.duration,
    status: a.status,
    actions: (
      <div className="flex justify-center gap-2">
        <Button type="primary" size="middle" icon={<EditFilled />} onClick={() => handleEdit(a.task_id)} />
        <Button type="primary" size="middle" icon={<DeleteFilled />} danger onClick={() => remove(a.task_id)} />
      </div>
    ),
  }));

  return (
    <div>
      <h1 className="font-light text-4xl tracking-wide leading-relaxed">Listado de Tareas</h1>
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
