import tree from "../../assets/mindmap/tree.svg";
import AppleNode from "./AppleNode";

const MOCK_ITEMS = [
    { id: 1, category: "lecture", text: "React", x: 375, y: 306 },
    { id: 2, category: "reading", text: "알고리즘", x: 351, y: 184 },
    { id: 3, category: "project", text: "javascript", x: 551, y: 454 },
    { id: 4, category: "reading", text: "javascriptstudy", x: 201, y: 284 },
];

export default function MindMapView({ isLoading, error, category }) {
    const items = MOCK_ITEMS.filter((item) => item.category === (category || "lecture"));

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>불러오기 실패</div>;

    return (
        <div className="mindmap-view">
            <img src={tree} alt="tree" className="mindmap-tree" />
            {items.map((item) => (
                <div
                    key={item.id}
                    className="mindmap-node"
                    style={{ left: `${item.x}px`, top: `${item.y}px` }}
                >
                    <AppleNode text={item.text} />
                </div>
            ))}
        </div>
    );
}
