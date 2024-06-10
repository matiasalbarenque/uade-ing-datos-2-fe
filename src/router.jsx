import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import AdminLayout from './components/layouts/admin/Layout';
import MainLayout from './components/layouts/main/Layout';
import { AdminDashboardPage } from './pages/admin/Dashboard';
import { AdminProjectsEditPage } from './pages/admin/projects/Edit';
import { AdminProjectsListPage } from './pages/admin/projects/List';
import { AdminTasksEditPage } from './pages/admin/tasks/Edit';
import { AdminTasksListPage } from './pages/admin/tasks/List';
import { AdminProfileListPage } from './pages/admin/profile/Edit';
import { HomePage } from './pages/Home';
import { LoginPage } from './pages/Login';
import { RecoverPage } from './pages/Recover';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RecoverPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="profile" element={<AdminProfileListPage />} />
        <Route path="projects/:id" element={<AdminProjectsEditPage />} />
        <Route path="projects" element={<AdminProjectsListPage />} />
        <Route path="tasks/:id" element={<AdminTasksEditPage />} />
        <Route path="tasks" element={<AdminTasksListPage />} />
      </Route>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Route>,
  ),
);
