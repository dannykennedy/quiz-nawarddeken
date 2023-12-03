import fs from "fs";
// import ReactMarkdown from "react-markdown";
import matter from "gray-matter";
import Head from "next/head";
import styles from "../../styles/Quiz.module.css";
import mainStyles from "../../styles/Main.module.css";
import { Map } from "../../components/Map";
import { MatchingQuestion } from "../../components/matching-question/MatchingQuestion";
import { Header } from "../../components/Header";
import Image from "next/image";

export default function Quiz({ frontmatter, markdown, fullQuestions }) {
  console.log("fullQuestions", fullQuestions);

  const onSubmitQuiz = () => {
    console.log("onSubmitQuiz");
  };

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
          {/* Overlay with shading, darker at the bottom */}
          <div className={styles["quiz-image-overlay"]} />
          <h1 className={`${styles["quiz-title"]}`}>{frontmatter.title}</h1>
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
                        // selectedOptionIndex={answers[name]}
                        onSelectOption={(optionIndex) => {
                          console.log("selected option", optionIndex);
                        }}
                      />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            {/* MATCHING QUESTIONS */}
            {frontmatter.matchingQuestions &&
              frontmatter.matchingQuestions.map((q, index) => {
                const fullQuestion = fullQuestions[q.matchingQuestion];
                return <MatchingQuestion key={index} question={fullQuestion} />;
              })}
          </div>
          {/* Submit quiz button */}
          <div className={mainStyles["button-container"]}>
            <button onClick={onSubmitQuiz} className={mainStyles["button"]}>
              Submit Quiz
            </button>
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

  // Get the multiple choice questions in the quiz (multipleChoiceQuestions)
  const mcQuestions = frontmatter.multipleChoiceQuestions || [];
  let fullQuestions = {};

  for (let i = 0; i < mcQuestions.length; i++) {
    const element = mcQuestions[i];
    let questionSlug = element["multipleChoiceQuestion"];
    const fileContent = matter(
      fs.readFileSync(
        `./content/multipleChoiceQuestions/${questionSlug}.md`,
        "utf8"
      )
    );
    const frontmatter = fileContent.data;
    fullQuestions[questionSlug] = {
      ...frontmatter,
      qType: "multipleChoiceQuestion",
    };
  }

  // Get the matching questions in the quiz (matchingQuestions)
  const matchingQuestions = frontmatter.matchingQuestions || [];

  for (let i = 0; i < matchingQuestions.length; i++) {
    const element = matchingQuestions[i];
    let questionSlug = element["matchingQuestion"];
    const fileContent = matter(
      fs.readFileSync(`./content/matchingQuestions/${questionSlug}.md`, "utf8")
    );
    const frontmatter = fileContent.data;

    // Expand the options in the matching question
    // Expand Set 1 items
    const set1Items = frontmatter.set1 || [];
    const expandedSet1Items = [];
    for (let j = 0; j < set1Items.length; j++) {
      const set1Item = set1Items[j];
      const key = set1Item["set1item"];
      const set1ItemFileContent = matter(
        fs.readFileSync(`./content/quizItems/${key}.md`, "utf8")
      );
      const set1ItemFrontmatter = set1ItemFileContent.data;
      expandedSet1Items.push({
        title: set1Item.title || set1ItemFrontmatter.title,
        item: set1ItemFrontmatter,
        key: key,
      });
    }

    // Expand Set 2 items
    const set2Items = frontmatter.set2 || [];
    const expandedSet2Items = [];
    for (let k = 0; k < set2Items.length; k++) {
      const set2Item = set2Items[k];
      const key = set2Item["set2item"];
      const set2ItemFileContent = matter(
        fs.readFileSync(`./content/quizItems/${key}.md`, "utf8")
      );
      const set2ItemFrontmatter = set2ItemFileContent.data;
      expandedSet2Items.push({
        title: set2Item.title || set2ItemFrontmatter.title,
        item: set2ItemFrontmatter,
        key: key,
      });
    }

    fullQuestions[questionSlug] = {
      ...frontmatter,
      set1: expandedSet1Items,
      set2: expandedSet2Items,
      qType: "matchingQuestion",
    };
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
