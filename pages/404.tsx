import { Result } from "antd";

const Error = () => (
  <Result
    status="404"
    title="404 - Page Not Found"
    subTitle="Sorry, the page you visited does not exist"
  />
);

export default Error;
