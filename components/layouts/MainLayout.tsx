import React, { ReactNode } from "react";
import { Layout, Spin } from "antd";
import MenuSider from "./MenuSider";
import MenuHeader from "./MenuHeader";
import { useSession } from "next-auth/client"
import { LoadingOutlined } from "@ant-design/icons";
import SignInForm from "../../pages/login";

const { Content, Footer } = Layout;

type Props = {
  children: ReactNode;
  title: string;
};
const spinIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
const MainLayout: React.FC<Props> = ({ children, title }) => {
  const [session, loading] = useSession();
  const role = session ? session.role : null
  return loading?(<p>Loading ....</p>):session?(
    <Layout style={{ minHeight: '100vh' }}>
        <MenuSider role={role} loading={loading}/>
      <Layout className="site-layout"
      style={{ marginLeft: 200 }}
      >
        <MenuHeader title={title} />
        <Content
          style={{ margin: '0 16px',
                 overflow: "initial",
                }}
        >
          <div className="site-layout-background main-container"
            style={{
              padding: '0 20px'
            }}>{children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>NextJS Prisma</Footer>
      </Layout>
    </Layout>
  ): <SignInForm />;
}

export default MainLayout;
