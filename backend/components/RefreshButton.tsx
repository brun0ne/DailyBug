'use client'

import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export default function RefreshButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const transitionCallback = useCallback(() => {
        startTransition(() => {
            router.refresh();
        })
    }, [router]);

    return (
        <Button pill outline gradientDuoTone="purpleToBlue" disabled={isPending} onClick={transitionCallback}>{isPending ? 'Refreshing...' : 'Refresh'}</Button>
    )
}
