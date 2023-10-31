import React from "react";
import styles from "../styles/Main.module.css";

// Just a basic fixed header at the top of the page

export const Header = () => {
  return (
    <header className={styles["header"]}>
      <h1>Header</h1>
    </header>
  );
};
