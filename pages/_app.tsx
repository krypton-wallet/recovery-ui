import "antd/dist/antd.css";
import Head from "next/head";
import Layout from "../components/Layout";

type Props = {
  Component: any;
  pageProps: any;
};

const MyApp = ({ Component, pageProps }: Props) => {
  return (
    <Layout>
      <>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta charSet="utf-8" />
          <title>Krypton Recovery</title>
          <meta name="description" content="Recovery your Kryptonian" />
          <link rel="icon" href="/krypton_logo.ico" />
        </Head>
        <Component {...pageProps} />
      </>
    </Layout>
  );
};
export default MyApp;
