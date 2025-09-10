'use client';
import { useState , useEffect} from "react";


export default function Home() {
  const [results, setResults] = useState("");
  const [expression, setExpression] = useState("");


  useEffect(() => {
    const handleKeyDown = (event : KeyboardEvent) => {
      const {key} = event;
      if(
        (key >= "0" && key <= "9") ||
        ["/", "*", "-", "+", "."].includes(key)
      ){
        handleButtonClick(key);
      }else if (key === "Enter" || key === "="){
        handleButtonClick("=");
      }else if (key.toLocaleLowerCase() == "c" || key === "Backspace"){
        handleButtonClick("C");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expression]);

 const handleButtonClick = (value: string) => {
    if (value === "=") {
      try {
        let exp = expression
          .replace(/%/g, "/100")
          .replace(/√([0-9.]+)/g, "Math.sqrt($1)")
          .replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g, "Math.pow($1,$3)");
        // Allow sqrt at start: √9 or √(9+16)
        exp = exp.replace(/√\(/g, "Math.sqrt(");
        setResults(eval(exp).toString());
      } catch (error) {
        setResults("Error");
      }
    } else if (value === "C") {
      setExpression("");
      setResults("");
    } else if (value === "√") {
      setExpression((prev) => prev + "√");
    } else if (value === "^") {
      setExpression((prev) => prev + "^");
    } else if (value === "%") {
      setExpression((prev) => prev + "%");
    } else {
      setExpression((prev) => prev + value);
    }
  };


  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "C", "+",
    "%", "√", "^", "="
  ];

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <h1 className="text-5xl font-bold mb-8 text-indigo-700 tracking-tight drop-shadow-lg">Calculator</h1>
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm flex flex-col gap-4 border border-indigo-100">
        <div className="flex flex-col gap-2 mb-2">
          <input
            type="text"
            className="w-full text-3xl text-gray-800 text-right px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition mb-1 font-mono tracking-wider"
            value={expression}
            placeholder="0"
            readOnly
            aria-label="Expression"
          />
          <input
            type="text"
            className="w-full text-xl text-right px-4 py-1 rounded-xl bg-gray-50 border border-gray-100 text-indigo-600 font-semibold focus:outline-none mb-1 font-mono tracking-wider"
            value={results}
            placeholder="Result"
            readOnly
            aria-label="Result"
          />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => {
            const isOperator = ["/", "*", "-", "+" , "%", "^"].includes(btn);
            const isEquals = btn === "=";
            const isClear = btn === "C";
            const isSqrt = btn == "√";
            return (
              <button
                key={btn}
                className={`
                  p-4 rounded-2xl text-xl font-semibold shadow-sm transition-all duration-150
                  focus:outline-none focus:ring-2 focus:ring-indigo-300
                  active:scale-95
                  ${isOperator ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
                  ${isEquals ? " bg-indigo-600 text-white hover:bg-indigo-700 mt-2 text-2xl py-3" : ""}
                  ${isClear ? "bg-red-100 text-red-500 hover:bg-red-200" : ""}
                  ${isSqrt ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}
                `}
                onClick={() => handleButtonClick(btn)}
                aria-label={
                  btn === "C"
                    ? "Clear"
                    : btn === "="
                    ? "Equals"
                    : btn === "√"
                    ? "Square Root"
                    : btn === "^"
                    ? "Power"
                    : btn === "%"
                    ? "Percent"
                    : btn
                }
              >
                {btn}
              </button>
            );
          })}
        </div>
        <span className="inline-block px-2 py-1 bg-white/60 rounded-lg shadow-sm text-sm text-gray-600 text-center">Created by Thisal Thiranjith</span>
      </div>
      
    </div>
  );
}
