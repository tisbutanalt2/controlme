import { useEffect } from 'react';

export default function useTransparentPassthrough(focus: () => void, blur: () => void) {
    useEffect(() => {
        let currentTimeout: NodeJS.Timeout|null = null;
        let lastCall: 'blur'|'focus'|null = null;

        const listener = (e: MouseEvent) => {
            const target = document.elementFromPoint(e.clientX, e.clientY);
            const element = target?.getAttribute('data-hover')? target: null;

            if (element) {
                currentTimeout && clearTimeout(currentTimeout);
                lastCall !== 'focus' && (currentTimeout = setTimeout(() => {
                    focus();
                    lastCall = 'focus';
                }, 100));
            }

            else {
                currentTimeout && clearTimeout(currentTimeout);
                currentTimeout = setTimeout(() => {
                    blur();
                    lastCall = 'blur';
                }, 100)
            }
        };

        window.addEventListener('mousemove', listener);
        return () => window.removeEventListener('mousemove', listener);
    }, [focus, blur]);
}