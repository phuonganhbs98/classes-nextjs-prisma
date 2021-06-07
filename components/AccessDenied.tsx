import { Button, Result } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

const AccessDenied: React.FC<{ content?: string }> = ({ content }) => {
    const router = useRouter()
    return (
        <div style={{
            padding: "120px 2%",
            backgroundImage: 'url(/image/home_bg.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            minHeight: '650px',
            textAlign: 'center'
        }}>
            <h1>{content}</h1>
            <p><a onClick={()=> router.back()}>Quay lại</a></p>
            <p>Chuyển đến trang <a onClick={() => router.push('/login')}>đăng nhập </a></p>
        </div>
    )
}

export default AccessDenied