import fs from "fs";
// import ReactMarkdown from "react-markdown";
import matter from "gray-matter";
import Head from "next/head";
import styles from "../../styles/Quiz.module.css";
import mainStyles from "../../styles/Main.module.css";
import { Map } from "../../components/Map";
import { Header } from "../../components/Header";
import Image from "next/image";

export default function Quiz({ frontmatter, markdown, fullQuestions }) {
  console.log("fullQuestions", fullQuestions);

  return (
    <div className={mainStyles["page-wrapper"]}>
      <Head>
        <title>Quiz | {frontmatter.title}</title>
      </Head>
      <Header />
      {frontmatter.quizImage && (
        <div style={{ width: "100%", height: 400, position: "relative" }}>
          <Image
            src={frontmatter.quizImage.quizImageSrc}
            alt={frontmatter.quizImage.quizImageAlt}
            layout="fill"
            objectFit="cover"
          />
          <h1
            className={mainStyles["h1"]}
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "3rem",
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: 0,
            }}
          >
            {frontmatter.title}
          </h1>
        </div>
      )}
      <div className={mainStyles["content-wrapper"]}>
        <p className={mainStyles["blockquote"]}>{frontmatter.description}</p>
        <main className={styles["quiz-area"]}>
          <div className="container">
            {/* MAP QUESTIONS */}
            {frontmatter.multipleChoiceQuestions &&
              frontmatter.multipleChoiceQuestions.map((q, index) => {
                const fullQuestion = fullQuestions[q.multipleChoiceQuestion];
                //   const { question, options, name, questionType } = q
                if (fullQuestion.questionType === "Map") {
                  return (
                    <div key={index}>
                      <h3>{fullQuestion.title}</h3>
                      <Map
                        options={fullQuestion.options}
                        //   selectedOptionIndex={answers[name]}
                        //   onSelectOption={(optionIndex) => {
                        //     onSelectMultipleChoiceOption(name, optionIndex)
                        //   }}
                      />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
          </div>
        </main>
      </div>
    </div>
  );
}

export async function getStaticProps({ params: { slug } }) {
  const fileContent = matter(
    fs.readFileSync(`./content/quiz/${slug}.md`, "utf8")
  );
  let frontmatter = fileContent.data;
  const markdown = fileContent.content;

  // Get the questions in the quiz
  const questions = frontmatter.multipleChoiceQuestions;
  let fullQuestions = {};

  for (let i = 0; i < questions.length; i++) {
    const element = questions[i];
    let questionSlug = element["multipleChoiceQuestion"];
    const fileContent = matter(
      fs.readFileSync(
        `./content/multipleChoiceQuestions/${questionSlug}.md`,
        "utf8"
      )
    );
    const frontmatter = fileContent.data;
    fullQuestions[questionSlug] = frontmatter;
  }

  return {
    props: { frontmatter, markdown, fullQuestions },
  };
}

export async function getStaticPaths() {
  const filesInProjects = fs.readdirSync("./content/quiz");

  // Getting the filenames excluding .md extension
  // and returning an array containing slug (the filename) as params for every route
  // It looks like this
  // paths = [
  //		{ params: { slug: 'my-first-blog' }},
  //		{ params: { slug: 'how-to-train-a-dragon' }},
  //		{ params: { slug: 'how-to-catch-a-pokemon' }},
  // ]
  const paths = filesInProjects.map((file) => {
    const filename = file.slice(0, file.indexOf("."));
    return { params: { slug: filename } };
  });

  return {
    paths,
    fallback: false, // This shows a 404 page if the page is not found
  };
}
