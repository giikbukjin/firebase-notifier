# firebase-notifier
Firebase와 React, Spring Boot를 활용한 실시간 공지사항 등록 및 알림 서비스

<br>

## 기능 소개
- 공지사항 등록: 관리자 계정으로 공지사항을 작성하고 Firebase Firestore에 저장
- 공지사항 목록 표시: 웹 페이지에서 공지사항 목록을 실시간으로 확인 가능
- 알림 전송: 새로운 공지사항 등록 시 알림 전송

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
    ├── general
    │   └── announcements
    |       └── {announcementId}
    └── client1
        └── announcements
            └── {announcementId}
  users
    └── {userId}
  tokens
    └── {userId}
  ```
  
### 관리자(admin) 계정 지정
- Authentication에서 Google 로그인 방식 활성화
- Authentication -> 사용자 추가 -> 사용자 UID 복사 <br>
  Cloud Firestore -> `users` 컬렉션 -> 문서 ID: 사용자 UID -> `role: "admin"` 필드 입력
  
### 규칙 설정
- Cloud Firestore -> 규칙 설정
  ```
  // 모든 권한을 허용해 놓은 개발용 규칙
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /announcements/{client}/{announcementId} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.token.admin == true;
      }
    }
  }
  ```

<br>

## 설치 및 실행
### 비공개 키
- Firebase 콘솔 -> 프로젝트 설정 -> 서비스 계정 -> 비공개 키를 받아 
  `src/main/resources/serviceAccountKey.json`에 넣기
- Firebase 콘솔 -> 프로젝트 설정 -> 일반 -> 내 앱의 npm 코드를 받아 `src/main/.env`에서 환경변수로 사용하기
  ```JAVASCRIPT
  // firebase_init.js
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  };
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
  ```
  알림 권한: granted
  FCM 토큰: ${token}
  
  사용자 역할 가져오기 성공: admin
  로그인한 사용자 역할: ${userRole}
  관리자로 로그인되었습니다.
  ```
  
### 공지사항 등록 (`src/components/announcement/AddAnnouncement.js`)
- AddAnnouncement 
  - 관리자(admin)만 접근 가능
  - 전체 발송/특정 대상 발송 선택 가능
  - 공지사항을 작성하고 Firestore에 저장
- handleSubmit
  - 공지사항 등록 시 호출
  - 전체/클라이언트 발송 대상 선택 가능
  ```
  공지 등록 성공
  ```
  
### 공지사항 목록 (`src/components/announcement/AnnouncementList.js`)
- AnnouncementList 
  - 모든 사용자가 접근 가능
  - Firestore에서 공지사항을 실시간으로 받아와 목록을 표시
  ```
  공지사항을 불러오는 중...
  전체 공지사항 데이터를 불러왔습니다.
  클라이언트 1 공지사항 데이터를 불러왔습니다.
  ```
  
### 알림 토큰 저장 (`src/components/firebase/firebase-init.js`)
- saveTokenToServer 
  - 로그인 시 발급된 FCM 토큰을 Firestore에 저장
  - FCM 토큰 이용해 웹 알림 전송 가능
  ```
  토큰이 Firestore에 성공적으로 저장되었습니다.
  토큰이 서버에 저장되었습니다. UID: ${uid}
  ```
  
### 공지사항 알림 (`firebase_notifier/controller/AnnouncementController`)
- receiveAnnouncement
  - 공지사항 등록 시 백엔드 콘솔로 내용 표시
  ```
  === 공지사항 ===
  공지사항 제목: {title}
  공지사항 내용: {content}
  작성자: {author}
  타임스탬프: {timestamp}
  ```
