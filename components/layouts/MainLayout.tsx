import React, { ReactNode } from "react";
import { Layout } from "antd";
import MenuSider from "./MenuSider";
import MenuHeader from "./MenuHeader";

const { Content, Footer } = Layout;

type Props = {
  children: ReactNode;
  title: string;
};

const MainLayout: React.FC<Props> = ({ children, title }) => (
  <Layout>
    <MenuSider />
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <MenuHeader title={title} />
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <div className="site-layout-background main-container">{children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>NextJS Prisma</Footer>
    </Layout>
  </Layout>
);

export default MainLayout;
