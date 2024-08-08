import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import WysiwygEditor from "../WysiwygEditor";
import * as client from "../client";
import { updateQuizzes } from "../QuizReducer";

type SelectorProps = {
    question: any;
    setQuestion: React.Dispatch<React.SetStateAction<any>>;
};

export default function MultipleChoiceEditor({ question, setQuestion }: SelectorProps) {
    const { cid, qid } = useParams();
    const [quiz, setQuiz] = useState<any>();

    useEffect(() => {
        setQuestion({
        ...question,
        questionType: "Multiple Choice", 
        answers: ["", "", "", ""], 
        });
    }, [setQuestion]);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchQuiz = async () => {
        try {
            const fetchedQuiz = await client.findQuizById(qid as string);
            setQuiz(fetchedQuiz);
        } catch (error) {
            console.error("Error fetching quiz:", error);
        }
        };

        fetchQuiz();
        console.log(quiz);
    }, [qid]);
    
    const handleAnswerChange = (index: number, value: string) => {
        const updatedAnswers = [...question.answers];
        updatedAnswers[index] = value;
        setQuestion({
            ...question,
            answers: updatedAnswers,
        });
    };

    const addQuestionToQuiz = () => {
        if (quiz) {
        const updatedQuiz = {
            ...quiz,
            points: quiz.points + question.points,
            questions: quiz.questions ? [...quiz.questions, question] : [question]
        };
        setQuiz(updatedQuiz);
        dispatch(updateQuizzes(updatedQuiz));
        client.updateQuiz(updatedQuiz, qid as string);
        }
    };

    return (
        <div id="wd-assignments-editor" className="ms-5">
        <label htmlFor="wd-name" className="mb-2" style={{ marginLeft: "350px" }}>Enter your question and multiple answers, then select the one correct answer.</label>
        <br/>
        <label htmlFor="wd-name" className="mb-2" style={{ marginLeft: "350px" }}><b>Question:</b></label>
        <br />
        <div style={{ width: "800px", height: "400px", marginLeft: "350px" }}>
        <WysiwygEditor
          // onChange={() => {}} 
        />
      </div>
        <br />
        <label htmlFor="wd-name" className="mb-2" style={{ marginLeft: "350px" }}><b>Answers:</b></label>
        <br />
        <div className="col-sm-10" style={{ marginLeft: "350px" }}>
            {[0, 1, 2, 3].map(index => (
                <div key={index} className="form-check">
                    <input
                    className="form-check-input"
                    type="radio"
                    name="gridRadios"
                    id={index.toString()}
                    onChange={() => setQuestion({ ...question, correctAnswer: question.answers[index] })}
                    />
                <input
                    className="form-control mb-2"
                    style={{ width: "250px", height: "50px", color: question.correctAnswer === question.answers[index] ? "green" : "black"}}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={question.answers[index] || `option ${index + 1}`}
                    value={question.answers[index] || ""}
                    />
                </div>
            ))}
        </div>
        

        <hr />
        <div className="col" style={{ marginRight: "500px" }}>
            <div className="wd-flex-row-container float-end me-5">
            <button id="wd-add-assignment-group" className="btn btn-lg btn-secondary me-1 float-end"
                type="button" style={{ color: "black", backgroundColor: "#F5F5F5" }}>
                <Link key={`/Kanbas/Courses/${cid}/Quizzes/${qid}/QuestionEditor`} to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/QuestionEditor`} 
                    style={{ color: "black", textDecoration: "none" }}>
                    Cancel
                </Link>
            </button>
            <button onClick={addQuestionToQuiz} id="wd-add-assignment" className="btn btn-lg btn-danger me-5 float-end">
                <Link key={`/Kanbas/Courses/${cid}/Quizzes/${qid}/QuestionEditor`} to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/QuestionEditor`} 
                    style={{ color: "white", textDecoration: "none" }}>
                    Update Question
                </Link>
            </button>
            </div>
        </div>
        </div>
    );
}

export {};