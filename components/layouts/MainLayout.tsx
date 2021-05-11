import React, { ReactNode, useEffect, useState } from "react";
import { Col, Layout, Row } from "antd";
import MenuHeader from "./MenuHeader";
import { useSession } from "next-auth/client"
import { Role } from ".prisma/client";
import Loading from "../Loading";
import AccessDenied from "../AccessDenied";
import { useRouter } from "next/router";
import StudentBar from "../sidebar/StudentBar";
import TeacherBar from "../sidebar/TeacherBar";

const { Content, Footer } = Layout;

type Props = {
  children: ReactNode;
  title: ReactNode | string | number;
};

const MainLayout: React.FC<Props> = ({ children, title }) => {
  const [session, loading] = useSession();
  const [role, setRole] = useState<Role>()
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => {
    return router.pathname === pathname;
  };
  useEffect(() => {
    if (session) {
      setRole(session.role)
      localStorage.setItem('userId', session.userId)
      localStorage.setItem('role', session.role)
    }
  }, [session])
  return loading ? (<Loading />) : session ? (
    <Layout
      style={{ minHeight: '100vh' }}
    >
      <Row>
        <Col flex='none'>
          {/* <MenuSider role={role} loading={loading} /> */}
          {(role === "STUDENT") ? (
        <StudentBar pathname={router.pathname}/>
      ) : (
        <TeacherBar pathname={router.pathname}/>
        )}
        </Col>
        <Col flex='auto'>
          <Layout className="site-layout" style={{ position: 'absolute', width: '100%' }}>
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
  )
    : <AccessDenied />;
}

export default MainLayout;
