import { Avatar, Layout, Menu, PageHeader, Spin } from "antd";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";

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

  const auth = loading ? (
    <div style={{ width: 44 }} key="1">
      <Spin indicator={spinIcon} />
    </div>
  ) : session ? (
    <Link href="/profile" key="1">
      <a>
        <Avatar src={session?.user.image} />
      </a>
    </Link>
  ) : (
    <Link href="/api/auth/signin" key="1">
      <a data-active={isActive("/signup")}>Đăng nhập</a>
    </Link>
  );

  return (
    <Header
      className="site-layout-background"
      style={{
        zIndex: 1,
        width: "100%",
        padding: 0,
      }}
    >
      <PageHeader
        style={{ maxHeight: "64px", padding: 12, paddingLeft: 24 }}
        title={title}
        extra={[auth]}
      />
    </Header>
  );
};

export default MenuHeader;
