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
    <Menu>
      <Menu.Item key={1}><Button key={1} type="link" icon={<UserOutlined />} onClick={() => router.push(`/users/${session?.userId}`)} >Profile</Button></Menu.Item>
      <Menu.Item key={2}><Button key={2} type="link" icon={<LogoutOutlined />} onClick={() => signOut({callbackUrl:'/login'})} >Đăng xuât</Button></Menu.Item>
    </Menu>
  )
  const auth =(
        <>
        <Dropdown overlay={menuUser}>
        <Avatar src={session?.user.image} />
        </Dropdown>
        <Link href={`/users/${session?.userId}`} >{session?.user.name}</Link>
        </>)

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
        onBack={() => {
          router.back()
          // router.reload()
          // router.prefetch()
        }}
        extra={auth}
      />
    </Header>
  );
};

export default MenuHeader;
