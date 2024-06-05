import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal, Table } from 'antd';
import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { getProjects, deleteProject } from '@services/projects';

export const AdminProjectsListPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const idSelected = useRef('');

  useEffect(() => {
    getProjectsData();
  }, []);

  const getProjectsData = async () => {
    try {
      // const data = await getProjects();
      const data = [
        {
          id: 1,
          number_devs: 1,
          number_tasks: 2,
          title: 'Desarrollar UI - Home',
        },
        {
          id: 2,
          number_devs: 2,
          number_tasks: 4,
          title: 'Desarrollar FE - Home',
        },
        {
          id: 3,
          number_devs: 3,
          number_tasks: 6,
          title: 'Implementar endpoints de novedades - BE',
        },
      ];
      setProjects(data);
    } catch {
      // TODO: Tratar el error con una alerta
    }
  };

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
    getProjectsData();
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
      render: (text, { key }) => <Link to={`/admin/projects/${key}`}>{text}</Link>,
    },
    {
      title: 'Cantidad de tareas',
      dataIndex: 'number_tasks',
      key: 'number_tasks',
    },
    {
      title: 'Cantidad de recursos asignados',
      dataIndex: 'number_devs',
      key: 'number_devs',
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      width: 150,
      align: 'center',
    },
  ];

  const tableItems = projects.map((a) => ({
    key: a.id,
    number_devs: a.number_devs,
    number_tasks: a.number_tasks,
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
      <h1 className="font-light text-4xl tracking-wide leading-relaxed">Listado de Proyectos</h1>
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
