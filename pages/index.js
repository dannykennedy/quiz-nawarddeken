import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Header } from "../components/Header";

export default function Home({ quizzes }) {
  return (
    <div className={styles["container"]}>
      <Head>
        <title>Nawarddeken Quizzes</title>
      </Head>
      <Header />
      <h1 className={styles["header"]}>Nawarddeken Quizzes</h1>
      <div className={styles["quiz-boxes"]}>
        {(quizzes || []).map((quiz, index) => {
          console.log("quiz", quiz);
          return (
            <Link href={`/quiz/${quiz.slug}`} key={index}>
              <div
                className={styles["quiz-box"]}
                style={{
                  backgroundImage: `url(${quiz.quizImage.quizImageSrc})`,
                }}
              >
                <h2>{quiz.title}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // List of files in blgos folder
  const filesInQuizzes = fs.readdirSync("./content/quiz");

  // Get the front matter and slug (the filename without .md) of all files
  const quizzes = filesInQuizzes.map((filename) => {
    const file = fs.readFileSync(`./content/quiz/${filename}`, "utf8");
    const matterData = matter(file);

    return {
      ...matterData.data, // matterData.data contains front matter
      slug: filename.slice(0, filename.indexOf(".")),
    };
  });

  return {
    props: {
      quizzes: quizzes,
    },
  };
}
