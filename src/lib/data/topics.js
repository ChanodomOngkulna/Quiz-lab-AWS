import dynamodb from '$lib/data/summaries/dynamodb.json';
import efs from '$lib/data/summaries/efs.json';
import iamSecurity from '$lib/data/summaries/iam-security.json';
import autoScaling from '$lib/data/summaries/auto-scaling.json';
import haWeb from '$lib/data/summaries/ha-web.json';
import comparison from '$lib/data/summaries/comparison.json';
import ragLangchain from '$lib/data/summaries/rag-langchain.json';
import subnetting from '$lib/data/summaries/subnetting.json';

const meta = {
	dynamodb: {
		kicker: 'AWS Cloud Quest · แลป 1',
		desc: 'Table, item, attribute และการออกแบบ partition key + sort key ของฐานข้อมูล NoSQL แบบ managed'
	},
	efs: {
		kicker: 'AWS Cloud Quest · แลป 2',
		desc: 'Shared file system ผ่าน NFS ที่ให้ EC2 หลายเครื่องใช้ไฟล์ชุดเดียวกัน เทียบกับ EBS และ S3'
	},
	'iam-security': {
		kicker: 'AWS Cloud Quest · แลป 3',
		desc: 'User, group, role, policy, หลัก least privilege และบริการความปลอดภัยที่ต้องแยกให้ออก'
	},
	'auto-scaling': {
		kicker: 'AWS Cloud Quest · แลป 4',
		desc: 'Auto Scaling group, launch template, min/desired/max, health check และ scaling policy'
	},
	'ha-web': {
		kicker: 'AWS Cloud Quest · แลป 5',
		desc: 'ALB, target group, health check และการออกแบบ Multi-AZ ให้ทนต่อการล่มของศูนย์ข้อมูล'
	},
	'rag-langchain': {
		kicker: 'Google Skill & LangChain',
		desc: 'แนวคิด RAG, การแก้ hallucination และ component ของ LangChain ตั้งแต่ loader ถึง retrieval chain'
	},
	subnetting: {
		kicker: 'พื้นฐานเครือข่าย',
		desc: 'สูตร 2 ยกกำลัง h ลบ 2, block size, ตาราง CIDR และวิธีหา network ID / broadcast / usable range'
	},
	comparison: {
		kicker: 'ภาพรวมก่อนสอบ',
		desc: 'ตารางเลือกบริการจากสถานการณ์ คำถามทบทวนสั้น เช็กลิสต์ก่อนส่งแล็บ และแหล่งอ้างอิง AWS'
	}
};

export const topics = [
	dynamodb,
	efs,
	iamSecurity,
	autoScaling,
	haWeb,
	ragLangchain,
	subnetting,
	comparison
].map((t) => ({ ...t, ...meta[t.slug] }));

export const topicGroups = [
	{
		label: 'AWS Cloud Quest',
		slugs: ['dynamodb', 'efs', 'iam-security', 'auto-scaling', 'ha-web']
	},
	{ label: 'AI และระบบสืบค้น', slugs: ['rag-langchain'] },
	{ label: 'เครือข่ายพื้นฐาน', slugs: ['subnetting'] },
	{ label: 'ภาพรวมก่อนสอบ', slugs: ['comparison'] }
];

export const categories = [
	{ id: 'aws', label: 'AWS Cloud', count: 40, href: '/summary/comparison' },
	{ id: 'rag', label: 'RAG & LangChain', count: 30, href: '/summary/rag-langchain' },
	{ id: 'subnet', label: 'IP Subnetting', count: 30, href: '/summary/subnetting' }
];

export function getTopic(slug) {
	return topics.find((t) => t.slug === slug) ?? null;
}
