import { Button, Result } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AccessDenied() {
    const router = useRouter()
    return (
        <Result
            status="403"
            title="403"
            subTitle="Bạn chưa đăng nhập nên không thể truy cập "
            extra={<Button type='primary' onClick={() => router.push('/login')}>Đăng nhập</Button>}
        />
    )
}
