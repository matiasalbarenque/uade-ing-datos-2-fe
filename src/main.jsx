import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { HappyProvider } from '@ant-design/happy-work-theme';
import { router } from './router.jsx';
import AuthProvider from './providers/auth.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#15a4db',
          borderRadius: 5,
        },
      }}
    >
      <StyleProvider hashPriority="high">
        <HappyProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </HappyProvider>
      </StyleProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
