import { ReactNode } from "react";
import { ItemType } from "../../util/UserContext";

export type CustomItemModal = (props: {
    visible: boolean
    hide: () => void
    
    item: ItemType
    image?: any

    children?: ReactNode
}) => React.JSX.Element;
