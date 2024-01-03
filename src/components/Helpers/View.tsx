import { useState } from "react";

export default function View({ setView }: { setView: (view: string) => void }) {
    type IconType = "card" | "list";
    const [icon, setIcon] = useState<IconType>("card");

    const images = {
        card: {
            path: "./card.png",
            type: "card",
        },
        list: {
            path: "./list.png",
            type: "list",
        },
    };

    const handleClick = () => {
        setIcon(icon === "card" ? "list" : "card");
        setView(icon === "card" ? "card" : "list");
    };

    return (
        <button onClick={handleClick}>
            <img
                src={images[icon].path}
                className="h-[40px] p-1 rounded-md"
            />
        </button>
    );
}
