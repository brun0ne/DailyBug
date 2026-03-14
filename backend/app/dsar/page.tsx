import { redirect } from 'next/navigation';

export default async function DSAR() {
    redirect('https://app.termly.io/notify/e2f04ac2-c1c8-4f2d-858e-58ae57bdc60d');

    return <main></main>;
}

export const runtime = 'edge';
