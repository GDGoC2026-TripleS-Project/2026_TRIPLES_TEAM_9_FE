import { useMemo } from "react";
import tree from "../../assets/mindmap/tree.svg";
import LoadingState from "../common/LoadingState";
import AppleNode from "./AppleNode";

const toPositionedNodes = (nodes = []) => {
    const limited = nodes.slice(0, 18);
    const total = Math.max(1, limited.length);

    return limited.map((node, index) => {
        if (index === 0) {
            return {
                ...node,
                x: 58,
                y: 56,
            };
        }

        const ringIndex = index - 1;
        const angle = (Math.PI * 2 * ringIndex) / Math.max(1, total - 1);
        const radius = 20 + (ringIndex % 4) * 7;

        return {
            ...node,
            x: 50 + Math.cos(angle) * radius,
            y: 48 + Math.sin(angle) * (radius * 0.72),
        };
    });
};

export default function MindMapView({ nodes = [], isLoading, error, onNodeClick }) {
    const positionedNodes = useMemo(() => toPositionedNodes(nodes), [nodes]);

    if (isLoading) {
        return (
            <div className="mindmap-view">
                <LoadingState
                    title="지식나무를 불러오는 중입니다"
                    description="학습 흐름을 정리하고 있어요."
                    className="mindmap-view-loading"
                />
            </div>
        );
    }
    if (error) return <div>불러오기 실패</div>;

    return (
        <div className="mindmap-view">
            <img src={tree} alt="tree" className="mindmap-tree" />
            {positionedNodes.map((node) => (
                <div
                    key={String(node.id)}
                    className="mindmap-node"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    role="button"
                    tabIndex={0}
                    onClick={() => onNodeClick?.(node)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onNodeClick?.(node);
                        }
                    }}
                >
                    <AppleNode text={node.label} />
                </div>
            ))}
        </div>
    );
}
