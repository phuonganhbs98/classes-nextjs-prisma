import {
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    InputNumber,
    TimePicker,
    Space,
    message
} from "antd";
import { useRouter } from "next/router";
import MainLayout from "../../components/layouts/MainLayout";
import { useEffect, useState } from "react";
import { Moment } from "moment";
import {
    MinusCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';
import createClass from "../../lib/classroom/createClass";
import { API } from "../../prisma/type/type";
import { getAllTimetableClass } from "../../lib/timetable/timetable";
import checkDuplicateTimetable from "../../lib/register/checkDuplicateTimetable";

const CreateClassroomForm: React.FC = () => {
    const router = useRouter()
    const [teacherId, setTeacherId] = useState<number>()
    const [timetables, setTimetables] = useState<API.TimetableClassItem[]>([])
    useEffect(() => {
        setTeacherId(parseInt(localStorage.getItem('userId')))
    }, [])

    useEffect(()=>{
        if(typeof teacherId !== 'undefined'){
            getAllTimetableClass({ teacherId: teacherId })
            .then(res => setTimetables(res))
        }
    },[teacherId])

    const layout = {
        labelCol: { span: 8, offset: 0 },
        wrapperCol: { span: 10 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 8 },
        // wrapperCol: { offset: 8, span: 8 },
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        message.error('Thất bại')
    };

    const onFinish = async (values: API.Classroom) => {
        const data = {
            ...values,
            teacherId: teacherId,
        }
        values.schedules.forEach((x: API.Schedules)=>{
            x.dayInWeek = parseInt(x.day)
        })
        const check = checkDuplicateTimetable(values.schedules, timetables, values)
        console.log('checkDuplicate: ' + check)
        if(check){
            await createClass(data)
            .then(res => {
                router.push(`/teachers/classrooms/${res.id}`)
            })
        }else {
            message.error('Bị trùng thời khóa biểu')
        }
    }

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const onChangeDate = (e: Moment) => {
        setStartDate(e)
    }
    const onChangeEndDate= (e: Moment) => {
        setEndDate(e)
    }
    const checkEndDate = (_: any, value: Moment) => {
        console.log(endDate)
        console.log(startDate)
        if (startDate == null || endDate == null || (endDate > startDate)) {
            return Promise.resolve()
        }
        return Promise.reject(new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu'))
    }

    return (
        < MainLayout title="Tạo lớp mới">
            <div className="site-layout-background">
                <Form
                    {...layout}
                    name="basic"
                    layout="horizontal"
                    initialValues={{ remember: false }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    style={{
                        paddingTop: "2%"
                    }}
                >
                    <Form.Item
                        label="Tên lớp"
                        name="name"
                        rules={[{ required: true, message: 'Xin vui lòng điền tên lớp học!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng học sinh / sinh viên"
                        name="capacity"
                        rules={[{ required: true, message: 'Xin vui lòng điền số lượng học sinh / sinh viên!' }]}
                    >
                        <InputNumber min={0}/>
                    </Form.Item>
                    <Form.Item
                        label="Ngày lớp học bắt đầu"
                        name="startAt"
                        rules={[{ validator: checkEndDate },{ required: true, message: 'Xin vui lòng nhập ngày lớp học bắt đầu!' }]}
                    >
                        <DatePicker onChange={onChangeDate} allowClear={true} />
                    </Form.Item>
                    <Form.Item
                        label="Ngày lớp học kết thúc"
                        name="endAt"
                        rules={[{ validator: checkEndDate }, { required: true, message: 'Xin vui lòng nhập ngày lớp học kết thúc!' }]}
                    >
                        <DatePicker onChange={onChangeEndDate}/>
                    </Form.Item>
                    <Form.Item
                        label="Thời khóa biểu"
                    >
                        <Form.List
                            name="schedules">
                            {(fields, { add, remove }) => {
                                return (
                                    <>
                                        {
                                            fields.map(({ key, name, fieldKey, ...restField }) => {
                                                let startTime = null
                                                const onChangeTime = (e: Moment) => {
                                                    startTime = e;
                                                }
                                                const checkEndTime = (_: any, value: Moment) => {
                                                    if (value > startTime) {
                                                        return Promise.resolve()
                                                    }
                                                    return Promise.reject(new Error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu'))
                                                }
                                                return (
                                                    <Space key={key} style={{ display: 'flex', marginBottom: 8, alignItems: 'initial' }} align="baseline" >

                                                        <Form.Item  >
                                                            <Input.Group compact >
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'day']}
                                                                    fieldKey={[fieldKey, 'day']}
                                                                    noStyle
                                                                    rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                                                                >
                                                                    <Select placeholder="Chọn ngày">
                                                                        <Select.Option value="1">Thứ 2</Select.Option>
                                                                        <Select.Option value="2">Thứ 3</Select.Option>
                                                                        <Select.Option value="3">Thứ 4</Select.Option>
                                                                        <Select.Option value="4">Thứ 5</Select.Option>
                                                                        <Select.Option value="5">Thứ 6</Select.Option>
                                                                        <Select.Option value="6">Thứ 7</Select.Option>
                                                                        <Select.Option value="0">Chủ nhật</Select.Option>
                                                                    </Select>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...restField}
                                                                    fieldKey={[fieldKey, 'startAt']}
                                                                    name={[name, 'startAt']}
                                                                    noStyle
                                                                    rules={[{ required: true, message: 'Vui lòng nhập vào giờ bắt đầu' }]}
                                                                >
                                                                    <TimePicker
                                                                        placeholder="Chọn giờ bắt đầu"
                                                                        onChange={onChangeTime}
                                                                    />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...restField}
                                                                    fieldKey={[fieldKey, 'endAt']}
                                                                    name={[name, 'endAt']}
                                                                    noStyle
                                                                    rules={[
                                                                        { required: true, message: 'Vui lòng nhập vào giờ kết thúc' },
                                                                        { validator: checkEndTime }
                                                                    ]}
                                                                >
                                                                    {/* <Input style={{ width: '50%' }} placeholder="Input street" /> */}
                                                                    <TimePicker placeholder="Chọn giờ kết thúc" />
                                                                </Form.Item>
                                                            </Input.Group>
                                                        </Form.Item>
                                                        <MinusCircleOutlined style={{ marginTop: '5px' }} onClick={() => remove(name)} />
                                                    </Space>
                                                )
                                            })
                                        }
                                        < Form.Item >
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Thêm lịch
                                            </Button>
                                        </Form.Item>
                                    </>
                                )
                            }}

                        </Form.List></Form.Item>
                    <Form.Item {...tailLayout} >
                        <Button type="primary" htmlType="submit" style={{ margin: '0 0 30px' }}>
                            Tạo lớp
                        </Button>
                    </Form.Item>
                    <small style={{color: 'red'}}>*Lưu ý: Ngày bắt đầu, kết thúc lớp học và thời khóa biểu sau khi tạo lớp không thể thay đổi.<br />Hãy điền chính xác.</small>
                </Form>
            </div>
        </MainLayout >
    )
}

export default CreateClassroomForm;