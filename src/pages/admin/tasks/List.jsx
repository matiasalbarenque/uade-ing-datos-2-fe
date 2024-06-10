import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal, Table } from 'antd';
import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { useGetTasks } from '@hooks/use-tasks';
import { deleteTask } from '@services/tasks';

export const AdminTasksListPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: tasks, refetch } = useGetTasks();
  const idSelected = useRef('');

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
      render: (value, { key }) => <Link to={`/admin/tasks/${key}`}>{value}</Link>,
    },
    {
      title: 'Estimación (Horas)',
      dataIndex: 'hours',
      key: 'hours',
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
    key: a.id,
    title: a.title,
    hours: a.hours,
    actions: (
      <div className="flex justify-center gap-2">
        <Button type="primary" size="middle" icon={<EditFilled />} onClick={() => handleEdit(a.id)} />
        <Button type="primary" size="middle" icon={<DeleteFilled />} danger onClick={() => handleDelete(a.id)} />
      </div>
    ),
  }));

  return (
    <div>
      <h1 className="font-light text-4xl tracking-wide leading-relaxed">Listado de Tareas</h1>
      <Button type="primary" icon={<PlusOutlined />} size="large" className="mt-4" onClick={newHandler}>
        Nuevo
      </Button>
      <Table columns={columns} dataSource={tableItems} className="mt-6 border border-[#ddd] rounded-md bg-white" />
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
