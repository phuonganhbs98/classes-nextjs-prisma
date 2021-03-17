import { Layout, Menu } from "antd";
import React from "react";
import {
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

type Props = {};

const { Sider } = Layout;

const MenuSider: React.FC<Props> = () => (
  <Sider
    style={{
      overflow: "auto",
      height: "100vh",
      position: "fixed",
      left: 0,
    }}
  >
    <div className="logo" />
    <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
      <Menu.Item key="6" icon={<AppstoreOutlined />}>
        Lịch trình
      </Menu.Item>
      <Menu.Item key="7" icon={<TeamOutlined />}>
        Danh sách lớp học
      </Menu.Item>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Danh sách học sinh
      </Menu.Item>
      <Menu.Item key="2" icon={<VideoCameraOutlined />}>
        Bảng thành tích
      </Menu.Item>
      <Menu.Item key="3" icon={<UploadOutlined />}>
        Danh sách bài tập
      </Menu.Item>
    </Menu>
  </Sider>
);

export default MenuSider;
