import { Result } from "antd";
import { FC } from "react";

const Error: FC = () => (
  <Result
    status="404"
    title="404 - Page Not Found"
    subTitle="Sorry, the page you visited does not exist"
  />
);

export default Error;
