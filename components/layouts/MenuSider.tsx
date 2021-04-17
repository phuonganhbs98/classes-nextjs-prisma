import { Layout, Menu, Spin } from "antd";
import React from "react";
import { useRouter } from "next/router";
import StudentBar from "../sidebar/StudentBar"
import TeacherBar from "../sidebar/TeacherBar"
import { LoadingOutlined } from "@ant-design/icons";

const spinIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

type Props = {
  loading: any,
  role: any
};

const MenuSider: React.FC<Props> = ({role, loading}) => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => {
    return router.pathname === pathname;
  };
  return (
    loading ?
      (
        <div style={{ width: 44 }} key="1">
          <Spin indicator={spinIcon} />
        </div>
      ) :
      (role === "STUDENT") ? (
        <StudentBar pathname={router.pathname}/>
      ) : (
        <TeacherBar pathname={router.pathname}/>
        )
  )

};

export default MenuSider;
