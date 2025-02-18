import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import { FaArrowCircleLeft, FaCircleNotch } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';





import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import toast from 'react-hot-toast';
import CodingPlayground from '../CodingPlayground';
import CustomDropdown from '../CustomDropDown';
import axiosHandler from '../AxiosInstance';



const options = [
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' }
];

const LiveProblem = ({ questionid = '', editorBoxData, setEditorBoxData, editorData, setEditorData }) => {


    const boilerplateCode = (lang) => {
        switch (lang) {
            case 'java':
                return `class TempCode {
  
}`;
            case 'cpp':
                return `class TempCode {
  
}`;
            default:
                return '';
        }
    };


    // const params = useParams();  
    const [runCodeLoading, setRunCodeLoading] = useState(false);
    const [problem, setProblem] = useState({});
    const [loading, setLoading] = useState(false);

    const [testCasesResult, setTestCaseResult] = useState([]);

    //Code By T
    // const [code, setCode] = useState('');
    const [code, setCode] = useState(boilerplateCode('java'));
    const [language, setLanguage] = useState('java'); // Default to java
    const [input, setInput] = useState(''); // New state for user input
    const [output, setOutput] = useState('');
    const [metrics, setMetrics] = useState({ time: '', memory: '' });
    const [customInput, setCustomInput] = useState(false);
    const [outputBox, setOutputBox] = useState(false);


    // function extractClassName(code) {
    //     const classNameMatch = code.match(/class\s+(\w+)/);
    //     return classNameMatch ? classNameMatch[1] : null;
    // }
    function extractClassName(code) {
        // Regex to match the class that contains the main method
        const mainClassMatch = code.match(/class\s+(\w+)\s+.*\{[^]*?public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*args\s*\)\s*\{[^]*?\}/);

        // If a class with the main method is found, return its name
        if (mainClassMatch) {
            return mainClassMatch[1];
        }

        // Otherwise, return null
        return null;
    }


    const runCodeWithTestCase = async (id) => {


        const className = "TempCode";

        if (className == null) {
            console.log('Error: No class with main method found in your code.');
            setOutput('Error: No class with main method found in your code.');
            return;
        }

        console.log('class name=', className);


        const codepost = convertJavaToJSString(code);
        setRunCodeLoading(true)
        const response = await axiosHandler('post', `question/run/${id}`, { language, code: codepost, className });
        if (response.success == true) {
            setTestCaseResult(response.result);
            toast.success('Output Came', {
                style: {
                    border: '1px solid #1BF1A1',
                    padding: '16px',
                    color: '#1BF1A1',
                    backgroundColor: '#0D1418'
                },
                iconTheme: {
                    primary: '#1BF1A1',
                    secondary: '#0D1418',
                },
            });
        }
        else {
            toast.error("Sorry couldn't run the test cases", {
                style: {
                    border: '1px solid red',
                    padding: '16px',
                    color: 'red',
                    backgroundColor: '#0D1418'
                },
                iconTheme: {
                    primary: 'red',
                    secondary: '#0D1418',
                },
            });
        }
        setRunCodeLoading(false);
    }


    const runCode = async () => {
        // console.log(code);
        // const codepost=`${code}`;
        const codepost = convertJavaToJSString(code);
        const className = "TempCode";
        if (className == null) {
            console.log('Error: No class with main method found in your code.');
            setOutput('Error: No class with main method found in your code.');
            return;
        }

        setRunCodeLoading(true)

        const response = await axiosHandler('POST', 'compiler/execute', {
            language,
            code: codepost,
            input,
            className
        });
        if (response.success === true) {
            setOutput(response.output);
            setMetrics({
                time: response.executionTime,
                memory: response.memoryUsed
            });

            toast.success('Output Came', {
                style: {
                    border: '1px solid #1BF1A1',
                    padding: '16px',
                    color: '#1BF1A1',
                    backgroundColor: '#0D1418'
                },
                iconTheme: {
                    primary: '#1BF1A1',
                    secondary: '#0D1418',
                },
            });
        }
        else {
            setOutput('Error: ' + response.message);
            setMetrics({ time: '', memory: '' });
            toast.error('Error Occured', {
                style: {
                    border: '1px solid red',
                    padding: '16px',
                    color: 'red',
                    backgroundColor: '#0D1418'
                },
                iconTheme: {
                    primary: 'red',
                    secondary: '#0D1418',
                },
            });
        }
        setRunCodeLoading(false);

    };

    function convertJavaToJSString(javaCode) {
        // Step 1: Remove newlines and excessive whitespace
        const singleLineCode = javaCode.replace(/\s+/g, ' ').trim();

        // Step 2: Escape double quotes and backslashes
        const jsCompatibleString = singleLineCode
            .replace(/\\/g, '\\\\')  // Escape backslashes
        // .replace(/"/g, '\\"');   // Escape double quotes

        return jsCompatibleString;
    }

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        setLanguage(selectedLanguage);
    };

    const getLanguageExtension = (lang) => {
        switch (lang) {
            case 'c':
                return cpp();
            case 'cpp':
                return cpp();
            case 'java':
                return java();
            case 'python':
                return python();
            default:
                return cpp(); // Default to C++ if no match
        }
    };


    const fetchQuestionDetails = async (id) => {
        setLoading(true);
        console.log('questiontofetch' + id);
        if (!id) {
            console.error('No ID provided to fetch question details.');
            return null;
        }
        const response = await axiosHandler('get', `/question/${id}`);
        if (response.success == true) {
            setProblem(response.question);
        }
        else {
            console.error('Error: ', response.message);
        }
        setLoading(false);

    };



    useEffect(() => {
        console.log("check" + questionid);
        if (questionid != '') {

            //i want to get the vlue of the quesid field from session storsge
            fetchQuestionDetails(questionid);
        }
    }, [questionid])


    return (
        <>
            {
                loading === true ?
                    <div className='font-helvetica flex text-2xl text-white px-16 pt-4 pb-3'>
                        <div className='flex gap-4 items-center'>Loading <AiOutlineLoading3Quarters className='text-lg loading-spin' /></div>
                    </div>
                    :
                    Object.keys(problem).length === 0 ?
                        <div className="font-helvetica flex text-2xl text-white px-16 pt-4 pb-3">
                            <div className='flex grow-0 items-center gap-4'>
                                <NavLink to={`/problemstatements`}><FaArrowCircleLeft className='text-2xl text-primary' /></NavLink>
                                Sorry could not load the question
                            </div>
                        </div> :
                        <div className="font-helvetica flex flex-col gap-2 text-white px-2 pt-4 pb-3 h-[37rem]">
                            <div className=' flex gap-4 items-center'>
                                <div className={`text-xl flex items-center gap-4`}>{problem.title} <span className={`p-1 rounded text-xs border ${problem.difficulty == 'Easy' ? 'border-primary' : problem.difficulty == 'Medium' ? 'border-blue-400' : 'border-red-400'}`}>{problem.difficulty}</span></div>
                            </div>
                            <div className='flex flex-col text-justify problem-statement'>
                                <span className='text-lg font-semibold mt-2 text-gray-400 font-plex-mono '>Description</span>
                                {problem.description}
                                <span className='text-lg font-semibold mt-4 text-gray-400 font-plex-mono'>Constraints</span>
                                <div className='flex flex-col'>
                                    {
                                        problem.constraints.map((ele, i) => (
                                            <div key={i}>
                                                {i + 1} {ele}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='flex items-center justify-between'>
                                {/* <div className='border border-gray-200 py-1 px-8 rounded-md'>Select</div> */}
                                {/* Language Selector */}
                                <div className="flex items-center">
                                    <label htmlFor="language" className="mr-2 text-sm">Select Language :</label>
                                    <CustomDropdown
                                        options={options}
                                        value={language}
                                        onChange={setLanguage}
                                    />
                                </div>
                                <div className='bg-blue-600 h-10 w-24 flex justify-center items-center rounded-md active:bg-blue-800 cursor-pointer' onClick={() => {
                                    if (customInput) runCode();
                                    else runCodeWithTestCase(problem._id);
                                }
                                }>{runCodeLoading ? <AiOutlineLoading3Quarters className='text-lg loading-spin' /> : "Run Code"}</div>
                            </div>
                            <CodingPlayground code={code} setCode={setCode} language={language} input={input} setInput={setInput} output={output} metrics={metrics} getLanguageExtension={getLanguageExtension} customInput={customInput} setCustomInput={setCustomInput} testCasesResult={testCasesResult} editorBoxData={editorBoxData} setEditorBoxData={setEditorBoxData} editorData={editorData} setEditorData={setEditorData} />


                        </div>
            }
        </>
    )
}

export default LiveProblem