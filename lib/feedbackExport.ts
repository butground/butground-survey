import type { FeedbackEntry } from '@/types';

const COLUMNS = ['날짜', '이름', '소감 내용', '등록시각'] as const;

function toRow(entry: FeedbackEntry): string[] {
  return [entry.date, entry.name, entry.content, new Date(entry.createdAt).toLocaleString('ko-KR')];
}

/** 엑셀에서 한글이 깨지지 않도록 UTF-8 BOM을 붙인 CSV 문자열 생성 */
export function buildFeedbackCsv(entries: FeedbackEntry[]): string {
  const rows = [[...COLUMNS], ...entries.map(toRow)];
  const csvBody = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  return '﻿' + csvBody;
}
