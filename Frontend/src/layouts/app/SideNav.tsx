import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, Layout, Menu, MenuProps, SiderProps } from 'antd';
import {
  BarChartOutlined,
  BranchesOutlined,
  DropboxOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Logo } from '../../components';
import { Link, useLocation } from 'react-router-dom';
import { PATH_LANDING } from '../../constants';
import { COLOR } from '../../App.tsx';
import { PATH_DASHBOARD } from '../../constants/routes.ts';
import { useMediaQuery } from 'react-responsive';
import GetGUID from '../../services/GUIDService.ts';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const items: MenuProps['items'] = [
  getItem(
    <Link to={PATH_DASHBOARD.default}>Dashboard</Link>,
    '/dashboards/default',
    <PieChartOutlined />
  ),

  getItem('New sale', 'Newsale', <BarChartOutlined />, [
    // getItem(<Link to="/Newsale/List">List</Link>, 'List', null),
    getItem(<Link to={`/Newsale/New`}>Retail</Link>, '/Newsale/New', null),
    getItem(
      <Link to={`/WholeSale/New`}>Whole Sale</Link>,
      '/WholeSale/New',
      null
    ),
  ]),

  getItem('Products', 'Products', <DropboxOutlined />, [
    getItem(<Link to="/Products/List">List</Link>, '/Products/List', null),
    getItem(<Link to={`/Products/New`}>New</Link>, '/Products/New', null),
  ]),

  getItem('Users', 'Users', <PieChartOutlined />, [
    getItem(<Link to="/User/List">List</Link>, '/User/List', null),
    getItem(<Link to="/User/New">New</Link>, '/User/New', null),
  ]),

  getItem(
    <Link to={'/Timeline/Detail'}>Timeline</Link>,
    '/Timeline/Detail',
    <BranchesOutlined />
  ),

  getItem(
    <Link to={'/Test/New'}>Test</Link>,
    '/Test/New',
    <BranchesOutlined />
  ),
];

const rootSubmenuKeys = [
  '',
  // 'dashboards',
  // 'corporate',
  // 'user-profile',
  // 'Users',
  // 'Newsale',
];

type SideNavProps = SiderProps & {
  setCollapse: (value: React.SetStateAction<boolean>) => void;
};

const SideNav = ({ setCollapse, ...others }: SideNavProps) => {
  const nodeRef = useRef(null);
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState(['']);
  const [current, setCurrent] = useState('');
  const isMobile = useMediaQuery({ maxWidth: 769 });

  const onClick: MenuProps['onClick'] = (e) => {
    if (isMobile) {
      setCollapse(true);
    }
  };

  const onOpenChange: MenuProps['onOpenChange'] = (keys: any) => {
    const latestOpenKey = keys.find((key: any) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  useEffect(() => {
    if (pathname.includes('Edit')) {
      const basePath = pathname.split('/').slice(0, 3).join('/');
      setCurrent(basePath);
    } else {
      setCurrent(pathname);
    }
  }, [pathname]);

  return (
    <Sider ref={nodeRef} breakpoint="lg" collapsedWidth="0" {...others}>
      <Logo
        color="blue"
        asLink
        href={PATH_LANDING.root}
        justify="center"
        gap="small"
        imgSize={{ h: 28, w: 28 }}
        style={{ padding: '1rem 0' }}
      />
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBg: 'none',
              itemSelectedBg: COLOR['100'],
              itemHoverBg: COLOR['50'],
              itemSelectedColor: COLOR['600'],
            },
          },
        }}
      >
        <Menu
          mode="inline"
          items={items}
          onClick={onClick}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={[current]}
          style={{ border: 'none' }}
        />
      </ConfigProvider>
    </Sider>
  );
};

export default SideNav;
