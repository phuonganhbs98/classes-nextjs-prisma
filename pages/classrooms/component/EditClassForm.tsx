import { Button, DatePicker, Form, Input, InputNumber, message, Modal } from "antd";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import updateClass from "../../../lib/classroom/updateClass";
import { API } from "../../../prisma/type/type";

const EditClassForm: React.FC<{
    classroom: API.Classroom,
    reload: boolean,
    setReload: any,
    isModalVisible: boolean,
    setIsModalVisible: any
}> = ({ classroom, reload, setReload, isModalVisible, setIsModalVisible }) => {
    const [startDate, setStartDate] = useState<Date>(classroom?.startAt);
    const [count, setCount] = useState<number>()
    useEffect(() => {
        setStartDate(classroom?.startAt)
        setCount(classroom?.students.length)
    }, [classroom])
    const onChangeDate = (e: Moment) => {
        setStartDate(new Date(e.toString()))
    }
    const checkEndDate = (_: any, value: Moment) => {
        if ((startDate === null && !value) || (value === null) || (new Date(value.toString()) > new Date(startDate))) {
            return Promise.resolve()
        }
        return Promise.reject(new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu'))
    }
    const checkCapacity = (_: any, value: number) => {
        if (value < count ) {
            return Promise.reject(new Error(`Sĩ số hiện tại là ${count}. Số lượng phải lớn hơn hoặc bằng sĩ số`))
        }
        return Promise.resolve()
    }
    const handleEdit = async (value: API.Classroom) => {
        await updateClass(classroom.id, value)
            .then(res => {
                setIsModalVisible(false)
                message.success('Thành công')
                if (reload) setReload(false)
                else setReload(true)
            })
            .catch(err => {
                console.error(err)
                message.error('Thất bại')
            })
    }
    return (
        <Modal
            title="Chỉnh sửa thông tin lớp"
            visible={isModalVisible}
            footer={null}
            onCancel={() => setIsModalVisible(false)}>
            <Form<API.Classroom>
                name="basic"
                layout="vertical"
                initialValues={{ remember: false }}
                onFinish={(value: API.Classroom) => handleEdit(value)}
            >
                <Form.Item
                    label="Tên lớp"
                    name="name"
                    initialValue={classroom?.name}
                    rules={[{ required: true, message: 'Xin vui lòng điền tên lớp học!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Số lượng học sinh / sinh viên"
                    name="capacity"
                    initialValue={classroom?.capacity}
                    rules={[{ validator: checkCapacity }, { required: true, message: 'Xin vui lòng điền số lượng học sinh / sinh viên!' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Ngày lớp học bắt đầu"
                    name="startAt"
                    initialValue={moment(classroom?.startAt)}
                    rules={[{ required: true, message: 'Xin vui lòng nhập ngày lớp học bắt đầu!' }]}
                >
                    <DatePicker onChange={onChangeDate} allowClear={true} disabled/>
                </Form.Item>
                <Form.Item
                    label="Ngày lớp học kết thúc"
                    name="endAt"
                    initialValue={moment(classroom?.endAt)}
                    rules={[{ validator: checkEndDate }, { required: true, message: 'Xin vui lòng nhập ngày lớp học kết thúc!' }]}
                >
                    <DatePicker disabled/>
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit" style={{ margin: '0 0 30px' }}>
                        OK
                        </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default EditClassForm;