import { Avatar, Layout, Menu } from "antd";
import React from "react";

type Props = {};

const { Header } = Layout;

const MenuHeader: React.FC<Props> = () => (
  <Header
    className="site-layout-background"
    style={{
      zIndex: 1,
      width: "100%",
    }}
  >
    <Menu mode="horizontal" style={{ lineHeight: "64px" }}>
      <Menu.Item
        style={{
          float: "right",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "64px",
        }}
      >
        <a>
          <Avatar />
        </a>
      </Menu.Item>
    </Menu>
  </Header>
);

export default MenuHeader;
