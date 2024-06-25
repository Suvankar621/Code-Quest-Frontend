import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../Context";
import Loading from "../Loader/Loading";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as monaco from "monaco-editor";
import "./Submission.css";

const genAi = new GoogleGenerativeAI('AIzaSyCDlCpViCC3QgPCThe0A2YmAXd4Mo8VgtM');

const Submission = ({ question }) => {
  const { user, isLoader, setisLoader } = useContext(Context);
  const { id } = useParams();
  const [answers, setAnswers] = useState({});
  const [isAnswered, setIsAnswered] = useState(null);
  const [compilationResults, setCompilationResults] = useState({});
  const editorRefs = useRef({});

  const model = genAi.getGenerativeModel({
    model: 'gemini-1.5-flash'
  });

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setisLoader(true);
      for (const [questionId, answer] of Object.entries(answers)) {
        const { data } = await axios.post(
          `https://code-quest-backend.onrender.com/api/v1/contest/submit/${id}`,
          { questionId, answer },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        toast.success(data.message);

        const result = await evaluateAnswer(questionId, answer);
        setCompilationResults((prevResults) => ({
          ...prevResults,
          [questionId]: result,
        }));
      }

      setIsAnswered(true);
      setisLoader(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Submission failed. Please try again."
      );
    }
  };

  useEffect(() => {
    const fetchContestData = async () => {
      if (!user || !user._id) {
        console.error("User not available");
        return;
      }

      try {
        const res = await axios.get(
          `https://code-quest-backend.onrender.com/api/v1/contest/getcontest/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data && res.data.contest) {
          const contestData = res.data.contest;
          const userSubmissions = contestData.submissions.filter(
            (submission) => submission.userId === user._id
          );

          if (userSubmissions.length > 0) {
            const answerMap = {};
            userSubmissions.forEach((submission) => {
              answerMap[submission.questionId] = submission.answer;
            });
            setAnswers(answerMap);
            setIsAnswered(true);
          } else {
            setIsAnswered(false);
          }
        } else {
          setIsAnswered(false);
        }
      } catch (err) {
        console.error("Error fetching contest data:", err);
        setIsAnswered(false);
      }
    };

    fetchContestData();
  }, [id, user]);

  const fetchSuggestions = async (value) => {
    try {
      const response = await model.generateContent({
        prompt: value,
        max_tokens: 10,
      });
      return response.data.choices[0].text;
    } catch (err) {
      console.error("Error generating suggestion:", err);
      toast.error("Failed to generate suggestion. Please try again.");
      return '';
    }
  };

  const handleEditorDidMount = (editor, questionId) => {
    editorRefs.current[questionId] = editor;

    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: async (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const suggestions = await fetchSuggestions(textUntilPosition);

        return {
          suggestions: [
            {
              label: 'auto-completion',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: suggestions,
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              },
            },
          ],
        };
      },
    });
  };

  const evaluateAnswer = async (questionId, answer) => {
    try {
      const response = await axios.post(
        `https://code-quest-backend.onrender.com/api/v1/contest/evaluate`,
        { questionId, answer },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data.result;
    } catch (err) {
      console.error("Error evaluating answer:", err);
      return "Evaluation failed. Please try again.";
    }
  };

  if (isLoader) {
    return <Loading />;
  }

  return (
    <>
      {isAnswered === null ? (
        <div>Loading...</div>
      ) : !isAnswered ? (
        <section className="participant-panel">
          <div className="containers1">
            <h2>Submit Your Work</h2>
            <form id="submissionForm" onSubmit={handleSubmit} encType="multipart/form-data">
              {question.map((q) => (
                <div key={q._id} className="form-group">
                  <h3>Q) {q.questionText}</h3>
                  <label className="label1" htmlFor={`submissionMessage-${q._id}`}>
                    Your Answer:
                  </label>
                  <Editor
                    height="200px"
                    defaultLanguage="javascript"
                    value={answers[q._id] || ""}
                    onChange={(value) => handleAnswerChange(q._id, value)}
                    onMount={(editor) => handleEditorDidMount(editor, q._id)}
                  />
                  {compilationResults[q._id] && (
                    <div className="compilation-result">
                      <strong>Compilation Result:</strong> {compilationResults[q._id]}
                    </div>
                  )}
                </div>
              ))}
              <div className="form-group">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : (
        <div className="rsub">Your submission has already been received.</div>
      )}
    </>
  );
};

export default Submission;
