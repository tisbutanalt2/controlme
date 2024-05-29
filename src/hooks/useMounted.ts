import { useEffect, useState } from 'react';

export default function useMounted() {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        if (mounted) return;
        setMounted(true);
    }, [mounted]);

    return mounted;
}