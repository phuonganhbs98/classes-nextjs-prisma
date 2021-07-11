import { Avatar, Button, Dropdown, Layout, Menu, PageHeader } from "antd";
import { signOut, useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

type Props = {
  title: string | ReactNode;
};

const { Header } = Layout;
const MenuHeader: React.FC<Props> = ({ title }) => {
  const [session, loading] = useSession();
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const menuUser = (
    <Menu key="menu">
      <Menu.Item key="1">
        <Button type="link" icon={<UserOutlined />} onClick={() => router.push(`/users/${session?.userId}`)} >
          Profile
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button type="link" icon={<LogoutOutlined />} onClick={() => signOut({ callbackUrl: '/login' })} >
          Đăng xuât
        </Button>
      </Menu.Item>
    </Menu>
  )
  const auth = [(
    <Dropdown key="dropdown" overlay={menuUser}>
      <Avatar key="avatar" src={session?.user.image} />
    </Dropdown>
  ),
  (<a style={{ margin: 0 }} onClick={() => router.push(`/users/${session?.userId}`)} >{session?.user.name}</a>)
  ]


  return (
    <Header
      className="site-layout-background"
      style={{
        padding: 0,
        marginBottom: '20px',
      }}
    >
      <PageHeader
        key="pageheader"
        style={{ maxHeight: "64px", padding: 12, paddingLeft: 24 }}
        title={title}
        onBack={() => {
          router.back()
        }}
        extra={auth}
      />
    </Header>
  );
};

export default MenuHeader;
