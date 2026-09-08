import { SHEET_COLUMNS, toRow } from '@/lib/sheets';
import type { StoredSubmission } from '@/types';

function toRows(submissions: StoredSubmission[]): (string | number)[][] {
  return [
    [...SHEET_COLUMNS],
    ...submissions.map((s) => toRow(s, s.submittedAt)),
  ];
}

/** 엑셀에서 한글이 깨지지 않도록 UTF-8 BOM을 붙인 CSV 문자열 생성 */
export function buildCsv(submissions: StoredSubmission[]): string {
  const rows = toRows(submissions);
  const csvBody = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  return '﻿' + csvBody;
}

/** xlsx 워크북을 Buffer로 생성 (동적 import: 이 함수를 실제로 쓸 때만 xlsx 패키지를 로드) */
export async function buildXlsx(submissions: StoredSubmission[]): Promise<Buffer> {
  const XLSX = await import('xlsx');
  const rows = toRows(submissions);
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '응답');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}
