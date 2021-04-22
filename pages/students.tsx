import React, { useEffect, useState } from "react";
import { PageHeader, Table } from "antd";
import MainLayout from "../components/layouts/MainLayout";
import { API } from "../prisma/type/type";
import Columns from "../components/column/Columns";

const Students: React.FC = () => {
  const [students, setStudents] = useState<API.UserInfor[]>([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
    }
  ]
  function onChange(pagination: any) {
    console.log('params', pagination);
  }
  useEffect(() => {

  }, [])
  let data = []
  return (
    <MainLayout title="Danh sách học sinh">
      <div>
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          rowKey={(record) => { return record.id.toString() }}
        />
      </div>
    </MainLayout>
  );
};

export default Students;
