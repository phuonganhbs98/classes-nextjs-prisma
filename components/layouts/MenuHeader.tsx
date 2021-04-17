import { Avatar, Button, Dropdown, Layout, Menu, PageHeader, Spin } from "antd";
import { signOut, useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { LoadingOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";

const spinIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

type Props = {
  title: string;
};

const { Header } = Layout;

const MenuHeader: React.FC<Props> = ({ title }) => {
  const [session, loading] = useSession();
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const menuUser = (
    <Menu>
      <Menu.Item key={1}><Button key={1} type="link" icon={<UserOutlined />} onClick={() => router.push(`/users/${session?.userId}`)} >Profile</Button></Menu.Item>
      <Menu.Item key={2}><Button key={2} type="link" icon={<LogoutOutlined />} onClick={() => signOut()} >Đăng xuât</Button></Menu.Item>
    </Menu>
  )
  const auth = loading ? (
    <div style={{ width: 44 }} key="1">
      <Spin indicator={spinIcon} />
    </div>
  ) :
    session ? (
        <>
        <Dropdown overlay={menuUser}>
        <Avatar src={session?.user.image} />
        </Dropdown>
        <Link href={`/users/${session?.userId}`} >{session?.user.name}</Link>
        </>
    ) : (
      <>
        <Link href="/login" key="1">
          <a data-active={isActive("/login")}>Đăng nhập</a>
        </Link>  /
        <Link href="/signup" key="2">
          <a data-active={isActive("/signup")}>Đăng ký</a>
        </Link>
      </>
    );

  return (
    <Header
      className="site-layout-background"
      style={{
        padding: 0,
        marginBottom: '20px',
      }}
    >
      <PageHeader
        style={{ maxHeight: "64px", padding: 12, paddingLeft: 24 }}
        title={title}
        onBack={() => router.back()}
        extra={auth}
      />
    </Header>
  );
};

export default MenuHeader;
