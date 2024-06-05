import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal, Table } from 'antd';
import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { getTasks, deleteTask } from '@services/tasks';

export const AdminTasksListPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const idSelected = useRef('');

  useEffect(() => {
    getTasksData();
  }, []);

  const getTasksData = async () => {
    try {
      // const data = await getTasks();
      const data = [
        {
          id: 1,
          title: 'Diseñar Header de la Web',
        },
        {
          id: 2,
          title: 'Diseñar Footer de la Web',
        },
      ];
      setTasks(data);
    } catch {
      // TODO: Tratar el error con una alerta
    }
  };

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
    getTasksData();
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
      render: (text, { key }) => <Link to={`/admin/tasks/${key}`}>{text}</Link>,
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
