# 태스크 기반 Git 커밋 자동화 슬래시 커맨드

이 슬래시 커맨드는 vooster-ai 태스크 ID를 기반으로 자동화된 git commit 메시지를 생성하고 커밋을 수행합니다.

## 사용법
```
/commit-task T-XXX
```

## 워크플로우

### 1단계: 태스크 정보 조회
- 입력받은 태스크 ID로 vooster-ai에서 태스크 정보를 조회합니다
- 태스크 요약(summary)을 추출합니다

### 2단계: Git 상태 확인
- `git status` 실행하여 변경된 파일 확인
- `git diff --cached` 실행하여 staged 변경사항 확인
- 커밋할 내용이 있는지 검증

### 3단계: 커밋 메시지 기본 구조 생성
```
T-XXX: [태스크 요약]

[보충 설명 - 사용자 입력 대기]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 4단계: 사용자 입력 처리
- 보충 설명을 사용자로부터 입력받습니다
- 빈 값인 경우 기본 설명을 사용합니다

### 5단계: 최종 커밋 실행
- 완성된 커밋 메시지로 `git commit` 실행
- 성공/실패 결과를 사용자에게 피드백

## 에러 처리
- 태스크 ID가 존재하지 않는 경우
- Git repository가 아닌 경우  
- 커밋할 변경사항이 없는 경우
- 커밋 실행 실패 시

## 예시 결과
```
T-010: 목표 관리 UI/UX 설계 및 구현

목표 목록, 상세, 생성/수정 페이지와 저축 내역 관리 기능을 완전히 구현했습니다. React Query를 활용한 데이터 관리와 Supabase 실시간 동기화를 통해 안정적인 사용자 경험을 제공합니다.

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

이 파일은 슬래시 커맨드의 동작을 정의합니다. Claude Code가 이 파일을 참조하여 `/commit-task` 명령을 실행할 때 위의 워크플로우를 따라 작업을 수행합니다.