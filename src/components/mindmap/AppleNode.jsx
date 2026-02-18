import apple from "../../assets/mindmap/apple.svg";
import "../../styles/mindmap/AppleNode.css";

export default function AppleNode({ text }) {
    return (
        <div className="apple-node">
            <img src={apple} alt="apple" className="apple-img" />
            <span className="apple-text">{text}</span>
        </div>
    );
}
