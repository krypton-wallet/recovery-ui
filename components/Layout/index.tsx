import { Divider } from "antd";
import { ReactNode } from "react";
import styles from "./index.module.css";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.header}>
          <span className={styles.logo}>Krypton</span>
          <Divider style={{ margin: "1rem 0" }} />
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
