import { Button } from "flowbite-react";
import { useCallback, useTransition } from "react";

export type LoadButtonProps = {
    text: string
    loadingText: string
    gradient?: string

    onClick: () => void
};

const LoadButton = ({text, loadingText, gradient, onClick}: LoadButtonProps) => {
    const [isPending, startTransition] = useTransition();

    const onClickCallback = useCallback(() => {
        startTransition(onClick);
    }, [onClick]);

    return (
        <Button pill outline gradientDuoTone={gradient} disabled={isPending} onClick={onClickCallback}>{isPending ? loadingText : text}</Button>
    ) 
};

export default LoadButton;
