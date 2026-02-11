import Header from "../../components/common/Header";
import { useState } from "react";

const initialGoals = [
    {
        id: "g1",
        title: "파이썬 기초 완주",
        tasks: [
            { id: "t1", text: "파이썬 기초 코딩하기", done: true },
            { id: "t2", text: "파이썬 기초 코딩하기", done: false },
            { id: "t3", text: "파이썬 기초 코딩하기", done: false },
            { id: "t4", text: "파이썬 기초 코딩하기", done: false },
        ],
        collapsed: false,
    },
    {
        id: "g2",
        title: "트리플에스 목표",
        tasks: [],
        collapsed: true,
    },
];

const GoalManage = () => {
    const [goals, setGoals] = useState(initialGoals);
    const [page, setPage] = useState(1);

    return (
        <div>
            <Header
                variant="goals"
                addLabel="새 목표 추가"
                title="목표 관리"
                subtitle="목표를 설정하고 세부 과제를 추가하여 진행 상황을 추적하세요."
                // onAdd={}
            />
        </div>
    );
};

export default GoalManage;
