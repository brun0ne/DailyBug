"use client"
import { ReactNode, useCallback, useState } from "react";

type IconButtonProps = {
    children: ReactNode,
    onHoverColor: string,
    onClick?: () => any
}

const IconButton = (props: IconButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const onMouseEnterCallback = useCallback(() => {
        setIsHovered(true);
    }, []);
    const onMouseLeaveCallback = useCallback(() => {
        setIsHovered(false);
    }, []);

    return (
        <button onClick={props.onClick ?? (() => {})} onMouseEnter={onMouseEnterCallback} onMouseLeave={onMouseLeaveCallback}>
            <svg 
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={isHovered ? 1.7 : 1.5}
                stroke={isHovered ? props.onHoverColor : "currentColor"}
                className="w-6 h-6"
            >
                {props.children}
            </svg>
        </button>
    );
};

export default IconButton;
