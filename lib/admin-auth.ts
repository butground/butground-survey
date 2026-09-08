/**
 * ⚠️ 관리자 페이지(/admin) 기본 비밀번호. Vercel 환경변수 ADMIN_PASSWORD를 등록하면
 * 이 기본값 대신 그 값이 사용됨. 실제 운영에서는 반드시 ADMIN_PASSWORD를 등록해서
 * 이 기본값을 쓰지 않는 것을 권장함 (이 파일은 저장소에 커밋되어 있어 기본값이 공개되어 있음).
 */
const DEFAULT_ADMIN_PASSWORD = 'butground00';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

export function isValidAdminKey(key: string | null): boolean {
  return !!key && key === getAdminPassword();
}
