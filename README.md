# Ravit Nuxt - Cloudflare Workers

Nuxt 4와 Cloudflare Workers를 사용한 간단한 헬로월드 애플리케이션입니다.

## 🚀 기능

- **Nuxt 4**: 최신 Nuxt 프레임워크
- **Cloudflare Workers**: 전 세계 엣지에서 실행
- **반응형 디자인**: 모던하고 아름다운 UI
- **인터랙티브 요소**: 클릭 카운터 기능
- **자동 배포**: GitHub Actions를 통한 CI/CD

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **프로덕션 빌드**
   ```bash
   npm run build
   ```

4. **미리보기**
   ```bash
   npm run preview
   ```

## ☁️ Cloudflare Workers 배포

### 자동 배포 (권장)

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다:

1. **GitHub 저장소에 푸시**
   ```bash
   git add .
   git commit -m "Update app"
   git push origin main
   ```

2. **자동 배포 확인**
   - GitHub Actions 탭에서 배포 진행 상황 확인
   - 성공 시 Cloudflare Workers에서 앱 접근 가능

### 수동 배포 (선택사항)

로컬에서 수동으로 배포하려면:

1. **Wrangler CLI 설치**
   ```bash
   npm install -g wrangler
   ```

2. **Cloudflare 로그인**
   ```bash
   wrangler login
   ```

3. **배포**
   ```bash
   npm run build
   wrangler deploy
   ```

## 🔑 GitHub Secrets 설정

GitHub Actions가 작동하려면 다음 secrets를 설정해야 합니다:

1. **GitHub 저장소 → Settings → Secrets and variables → Actions**
2. **New repository secret** 클릭
3. 다음 secrets 추가:

   - `CLOUDFLARE_API_TOKEN`: Cloudflare API 토큰
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 계정 ID

### Cloudflare API 토큰 생성 방법

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
2. **My Profile** → **API Tokens**
3. **Create Token** → **Custom token**
4. 권한 설정:
   - **Account**: Workers Scripts (Edit)
   - **Zone**: Workers Routes (Edit)
5. 토큰 생성 후 복사하여 GitHub secrets에 저장

## 📁 프로젝트 구조

```
ravit-nuxt/
├── .github/workflows/     # GitHub Actions 워크플로우
│   └── deploy.yml         # 자동 배포 설정
├── app/                    # Nuxt 앱 소스 코드
│   └── app.vue            # 메인 앱 컴포넌트
├── public/                 # 정적 파일
├── .output/                # 빌드 출력 (Workers용)
│   ├── server/            # 서버 코드
│   └── public/            # 정적 파일
├── nuxt.config.ts          # Nuxt 설정
├── wrangler.toml           # Cloudflare Workers 설정
└── package.json            # 프로젝트 의존성
```

## 🌟 주요 특징

- **빠른 개발**: Hot Module Replacement (HMR)
- **타입 안전성**: TypeScript 지원
- **최적화된 빌드**: 자동 코드 분할 및 최적화
- **SEO 친화적**: 서버 사이드 렌더링 지원
- **엣지 실행**: Cloudflare Workers에서 전 세계에 배포
- **자동화**: 커밋 시 자동 배포

## �� 라이선스

MIT License
