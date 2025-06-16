import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, LayoutOptimized } from '@/components/layout';
import { RouteConfig } from '../types';

interface RouteLayoutProps {
  layout?: RouteConfig['layout'];
  children?: React.ReactNode;
}

export const RouteLayout: React.FC<RouteLayoutProps> = ({ 
  layout = 'default',
  children 
}) => {
  const content = children || <Outlet />;

  switch (layout) {
    case 'blank':
      return <>{content}</>;
      
    case 'fullscreen':
      return (
        <div className="min-h-screen bg-gray-900">
          {content}
        </div>
      );
      
    case 'minimal':
      return (
        <div className="min-h-screen bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            {content}
          </div>
        </div>
      );
      
    case 'default':
    default:
      return (
        <LayoutOptimized>
          {content}
        </LayoutOptimized>
      );
  }
};