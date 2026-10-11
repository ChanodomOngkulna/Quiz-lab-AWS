import { error } from '@sveltejs/kit';
import { topics } from '$lib/data/topics';

export function entries() {
	return topics.map((t) => ({ topic: t.slug }));
}

export function load({ params }) {
	const topic = topics.find((t) => t.slug === params.topic);
	if (!topic) error(404, 'ไม่พบหัวข้อนี้');
	return { topic };
}
