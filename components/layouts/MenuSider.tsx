import { Layout, Menu } from "antd";
import React from "react";
import {
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {};

const { Sider } = Layout;

const MenuSider: React.FC<Props> = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => {
    return router.pathname === pathname;
  };

  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
    >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        selectedKeys={[router.pathname]}
      >
        <Menu.Item key="/" icon={<AppstoreOutlined />} active={true}>
          <Link href="/">Lịch trình</Link>
        </Menu.Item>
        <Menu.Item key="/classes" icon={<TeamOutlined />}>
          <Link href="/classes">Danh sách lớp học</Link>
        </Menu.Item>
        <Menu.Item key="/students" icon={<UserOutlined />}>
          <Link href="/students">Danh sách học sinh</Link>
        </Menu.Item>
        <Menu.Item key="/achievements" icon={<VideoCameraOutlined />}>
          <Link href="/achievements">Bảng thành tích</Link>
        </Menu.Item>
        <Menu.Item key="/assignments" icon={<UploadOutlined />}>
          <Link href="/assignments">Danh sách bài tập</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default MenuSider;
