'use client';

import { useEffect, useState } from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { getCombinedQuizsets } from "@/app/action/combainQuizset";

const QuizSets = () => {
  const [quizsets, setQuizsets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCombinedQuizsets();
      setQuizsets(data);
    };

    fetchData();
  }, []);

  const mappedQuizSets = quizsets.map(q => ({
    id: q.id,
    title: q.title,
    isPublished: q.status, // assuming 'status' is 'active' or not
    totalQuiz: q.quizzes?.length || 0,   // use `quizzes` instead of `quizIds`
  }));

  console.log(mappedQuizSets);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={mappedQuizSets} />
    </div>
  );
};

export default QuizSets;
