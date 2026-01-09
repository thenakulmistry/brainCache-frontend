//not used anymore

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function useDebouncedEffect(effect: () => (void | (() => void)), deps: any[], delay: number) {
    useEffect(() => {
        let cleanup: (() => void) | void;
        
        const handler = setTimeout(() => {
            cleanup = effect();
        }, delay);

        return () => {
            clearTimeout(handler);
            if (cleanup) cleanup();
        };
    }, [...deps, delay]);
}
