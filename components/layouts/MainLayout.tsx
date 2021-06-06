import React, { ReactNode, useEffect, useState } from "react";
import { Col, Divider, Layout, Row } from "antd";
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
  title:  string | ReactNode;
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
      localStorage.setItem('image', session.user.image)
      localStorage.setItem('name', session.user.name)
    }
  }, [session])
  return loading ? (<Loading />) : session ? (
    <Layout
      style={{ minHeight: '160vh' }}
    >
      <Row style={{minHeight: 'inherit'}}>
        <Col flex='none' style={{minHeight: 'inherit'}}>
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
                minHeight: '130vh'
              }}
            >
              <div className=" main-container"
                style={{
                  minHeight: 'inherit'
                }}>{children}</div>
            </Content>
            <Divider />
            <Footer style={{ textAlign: "center" }}>
            <div>Trường đại học Bách Khoa Hà Nội</div>
            <div>Viện CNTT-TT</div>
            <div>Classes Management - Nguyễn Phương Anh</div>
            </Footer>
          </Layout>
        </Col>
      </Row>
    </Layout>
  )
    : <AccessDenied />;
}

export default MainLayout;
