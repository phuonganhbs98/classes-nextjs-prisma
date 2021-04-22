import React, { ReactNode, useEffect, useState } from "react";
import { Col, Layout, Row, Spin } from "antd";
import MenuSider from "./MenuSider";
import MenuHeader from "./MenuHeader";
import { useSession } from "next-auth/client"
import { LoadingOutlined } from "@ant-design/icons";
import SignInForm from "../../pages/login";
import { Role } from ".prisma/client";

const { Content, Footer } = Layout;

type Props = {
  children: ReactNode;
  title: ReactNode;
};
const spinIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
const MainLayout: React.FC<Props> = ({ children, title }) => {
  const [session, loading] = useSession();
  const [role, setRole] = useState<Role>()

  useEffect(() => {
    if (session) setRole(session.role)
  }, [session])
  return loading ? (<p>Loading ....</p>) : session ? (
    <Layout
      style={{ minHeight: '100vh' }}
    >
      <Row>
        <Col flex='none'>
          <MenuSider role={role} loading={loading} />
        </Col>
        <Col flex='auto'>
          <Layout className="site-layout" style={{position: 'absolute', width: '100%'}}>
            <MenuHeader title={title} />
            <Content
              style={{
                margin: '0 16px',
                overflow: "initial",
              }}
            >
              <div className=" main-container"
                style={{
                  // padding: '0 20px'
                  // padding:20,
                  minHeight: 360
                }}>{children}</div>
            </Content>
            <Footer style={{ textAlign: "center" }}>NextJS Prisma</Footer>
          </Layout>

        </Col>
      </Row>

    </Layout>
  ) : <SignInForm />;
}

export default MainLayout;
