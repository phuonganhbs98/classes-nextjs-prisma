import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { API } from "../../../prisma/type/type";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import MainLayout from "../../../components/layouts/MainLayout";
import { getAllStudentOfTeacher } from "../../../lib/user/user";
import { getAllClassroom } from "../../../lib/classroom/getClassroomInfor";
import { Option } from "antd/lib/mentions";

type Search = {
  studentName?: string,
  className?: string
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<API.UserInfor[]>([])
  const [total, setTotal] = useState<number>()
  const [searchData, setSearchData] = useState<Search>()
  const [classes, setClasses] = useState<API.Classroom[]>([])
  const router = useRouter()

  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId'))
    getAllClassroom({ teacherId: userId })
      .then(res => {
        setClasses(res)
      })
  }, [])

  useEffect(() => {
    console.log('searchData: ')
    console.log(searchData)
    const userId = parseInt(localStorage.getItem('userId'))
    getAllStudentOfTeacher(userId, searchData)
      .then(res => {
        setStudents(res)
        setTotal(res.length)
      })
  }, [searchData])

  const columns: ColumnsType<API.UserInfor> = [
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
      render: (text, record) => {
        return (
          <Tooltip title='Xem'><Button key={record.id}
            type="link"
            icon={<EyeOutlined />}
            onClick={() => router.push({
              pathname: `/users/${record.id}`,
            })} /></Tooltip>
        )
      }
    }
  ]
  function onChange(pagination: any) {
    console.log('params', pagination);
  }
  const onSearch = (value: Search) => {
    setSearchData(value)
  }

  let options: any[] = []
  classes.forEach((x: API.Classroom) => {
    options = [
      ...options,
      (<Option value={x.name} >{x.name}</Option>)
    ]

  })
  return (
    <MainLayout title="Danh sách học sinh">
      <div className="site-layout-background">
        <Form
          className="ant-advanced-search-form"
          layout='inline'
          labelCol={{ offset: 3, pull: 1, span: 8 }}
          // wrapperCol={{span: 10, offset: 0}}
          onFinish={onSearch}
          style={{ marginLeft: '150px' }}
        >
          <Form.Item
            label='Tên học sinh'
            name='studentName'
          >
            <Input placeholder="Nhập tên học sinh" allowClear />
          </Form.Item>
          <Form.Item
            name='className'
            label='Lớp'
          >
            <Select
            style={{width: '200px'}}
              placeholder='Chọn một lớp'
              allowClear
            >
              {options}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 8, push: 10 }} style={{ marginLeft: '100px' }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              shape='round' >
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="site-layout-background" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={students}
          onChange={onChange}
          pagination={{
            total: total,
            showTotal: total => `Tổng ${total} học sinh`,
            defaultPageSize: 10,
            defaultCurrent: 1
          }}
          rowKey={(record) => { return record.id.toString() }}
        />
      </div>
    </MainLayout>
  );
};

export default Students;
