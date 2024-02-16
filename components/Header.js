import React from "react";
import styles from "../styles/Main.module.css";
import Image from "next/image";
import Link from "next/link";

const headerLinks = [
  {
    label: "Quizzes Home",
    href: "/",
  },
  {
    label: "Warddeken",
    href: "https://www.warddeken.org.au/",
  },
  {
    label: "Nawarddeken Academy",
    href: "https://www.nawarddeken.org.au/",
  },
];

export const Header = () => {
  return (
    <header className={styles["header"]}>
      <Image src="/uploads/wlm_logo.png" height={150} width={172}></Image>
      <div className={styles["header-right"]}>
        <ul className={styles["header-links"]}>
          {headerLinks.map((link, i) => {
            return (
              <li className={styles["header-links__item"]} key={i}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};
