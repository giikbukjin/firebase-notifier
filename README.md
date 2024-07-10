# firebase-notifier
Firebase와 React, Spring Boot를 활용한 실시간 공지사항 등록 및 알림 서비스

<br>

## 기능 소개
- 공지사항 메세지 입력 후 전송
- 웹에서 공지사항 목록 표시
- 사용자의 공지사항 확인 여부 확인

<br>

## 사용 기술
- React `18.3.1` : 사용자 인터페이스 구현
- Spring Boot `3.3.1` : 알림 전송 로직 처리
- Firebase `9.23.0` :
  - Cloud Firestore: 공지사항 데이터 저장
  - Authentication: 사용자 인증 및 권한 관리
  
<br>
 
## Firebase 설정
### 프로젝트 구조 설정
- Firebase 콘솔에서 새로운 프로젝트 생성
- Firestore Database를 설정하고 아래와 같은 구조 생성
  ```
  announcements
    └── {announcementId} - 자동 생성
        ├── title: "공지사항 제목"
        ├── content: "공지사항 내용"
        ├── type: "general" 또는 "client1"...
        ├── timestamp: 공지사항 작성 시간
        └── readBy: {
              {token1}: true,
              {token2}: true,
              ...
            }
  users
    └── {userUid} - UID 입력
        ├── name: "관리자 이름"
        └── role: "admin"
  clients
    └── {userUuid} - UUID 입력
        └── name: "사용자 이름(admin, client1 등)"
  ```
  
### 관리자(admin) 계정 지정
- Authentication에서 Google 로그인 방식 활성화
- Authentication -> 사용자 추가 -> 사용자 UID 복사 <br>
  Cloud Firestore -> `users` 컬렉션 -> 문서 ID: 사용자 UID -> `role: "admin"` 필드 입력
  
### 규칙 설정
- Cloud Firestore -> 규칙 설정
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // 모든 사용자에게 읽기 및 쓰기 권한 부여
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```

<br>

## 설치 및 실행
### 비공개 키
- Firebase 콘솔 -> 프로젝트 설정 -> 서비스 계정 -> 비공개 키를 받아 
  `src/main/resources/serviceAccountKey.json`에 넣기
- Firebase 콘솔 -> 프로젝트 설정 -> 일반 -> 내 앱의 npm 코드를 받아 `src/main/frontend/.env`에서 환경변수로 사용하기
  ```
  REACT_APP_API_KEY=
  REACT_APP_AUTH_DOMAIN=
  REACT_APP_PROJECT_ID=
  REACT_APP_STORAGE_BUCKET=
  REACT_APP_MESSAGING_SENDER_ID=
  REACT_APP_APP_ID=
  REACT_APP_MEASUREMENT_ID=
  REACT_APP_VAPID_KEY=
  ```

### 프로젝트 설치 및 실행
1. 프로젝트 클론
   ```
   git clone https://github.com/giikbukjin/firebase-notifier.git
   cd firebase-notifier
   ```
2. 필요한 패키지 설치
   ```
   npm install
   ```
4. Spring Boot Application Run
5. React Server Run
   ```
   npm start
   ```
   
<br>

## 주요 코드
### 로그인 및 인증 (`src/components/auth/Auth.js`)
- AuthProvider 
  - Firebase 인증 상태를 관리하고, admin 계정만 로그인할 수 있도록 처리
  - 로그인된 사용자의 역할(role)을 확인
  
### 공지사항 등록 (`src/components/announcement/AddAnnouncement.js`)
- AddAnnouncement 
  - 관리자(admin)만 접근 가능
  - 전체 발송/특정 대상 발송 선택 가능
  - 공지사항을 작성하고 Firestore에 저장
- handleSubmit
  - 공지사항 등록 시 호출
  - 전체/클라이언트 발송 대상 선택 가능
  
### 공지사항 목록 (`src/components/announcement/AnnouncementList.js`)
- AnnouncementList 
  - 모든 사용자가 접근 가능
  - Firestore에서 공지사항을 실시간으로 받아와 목록을 표시
  
### 알림 토큰 저장 (`src/components/firebase/firebase-init.js`)
- saveTokenToServer 
  - 로그인 시 발급된 FCM 토큰을 Firestore에 저장
  - FCM 토큰 이용해 웹 알림 전송 가능
  
### 공지사항 알림 (`firebase_notifier/controller/AnnouncementController`)
- receiveAnnouncement
  - 공지사항 등록 시 백엔드 콘솔로 내용 표시
