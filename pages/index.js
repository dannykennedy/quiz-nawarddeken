import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home({ quizzes }) {
  return (
    <div className={styles["container"]}>
      <Head>
        <title>Demo quiz</title>
      </Head>
      <h1 className={styles["header"]}>Welcome to my quiz</h1>
      <p className={styles["subtitle"]}>
        This is a subtitle idk what to type here
      </p>
      <ul className={styles["quiz-list"]}>
        {quizzes.map((quiz) => (
          <li key={quiz.slug}>
            <Link href={`/quiz/${quiz.slug}`}>
              <a>{quiz.title}</a>
            </Link>
          </li>
        ))}
      </ul>
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
