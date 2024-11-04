// src/components/MobileNav.tsx
import React, { useState } from 'react';
import { Button, Drawer, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

interface MobileNavProps {
  items: {
    path: string;
    label: string;
  }[];
  currentPath: string;
}

const MobileNav = ({ items, currentPath }: MobileNavProps) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button type="text" icon={<MenuOutlined />} onClick={showDrawer} className="flex items-center" />
      <Drawer title="Menu" placement="right" onClose={onClose} open={open} bodyStyle={{ padding: 0 }} width={250}>
        <Menu
          mode="inline"
          selectedKeys={[currentPath]}
          items={items.map((item) => ({
            key: item.path,
            label: (
              <a href={item.path} onClick={onClose}>
                {item.label}
              </a>
            ),
          }))}
        />
      </Drawer>
    </div>
  );
};

export default MobileNav;
