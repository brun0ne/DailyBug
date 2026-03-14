import { redirect } from 'next/navigation';

export default async function Feedback() {
    redirect('https://docs.google.com/forms/d/e/1FAIpQLSdyvWVxW6BY7ieEqo6JD164InXD_EvUBT4D3Pi6w9PnQMvMsg/viewform?usp=sf_link');

    return <main></main>;
}

export const runtime = 'edge';
