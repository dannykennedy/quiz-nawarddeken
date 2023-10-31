import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Header } from "../components/Header";
import mainStyles from "../styles/Main.module.css";

export default function Home({ quizzes }) {
  return (
    <div className={mainStyles["page-wrapper"]}>
      <Head>
        <title>Nawarddeken Quizzes</title>
      </Head>
      <Header />
      <div className={mainStyles["content-wrapper"]}>
        <h1 className={mainStyles["h1"]}>Nawarddeken Quizzes</h1>

        <blockquote className={mainStyles["blockquote"]}>
          <span>
            &quot;We are teaching young people about the country, the walking
            routes, the place names, experiences with the country and then they
            in turn follow this way. This is not a new thing. It's just what our
            old people before us taught us&quot;
          </span>
          <span className={mainStyles["blockquote-source"]}>
            Professor Mary Kolkiwarra Nadjamerrek
          </span>
        </blockquote>

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
