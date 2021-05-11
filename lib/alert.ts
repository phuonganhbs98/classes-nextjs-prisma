import { notification } from "antd";

export default function alert(message: string, type: string) {
  const args = {
    message: type,
    description: message,
    duration: 2,
  };
  type==='Error'?notification.error(args):notification.success(args);
};