import { redirect } from 'next/navigation';

export default async function Home() {
    redirect('https://play.google.com/store/apps/details?id=com.brun0ne.DailyBug');

    return <main></main>;
};

export const runtime = 'edge';
