import fs from "fs";
import React, { useState, useEffect, useMemo } from "react";
import matter from "gray-matter";
import Head from "next/head";
import styles from "../../styles/Quiz.module.css";
import mainStyles from "../../styles/Main.module.css";
import { Map } from "../../components/Map";
import { MatchingQuestion } from "../../components/matching-question/MatchingQuestion";
import { Header } from "../../components/Header";
import Image from "next/image";
import { MultipleChoiceQuestion } from "../../components/MultipleChoiceQuestion";
import { QuizHeader } from "../../components/QuizHeader";

export default function Quiz({ frontmatter, markdown, fullQuestions }) {
  // Get the number of questions in the quiz
  const numQuestions = Object.keys(fullQuestions || {}).length;

  // Process the questions
  const allQuestions = useMemo(() => {
    // Multiple choice questions
    const multipleChoiceQuestions = (
      frontmatter.multipleChoiceQuestions || []
    ).map((mcq) => {
      return {
        ...mcq,
        type: "multipleChoiceQuestion",
        id: mcq.multipleChoiceQuestion,
        questionNumber: mcq.questionNumber || 1,
        question: fullQuestions[mcq.multipleChoiceQuestion],
      };
    });

    // Matching questions
    const matchingQuestions = (frontmatter.matchingQuestions || []).map(
      (mq) => {
        return {
          ...mq,
          type: "matchingQuestion",
          id: mq.matchingQuestion,
          questionNumber: mq.questionNumber || 1,
          question: fullQuestions[mq.matchingQuestion],
        };
      }
    );

    // Combine the questions
    const questions = [...multipleChoiceQuestions, ...matchingQuestions];

    // Sort the questions by their order
    questions.sort((a, b) => {
      return a.questionNumber - b.questionNumber;
    });

    return questions;
  }, [frontmatter, fullQuestions]);

  // STATE
  const [answers, setAnswers] = useState({});
  const [showingQuizSummary, setShowingQuizSummary] = useState(false);
  const [quizSummary, setQuizSummary] = useState({
    numCorrect: 0,
    numQuestions: numQuestions,
    allCorrect: false,
    message: "Try again!",
  });

  useEffect(() => {
    console.log("answers", answers);
  }, [answers]);

  const onSubmitQuiz = () => {
    const numCorrect = Object.values(answers).filter((x) => x.correct).length;
    const allCorrect = numCorrect === numQuestions;
    const message = allCorrect ? "✅ Kamak yimarnbom!" : "Try again!";
    setQuizSummary({
      numCorrect,
      numQuestions,
      allCorrect,
      message,
    });
    setShowingQuizSummary(true);
  };

  // When the answers change, hide the quiz summary
  const onSetAnswers = (answers) => {
    setAnswers(answers);
    setShowingQuizSummary(false);
  };

  const numMCQuestions = (frontmatter.multipleChoiceQuestions || []).length;

  return (
    <div className={mainStyles["page-wrapper"]}>
      <Head>
        <title>Quiz | {frontmatter.title}</title>
      </Head>
      <Header />
      <QuizHeader frontmatter={frontmatter} />
      <div className={mainStyles["content-wrapper"]}>
        <p className={mainStyles["blockquote"]}>{frontmatter.description}</p>
        <main className={styles["quiz-area"]}>
          <div className="container">
            {allQuestions.map((q, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  className={`${styles["question-wrapper"]} ${
                    isEven
                      ? styles["question-wrapper--even"]
                      : styles["question-wrapper--odd"]
                  }`}
                  key={index}
                >
                  {q.type === "multipleChoiceQuestion" ? (
                    <MultipleChoiceQuestion
                      key={index}
                      question={q.question}
                      questionNumber={index + 1}
                      onAnswer={(answer) => {
                        onSetAnswers({
                          ...answers,
                          [q.id]: answer,
                        });
                      }}
                    />
                  ) : (
                    <MatchingQuestion
                      key={index}
                      question={q.question}
                      questionNumber={index + 1}
                      onAnswer={(answer) => {
                        onSetAnswers({
                          ...answers,
                          [q.id]: answer,
                        });
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {/* Submit quiz button */}
          <div className={mainStyles["button-container"]}>
            <button onClick={onSubmitQuiz} className={mainStyles["button"]}>
              Check quiz results
            </button>
          </div>
          {
            // If the user has checked the answer, show the answer
            showingQuizSummary && (
              <div className={styles["quiz-summary"]}>
                <span>
                  {quizSummary.numCorrect} / {quizSummary.numQuestions} correct.
                </span>
                <span>{" " + quizSummary.message}</span>
              </div>
            )
          }
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
      id: questionSlug,
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
        id: key,
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
      id: questionSlug,
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
