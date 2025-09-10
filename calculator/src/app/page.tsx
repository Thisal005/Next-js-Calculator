'use client';
import { useState , useEffect} from "react";


export default function Home() {
  const [results, setResults] = useState("");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);


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

        if (expression.trim() !== "") {
          setHistory((prev) => [{ expr: expression, res: eval(exp).toString() }, ...prev].slice(0, 10));
        }
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

  const clearHistory = () => {
    setHistory([]);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

 
return (
  <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-100 p-4 sm:p-8">
    
    
    {/* Main container with responsive layout */}
    <div className={`flex flex-col lg:flex-row gap-6 items-start justify-center transition-all duration-500 ease-in-out ${
      showHistory ? 'w-full max-w-6xl' : 'w-full max-w-md'
    }`}>
      
      {/* Calculator Section */}
      <div className={`bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 ease-in-out ${
        showHistory ? 'w-full lg:w-2/3' : 'w-full max-w-md'
      }`}>
        
        {/* Display Section */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative">
            <input
              type="text"
              className="w-full text-2xl sm:text-3xl text-purple-800 text-right px-4 py-3 rounded-2xl bg-purple-50/80 border border-purple-200/60 focus:outline-none focus:ring-3 focus:ring-purple-300/40 transition-all duration-200 font-mono tracking-wider shadow-inner"
              value={expression}
              placeholder="0"
              readOnly
              aria-label="Expression"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              className="w-full text-lg sm:text-xl text-right px-4 py-2 rounded-xl bg-violet-50/60 border border-violet-100/60 text-violet-700 font-semibold focus:outline-none font-mono tracking-wider shadow-inner"
              value={results}
              placeholder="Result"
              readOnly
              aria-label="Result"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={toggleHistory}
            className={`flex-1 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm ${
              showHistory 
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200' 
                : 'bg-purple-100 text-purple-600 hover:bg-purple-200 border border-purple-200'
            }`}
            aria-label="Toggle History"
          >
            {showHistory ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Hide History
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
              </span>
            )}
          </button>
          
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-all duration-200 border border-red-100 shadow-sm"
              aria-label="Clear History"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </span>
            </button>
          )}
        </div>

        {/* Calculator Grid */}
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
                  p-3 sm:p-4 rounded-2xl text-lg sm:text-xl font-semibold shadow-sm transition-all duration-150
                  focus:outline-none focus:ring-3 focus:ring-purple-300/40
                  active:scale-95 hover:shadow-md
                  ${isOperator ? "bg-gradient-to-b from-purple-100 to-purple-50 text-purple-700 hover:from-purple-200 hover:to-purple-100 border border-purple-200/60" : "bg-gradient-to-b from-purple-50 to-purple-25 text-purple-800 hover:from-purple-100 hover:to-purple-75 border border-purple-200/60"}
                  ${isEquals ? "bg-purple-600 text-white hover:from-purple-700 hover:to-purple-800 text-xl sm:text-2xl py-3 sm:py-4 shadow-purple-200" : ""}
                  ${isClear ? "bg-gradient-to-b from-red-100 to-red-50 text-red-600 hover:from-red-200 hover:to-red-100 border border-red-200/60" : ""}
                  ${isSqrt ? "bg-gradient-to-b from-violet-100 to-violet-50 text-violet-700 hover:from-violet-200 hover:to-violet-100 border border-violet-200/60" : ""}
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
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm text-xs sm:text-sm text-purple-500 border border-white/40">
            Created by Thisal Thiranjith
          </span>
        </div>
      </div>

      {/* History Section */}
      <div className={`transition-all duration-500 ease-in-out ${
        showHistory 
          ? 'opacity-100 transform translate-x-0 w-full lg:w-1/3' 
          : 'opacity-0 transform translate-x-full w-0 overflow-hidden'
      }`}>
        {showHistory && (
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 h-full min-h-[400px] lg:min-h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Calculation History
              </h2>
            </div>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg className="w-16 h-16 text-purple-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-purple-400 text-sm">No calculations yet</p>
                  <p className="text-purple-300 text-xs mt-1">Your calculation history will appear here</p>
                </div>
              ) : (
                history.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="group p-3 rounded-xl bg-purple-50/60 hover:bg-violet-50/60 border border-purple-100 hover:border-violet-200/60 transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      setExpression(item.expr);
                      setResults(item.res);
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-mono text-purple-600 group-hover:text-purple-800 transition-colors">
                        {item.expr}
                      </div>
                      <div className="text-lg font-mono font-semibold text-violet-700 group-hover:text-violet-800 transition-colors">
                        = {item.res}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

}
