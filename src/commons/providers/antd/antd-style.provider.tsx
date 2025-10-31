'use client';

import React from 'react';
import { StyleProvider } from '@ant-design/cssinjs';

interface AntdStyleProviderProps {
  children: React.ReactNode;
}

export const AntdStyleProvider: React.FC<AntdStyleProviderProps> = ({ children }) => {
  return (
    <StyleProvider hashPriority="low">
      {children}
    </StyleProvider>
  );
};

export default AntdStyleProvider;


