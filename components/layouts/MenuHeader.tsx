import { Avatar, Layout, Menu, Spin } from "antd";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const { Header } = Layout;

const MenuHeader: React.FC<Props> = () => {
  const [session, loading] = useSession();

  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  return (
    <Header
      className="site-layout-background"
      style={{
        zIndex: 1,
        width: "100%",
      }}
    >
      <Menu mode="horizontal" style={{ lineHeight: "64px" }}>
        <div
          style={{
            float: "right",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "64px",
          }}
        >
          {loading ? (
            <a>
              <Spin />
            </a>
          ) : session ? (
            <a>
              <Avatar src={session?.user.image} />
            </a>
          ) : (
            <Link href="/api/auth/signin">
              <a data-active={isActive("/signup")}>Đăng nhập</a>
            </Link>
          )}
        </div>
      </Menu>
    </Header>
  );
};

export default MenuHeader;
