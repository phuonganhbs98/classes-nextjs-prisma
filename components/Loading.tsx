import { Space, Spin } from "antd";

export default function Loading() {
    return (
        <div style={{width: '100%', padding:'20% 45%' }}>
            <Spin size='large' tip='Kiên nhẫn chút nha!' />
        </div>
    )
}