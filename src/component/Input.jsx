import { useState, useMemo } from "react";
import Topic from "./Topic";
import { useDispatch, useSelector } from "react-redux";
import { isLoading } from "../redux/loaderSlice";
import { GoogleGenerativeAI } from "@google/generative-ai";
import html2pdf from "html2pdf.js";

const apiKey = import.meta.env.VITE_SOME_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const Input = () => {
  const [input, setInput] = useState("");
  const [outputData, setOutputData] = useState("");
  const [message, setMessage] = useState("");
  const loader = useSelector((state) => state.load.loading);
  const dispatch = useDispatch();

  const generate = async () => {
    try {
      if (!input.trim()) {
        return setMessage("Please Enter a Topic");
      }
      
      setMessage('');
      setOutputData("");
      dispatch(isLoading(true));

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = input.trim();
      setInput("");

      const result = await model.generateContentStream([prompt]);
      dispatch(isLoading(false));

      for await (const chunk of result.stream) {
        setOutputData((prevData) => prevData + chunk.text());
      }
    } catch (error) {
      console.error("Error generating content:", error);
      dispatch(isLoading(false));
    }
  };

  const renderSections = useMemo(() => {
    return outputData
      .split("\n\n")
      .map((section, index) => {
        if (section.startsWith("**")) {
          return <h2 className="heading" key={index}>{section.replace(/\*\*/g, "")}</h2>;
        } else if (section.startsWith("*")) {
          return (
            <ul key={index}>
              {section.split("\n").map((item, i) => (
                <li key={i}>{item.replace(/^\* /, "")}</li>
              ))}
            </ul>
          );
        } else {
          return <p key={index}>{section}</p>;
        }
      });
  }, [outputData]);

  const downloadPdf = () => {
    try {
      const pdfElement = document.querySelector(".outputdata");
      html2pdf().from(pdfElement).save("output.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  

  return (
    <>
      <div className="search-bar">
        <Topic />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="form-control"
          type="text"
          id="topicInput"
          placeholder="Enter topic"
        />
        <div className="search-bar-item"></div>
        <div className="mic-container">
          <span className="send" onClick={generate}>
            Send
          </span>
        </div>
      </div>
      <div className="ass">Assignment</div>

      <div className="mt-3" id="textOutput">
        <div id="empty"></div>
        {message && <div className="message">{message}</div>}
        {loader && <div className="loader" id="loader">Generating..</div>}
        {outputData && <div className="outputdata">{renderSections}</div>}
      </div>

      <div className="container-btn">
        <div className="horizontally"></div>
        <div className="buttons-2">
          <button id="downloadPdfBtn" onClick={downloadPdf}>
            Download
          </button>
          <button id="regenerateBtn">
            <div id="regenerateloader"></div>
            Regenerate
          </button>
        </div>
      </div>
    </>
  );
};

export default Input;
