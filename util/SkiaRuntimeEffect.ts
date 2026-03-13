import { Skia } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";

type RuntimeEffectType = ReturnType<typeof Skia.RuntimeEffect.Make>;

export const useSkiaRuntimeEffect = (shaderSource: string, retryIntervalMs = 50): RuntimeEffectType => {
    const [runtimeEffect, setRuntimeEffect] = useState<RuntimeEffectType>(null);

    useEffect(() => {
        let isMounted = true;
        let intervalRef: ReturnType<typeof setInterval> | undefined;

        const tryCreateRuntimeEffect = () => {
            try {
                const nextRuntimeEffect = Skia.RuntimeEffect.Make(shaderSource);

                if (nextRuntimeEffect && isMounted) {
                    setRuntimeEffect(nextRuntimeEffect);
                    return true;
                }
            } catch {
            }

            return false;
        };

        if (!tryCreateRuntimeEffect()) {
            intervalRef = setInterval(() => {
                if (tryCreateRuntimeEffect() && intervalRef) {
                    clearInterval(intervalRef);
                    intervalRef = undefined;
                }
            }, retryIntervalMs);
        }

        return () => {
            isMounted = false;

            if (intervalRef) {
                clearInterval(intervalRef);
            }
        };
    }, [shaderSource, retryIntervalMs]);

    return runtimeEffect;
};