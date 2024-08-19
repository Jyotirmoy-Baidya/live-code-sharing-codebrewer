import axios from 'axios';
import React, { useEffect, useState } from 'react'
import axiosHandler from './AxiosInstance';

const problemStatements = [
    'Problem 1',
    'Problem 2',
    'Problem 3',
    'Problem 4',
    'Problem 5',
    'Problem 6',
    'Problem 7',
]

const ProblemStatementsForVideoConfee = ({ search = '', handleQuestionSharing, setQuestionid }) => {
    const [problemStatementList, setProblemStatementList] = useState([]);
    const fetchAllQuestions = async () => {
        // setLoading(true);
        try {
            const response = await axiosHandler('get', 'question/all');
            setProblemStatementList(response.questions);
            console.log(response.questions);
        } catch (error) {
            console.log(error);
        }
        // if (response.success == true) {
        //     console.log('Questions fetched successfully:', response.data);
        //     // setProblemStatementList(response.questions);
        // }
        // else {
        //     console.error('Error:', response.message);
        // }
        // setLoading(false);
    };

    const setSharingQuestionInLocalHost = (id) => {
        localStorage.setItem('questionid', id);
        console.log(typeof (id));
        setQuestionid(id);
    }


    useEffect(() => {
        fetchAllQuestions();
    }, [])
    return (
        <div className='absolute max-h-96 flex flex-col overflow-scroll top-11 -left-2 w-[65%] border border-slate-600 shadow-neutral-400 rounded design-scrollbar'>
            {
                problemStatementList.filter((ele) => ele.title.toLowerCase().includes(search.toLowerCase())).map((ele, i) => (
                    <React.Fragment key={i}>
                        <div className='flex text-lg uppercase font-semibold tracking-wider bg-slate-950 hover:bg-slate-600  justify-between text-left gap-2 items-center py-3 px-4 problem-block'>
                            <div>
                                {ele.title}
                            </div>
                            <div className='border border-primary text-sm text-primary hover:text-black  py-1 px-3 rounded-md hover:bg-green-500 capitalize hover:shadow hover:shadow-black active:shadow-none font-medium smooth-transition' onClick={() => { handleQuestionSharing(ele); setSharingQuestionInLocalHost(ele._id) }} >
                                Share
                            </div>
                        </div>
                        <hr className='border-slate-600' />
                    </React.Fragment>
                ))
            }


        </div>
    )
}

export default ProblemStatementsForVideoConfee