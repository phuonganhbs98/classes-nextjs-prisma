import React, { ReactNode } from "react";
import { Layout } from "antd";
import MenuSider from "./MenuSider";
import MenuHeader from "./MenuHeader";

const { Content, Footer } = Layout;

type Props = {
  children: ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => (
  <Layout>
    <MenuSider />
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <MenuHeader />
      {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <div className="site-layout-background main-container" style={{ padding: 24 }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  </Layout>
);

export default MainLayout;
