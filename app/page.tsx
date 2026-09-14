import { redirect } from 'next/navigation';

// 이 브랜치는 설문(survey)과 별도로 배포되는 "소감 DB" 전용 배포라서,
// 루트로 들어오면 바로 소감 입력 페이지로 보낸다.
export default function Page() {
  redirect('/feedback');
}
