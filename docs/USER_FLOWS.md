# 사용자 흐름 (User Flows)

바이브코딩 커뮤니티 플랫폼의 주요 사용자 흐름을 Mermaid 다이어그램으로 시각화한 문서입니다.

---

## 1. 인증 흐름 (Authentication Flow)

### 1.1 회원가입 및 로그인

```mermaid
flowchart TD
    Start([사용자 방문]) --> CheckAuth{로그인<br/>상태?}
    CheckAuth -->|Yes| Dashboard[대시보드 접근]
    CheckAuth -->|No| Landing[랜딩 페이지]

    Landing --> AuthChoice{인증 방법<br/>선택}

    AuthChoice -->|OAuth| OAuthProvider{OAuth<br/>제공자 선택}
    OAuthProvider -->|GitHub| GitHubAuth[GitHub 인증]
    OAuthProvider -->|Google| GoogleAuth[Google 인증]

    GitHubAuth --> OAuthCallback[OAuth 콜백]
    GoogleAuth --> OAuthCallback
    OAuthCallback --> CreateSession[세션 생성]

    AuthChoice -->|이메일| EmailForm[이메일/비밀번호<br/>입력]
    EmailForm --> ValidateEmail{유효성<br/>검증}
    ValidateEmail -->|실패| EmailForm
    ValidateEmail -->|성공| CheckExisting{기존 사용자?}

    CheckExisting -->|Yes| Login[로그인 처리]
    CheckExisting -->|No| Signup[회원가입 처리]

    Login --> HashCheck{비밀번호<br/>일치?}
    HashCheck -->|No| LoginError[로그인 실패]
    LoginError --> EmailForm
    HashCheck -->|Yes| CreateSession

    Signup --> HashPassword[비밀번호 해싱]
    HashPassword --> CreateUser[사용자 생성]
    CreateUser --> CreateSession

    CreateSession --> Dashboard
    Dashboard --> End([플랫폼 이용])
```

---

## 2. 커뮤니티 게시글 흐름 (Community Post Flow)

### 2.1 게시글 작성 및 상호작용

```mermaid
flowchart TD
    Start([커뮤니티 접속]) --> AuthCheck{로그인<br/>여부?}
    AuthCheck -->|No| LoginPrompt[로그인 유도]
    LoginPrompt --> End1([종료])

    AuthCheck -->|Yes| CommunityMain[커뮤니티 메인]

    CommunityMain --> UserAction{사용자<br/>행동}

    UserAction -->|게시글 목록| CategorySelect[카테고리 선택]
    CategorySelect --> FilterSort{필터/정렬}
    FilterSort --> PostList[게시글 목록 표시]
    PostList --> PostClick{게시글<br/>클릭?}
    PostClick -->|Yes| PostDetail
    PostClick -->|No| PostList

    UserAction -->|게시글 작성| NewPostBtn[글쓰기 버튼]
    NewPostBtn --> EditorPage[에디터 페이지]

    EditorPage --> FillForm[폼 작성]
    FillForm --> FormContent{작성 내용}
    FormContent -->|카테고리| CategoryChoice[카테고리 선택]
    FormContent -->|제목| TitleInput[제목 입력<br/>min: 10자]
    FormContent -->|본문| ContentEditor[Tiptap 에디터]
    ContentEditor --> RichText{리치 텍스트<br/>기능}
    RichText -->|텍스트| TextFormat[서식 적용]
    RichText -->|코드| CodeBlock[코드 블록]
    RichText -->|이미지| ImageUpload[이미지 업로드<br/>max: 5MB]
    FormContent -->|태그| TagInput[태그 입력<br/>max: 5개]

    CategoryChoice --> ValidateForm
    TitleInput --> ValidateForm
    TextFormat --> ValidateForm
    CodeBlock --> ValidateForm
    ImageUpload --> ValidateForm
    TagInput --> ValidateForm

    ValidateForm{유효성<br/>검증} -->|실패| ValidationError[에러 표시]
    ValidationError --> FillForm
    ValidateForm -->|성공| SubmitPost[게시글 제출]

    SubmitPost --> SaveDB[(DB 저장)]
    SaveDB --> PostDetail[게시글 상세]

    PostDetail --> PostActions{게시글<br/>액션}

    PostActions -->|투표| VoteAction{투표 선택}
    VoteAction -->|Upvote| Upvote[찬성 투표]
    VoteAction -->|Downvote| Downvote[반대 투표]
    Upvote --> UpdateVotes[투표 수 업데이트]
    Downvote --> UpdateVotes
    UpdateVotes --> PostDetail

    PostActions -->|댓글| CommentForm[댓글 작성]
    CommentForm --> CommentValidate{댓글<br/>유효성}
    CommentValidate -->|실패| CommentForm
    CommentValidate -->|성공| SaveComment[(댓글 저장)]
    SaveComment --> PostDetail

    PostActions -->|공유| SharePost[URL 복사]
    SharePost --> PostDetail

    PostActions -->|즐겨찾기| Bookmark[북마크 추가]
    Bookmark --> PostDetail

    PostActions -->|수정| EditCheck{작성자<br/>본인?}
    EditCheck -->|No| PermissionError[권한 없음]
    EditCheck -->|Yes| EditPost[게시글 수정]
    EditPost --> EditorPage

    PostActions -->|삭제| DeleteCheck{작성자<br/>본인?}
    DeleteCheck -->|No| PermissionError
    DeleteCheck -->|Yes| ConfirmDelete{삭제 확인}
    ConfirmDelete -->|취소| PostDetail
    ConfirmDelete -->|확인| DeletePost[(DB 삭제)]
    DeletePost --> PostList

    PostActions -->|신고| ReportPost[신고 폼]
    ReportPost --> SubmitReport[(신고 접수)]
    SubmitReport --> PostDetail
```

---

## 3. Q&A 흐름 (Help me - Q&A Flow)

### 3.1 질문 작성 및 답변 채택

```mermaid
flowchart TD
    Start([Help me 접속]) --> AuthCheck{로그인<br/>여부?}
    AuthCheck -->|No| LoginPrompt[로그인 유도]
    LoginPrompt --> End1([종료])

    AuthCheck -->|Yes| QAMain[Q&A 메인]

    QAMain --> UserAction{사용자<br/>행동}

    UserAction -->|질문 목록| FilterQA{필터/정렬}
    FilterQA --> FilterOptions{필터 옵션}
    FilterOptions -->|답변 없음| NoAnswer[답변 없는 질문]
    FilterOptions -->|채택됨| AcceptedOnly[채택된 질문]
    FilterOptions -->|태그별| TagFilter[태그 필터]
    FilterOptions -->|투표순| VoteSort[투표 많은 순]

    NoAnswer --> QuestionList
    AcceptedOnly --> QuestionList
    TagFilter --> QuestionList
    VoteSort --> QuestionList

    QuestionList[질문 목록] --> QuestionClick{질문<br/>클릭?}
    QuestionClick -->|Yes| QuestionDetail
    QuestionClick -->|No| QuestionList

    UserAction -->|질문 작성| NewQuestionBtn[질문하기 버튼]
    NewQuestionBtn --> QuestionEditor[질문 에디터]

    QuestionEditor --> FillQuestion[질문 작성]
    FillQuestion --> QuestionContent{작성 내용}
    QuestionContent -->|제목| TitleInput[제목 입력<br/>min: 15자<br/>질문형]
    QuestionContent -->|본문| BodyInput[본문 입력<br/>min: 50자]
    QuestionContent -->|태그| TagInput[태그 입력<br/>1-5개 필수]
    QuestionContent -->|코드| CodeBlock[코드 블록]
    QuestionContent -->|이미지| ImageUpload[이미지 첨부]

    TitleInput --> ValidateQuestion
    BodyInput --> ValidateQuestion
    TagInput --> ValidateQuestion
    CodeBlock --> ValidateQuestion
    ImageUpload --> ValidateQuestion

    ValidateQuestion{유효성<br/>검증} -->|실패| QuestionError[에러 표시]
    QuestionError --> FillQuestion
    ValidateQuestion -->|성공| SubmitQuestion[질문 제출]

    SubmitQuestion --> SaveQuestion[(DB 저장)]
    SaveQuestion --> QuestionDetail[질문 상세]

    QuestionDetail --> QuestionActions{액션 선택}

    QuestionActions -->|투표| VoteQuestion{투표}
    VoteQuestion -->|Upvote| UpvoteQ[찬성]
    VoteQuestion -->|Downvote| DownvoteQ[반대]
    UpvoteQ --> UpdateVotesQ[투표 수 업데이트]
    DownvoteQ --> UpdateVotesQ
    UpdateVotesQ --> QuestionDetail

    QuestionActions -->|답변 작성| AnswerForm[답변 폼]
    AnswerForm --> WriteAnswer[답변 작성]
    WriteAnswer --> AnswerContent{답변 내용}
    AnswerContent -->|텍스트| AnswerText[본문 작성]
    AnswerContent -->|코드| AnswerCode[코드 블록]
    AnswerContent -->|이미지| AnswerImage[이미지 첨부]

    AnswerText --> ValidateAnswer
    AnswerCode --> ValidateAnswer
    AnswerImage --> ValidateAnswer

    ValidateAnswer{유효성<br/>검증} -->|실패| AnswerError[에러 표시]
    AnswerError --> WriteAnswer
    ValidateAnswer -->|성공| SubmitAnswer[답변 제출]

    SubmitAnswer --> SaveAnswer[(답변 저장)]
    SaveAnswer --> QuestionDetail

    QuestionActions -->|답변 채택| AcceptCheck{질문 작성자<br/>본인?}
    AcceptCheck -->|No| NoPermission[권한 없음]
    AcceptCheck -->|Yes| SelectAnswer[답변 선택]
    SelectAnswer --> ConfirmAccept{채택 확인<br/>1개만 가능}
    ConfirmAccept -->|취소| QuestionDetail
    ConfirmAccept -->|확인| MarkAccepted[(답변 채택 표시)]
    MarkAccepted --> QuestionDetail

    QuestionActions -->|댓글| CommentOnQ[질문/답변 댓글]
    CommentOnQ --> QuestionDetail

    QuestionActions -->|수정/삭제| EditDeleteQ{작성자<br/>본인?}
    EditDeleteQ -->|No| NoPermission
    EditDeleteQ -->|Yes| ModifyQ[수정/삭제]
    ModifyQ --> QuestionDetail
```

---

## 4. 뉴스 관리 흐름 (News Management Flow - 관리자)

### 4.1 뉴스 작성 및 관리 (관리자 전용)

```mermaid
flowchart TD
    Start([뉴스 페이지]) --> CheckRole{사용자<br/>권한?}
    CheckRole -->|ADMIN| AdminDashboard[관리자 대시보드]
    CheckRole -->|USER/GUEST| NewsListPublic[뉴스 목록<br/>읽기 전용]

    NewsListPublic --> ViewNews[뉴스 읽기]
    ViewNews --> NewsActions{액션}
    NewsActions -->|좋아요| LikeNews[좋아요]
    NewsActions -->|공유| ShareNews[공유]
    NewsActions -->|북마크| BookmarkNews[북마크]
    LikeNews --> ViewNews
    ShareNews --> ViewNews
    BookmarkNews --> ViewNews

    AdminDashboard --> AdminAction{관리자<br/>행동}

    AdminAction -->|뉴스 목록| NewsList[전체 뉴스 목록]
    NewsList --> NewsItem{뉴스 선택}
    NewsItem -->|수정| EditNews
    NewsItem -->|삭제| DeleteNews
    NewsItem -->|조회| ViewNewsDetail

    AdminAction -->|뉴스 작성| NewNewsBtn[뉴스 작성 버튼]
    NewNewsBtn --> NewsEditor[뉴스 에디터]

    NewsEditor --> FillNews[뉴스 작성]
    FillNews --> NewsContent{작성 내용}

    NewsContent -->|제목| NewsTitle[제목 입력]
    NewsContent -->|본문| NewsBody[본문 작성<br/>Rich Text]
    NewsContent -->|카테고리| NewsCategory{카테고리 선택}

    NewsCategory -->|🚀| UpdateCategory[업데이트]
    NewsCategory -->|🎉| EventCategory[이벤트]
    NewsCategory -->|📚| TutorialCategory[튜토리얼]
    NewsCategory -->|📢| AnnouncementCategory[공지]

    UpdateCategory --> ValidateNews
    EventCategory --> ValidateNews
    TutorialCategory --> ValidateNews
    AnnouncementCategory --> ValidateNews

    NewsContent -->|커버 이미지| CoverImage[커버 이미지 업로드]
    NewsContent -->|관련 링크| RelatedLinks[관련 링크 추가]

    NewsTitle --> ValidateNews
    NewsBody --> ValidateNews
    CoverImage --> ValidateNews
    RelatedLinks --> ValidateNews

    ValidateNews{유효성<br/>검증} -->|실패| NewsError[에러 표시]
    NewsError --> FillNews
    ValidateNews -->|성공| SubmitNews[뉴스 제출]

    SubmitNews --> SaveNews[(DB 저장)]
    SaveNews --> ViewNewsDetail[뉴스 상세]

    EditNews[뉴스 수정] --> NewsEditor

    DeleteNews[뉴스 삭제] --> ConfirmDelete{삭제 확인}
    ConfirmDelete -->|취소| NewsList
    ConfirmDelete -->|확인| DeleteFromDB[(DB 삭제)]
    DeleteFromDB --> NewsList

    ViewNewsDetail --> RelatedNews[관련 뉴스 추천]
    RelatedNews --> ViewNewsDetail
```

---

## 5. 검색 및 필터링 흐름 (Search & Filtering Flow)

### 5.1 통합 검색

```mermaid
flowchart TD
    Start([검색 시작]) --> SearchBar[검색창 입력]
    SearchBar --> SearchInput{검색어<br/>입력}

    SearchInput --> SearchType{검색 범위}

    SearchType -->|전체| GlobalSearch[전체 검색]
    SearchType -->|커뮤니티| CommunitySearch[커뮤니티 검색]
    SearchType -->|Q&A| QASearch[Q&A 검색]
    SearchType -->|뉴스| NewsSearch[뉴스 검색]

    GlobalSearch --> SearchEngine[(PostgreSQL<br/>Full-Text Search)]
    CommunitySearch --> SearchEngine
    QASearch --> SearchEngine
    NewsSearch --> SearchEngine

    SearchEngine --> SearchResults[검색 결과]

    SearchResults --> FilterOptions{필터 적용}

    FilterOptions -->|기간| TimeFilter{기간 선택}
    TimeFilter -->|오늘| TodayFilter
    TimeFilter -->|이번 주| WeekFilter
    TimeFilter -->|이번 달| MonthFilter
    TimeFilter -->|전체| AllTimeFilter

    TodayFilter --> ApplyFilters
    WeekFilter --> ApplyFilters
    MonthFilter --> ApplyFilters
    AllTimeFilter --> ApplyFilters

    FilterOptions -->|태그| TagFilter[태그 선택]
    TagFilter --> ApplyFilters

    FilterOptions -->|정렬| SortOptions{정렬 기준}
    SortOptions -->|관련성| RelevanceSort
    SortOptions -->|최신순| RecentSort
    SortOptions -->|인기순| PopularSort
    SortOptions -->|댓글순| CommentSort

    RelevanceSort --> ApplyFilters
    RecentSort --> ApplyFilters
    PopularSort --> ApplyFilters
    CommentSort --> ApplyFilters

    FilterOptions -->|카테고리| CategoryFilter[카테고리 필터]
    CategoryFilter --> ApplyFilters

    ApplyFilters[필터 적용] --> FilteredResults[필터링된 결과]

    FilteredResults --> ResultActions{결과 액션}

    ResultActions -->|상세 보기| ViewDetail[상세 페이지]
    ResultActions -->|북마크| BookmarkResult[북마크 추가]
    ResultActions -->|공유| ShareResult[링크 공유]
    ResultActions -->|더 보기| LoadMore{페이지네이션}

    LoadMore -->|무한 스크롤| InfiniteScroll[다음 페이지 로드]
    LoadMore -->|페이지 번호| PageNumber[페이지 선택]

    InfiniteScroll --> FilteredResults
    PageNumber --> FilteredResults

    ViewDetail --> End1([종료])
    BookmarkResult --> FilteredResults
    ShareResult --> FilteredResults
```

---

## 6. 프로필 관리 흐름 (Profile Management Flow)

### 6.1 사용자 프로필 조회 및 수정

```mermaid
flowchart TD
    Start([프로필 접근]) --> ProfileType{프로필 유형}

    ProfileType -->|본인 프로필| MyProfile[내 프로필]
    ProfileType -->|타인 프로필| OtherProfile[사용자 프로필<br/>읽기 전용]

    OtherProfile --> ViewProfile[프로필 정보]
    ViewProfile --> ProfileInfo{프로필 섹션}
    ProfileInfo -->|기본 정보| BasicInfo[아바타<br/>사용자명<br/>가입일]
    ProfileInfo -->|활동| ActivityInfo[작성 게시글<br/>댓글<br/>평판 점수]
    ProfileInfo -->|통계| StatsInfo[총 투표<br/>총 게시글<br/>베스트 답변]

    BasicInfo --> End1([종료])
    ActivityInfo --> End1
    StatsInfo --> End1

    MyProfile --> ProfileActions{액션 선택}

    ProfileActions -->|프로필 보기| ViewMyProfile[내 프로필 조회]
    ViewMyProfile --> MyProfileInfo{내 정보}
    MyProfileInfo -->|활동 내역| MyActivity[내 게시글<br/>내 댓글<br/>북마크]
    MyProfileInfo -->|통계| MyStats[평판 점수<br/>배지<br/>랭킹]

    ProfileActions -->|프로필 수정| EditProfile[프로필 편집]

    EditProfile --> EditForm[편집 폼]
    EditForm --> EditFields{수정 항목}

    EditFields -->|아바타| UploadAvatar[아바타 업로드<br/>jpg/png<br/>max: 2MB]
    EditFields -->|표시 이름| DisplayName[표시 이름 변경]
    EditFields -->|자기소개| BioInput[자기소개 작성<br/>max: 500자]

    UploadAvatar --> ValidateProfile
    DisplayName --> ValidateProfile
    BioInput --> ValidateProfile

    ValidateProfile{유효성<br/>검증} -->|실패| ProfileError[에러 표시]
    ProfileError --> EditForm
    ValidateProfile -->|성공| SaveProfile[프로필 저장]

    SaveProfile --> UpdateDB[(DB 업데이트)]
    UpdateDB --> ViewMyProfile

    ProfileActions -->|설정| Settings[설정 페이지]

    Settings --> SettingsMenu{설정 항목}

    SettingsMenu -->|계정| AccountSettings[계정 설정]
    AccountSettings --> AccountOptions{계정 옵션}
    AccountOptions -->|이메일 변경| ChangeEmail[이메일 변경]
    AccountOptions -->|비밀번호 변경| ChangePassword[비밀번호 변경]
    AccountOptions -->|계정 연동| LinkAccount[OAuth 연동]

    ChangeEmail --> ValidateAccount
    ChangePassword --> ValidateAccount
    LinkAccount --> ValidateAccount

    ValidateAccount{유효성<br/>검증} -->|실패| AccountError[에러]
    AccountError --> AccountSettings
    ValidateAccount -->|성공| SaveAccount[(계정 업데이트)]
    SaveAccount --> Settings

    SettingsMenu -->|알림| NotificationSettings[알림 설정]
    NotificationSettings --> NotifOptions{알림 옵션}
    NotifOptions -->|이메일 알림| EmailNotif[이메일 알림<br/>ON/OFF]
    NotifOptions -->|브라우저 알림| BrowserNotif[브라우저 알림<br/>ON/OFF]
    NotifOptions -->|알림 종류| NotifTypes[댓글<br/>답변<br/>투표<br/>공지]

    EmailNotif --> SaveNotif
    BrowserNotif --> SaveNotif
    NotifTypes --> SaveNotif

    SaveNotif[(알림 설정 저장)] --> Settings

    SettingsMenu -->|개인정보| PrivacySettings[개인정보 설정]
    PrivacySettings --> PrivacyOptions{개인정보 옵션}
    PrivacyOptions -->|프로필 공개| ProfileVisibility[프로필 공개<br/>여부]
    PrivacyOptions -->|활동 공개| ActivityVisibility[활동 내역<br/>공개 여부]

    ProfileVisibility --> SavePrivacy
    ActivityVisibility --> SavePrivacy

    SavePrivacy[(개인정보 저장)] --> Settings
```

---

## 7. 알림 흐름 (Notification Flow)

### 7.1 알림 수신 및 관리

```mermaid
flowchart TD
    Start([알림 트리거]) --> NotifTrigger{알림 이벤트}

    NotifTrigger -->|댓글| CommentNotif[내 게시글에<br/>댓글 작성됨]
    NotifTrigger -->|답변| AnswerNotif[내 질문에<br/>답변 작성됨]
    NotifTrigger -->|채택| AcceptNotif[내 답변이<br/>채택됨]
    NotifTrigger -->|투표| VoteNotif[내 게시글/답변에<br/>투표됨]
    NotifTrigger -->|멘션| MentionNotif[@username으로<br/>멘션됨]
    NotifTrigger -->|공지| SystemNotif[시스템 공지]

    CommentNotif --> CheckSettings
    AnswerNotif --> CheckSettings
    AcceptNotif --> CheckSettings
    VoteNotif --> CheckSettings
    MentionNotif --> CheckSettings
    SystemNotif --> CheckSettings

    CheckSettings{알림 설정<br/>확인} -->|OFF| IgnoreNotif[알림 무시]
    CheckSettings -->|ON| CreateNotif[알림 생성]

    CreateNotif --> NotifChannels{알림 채널}

    NotifChannels -->|인앱| InAppNotif[인앱 알림<br/>헤더 벨 아이콘]
    NotifChannels -->|이메일| EmailNotifSend[이메일 전송]
    NotifChannels -->|브라우저| BrowserNotif[브라우저 푸시]

    InAppNotif --> SaveNotifDB[(알림 DB 저장)]
    EmailNotifSend --> SaveNotifDB
    BrowserNotif --> SaveNotifDB

    SaveNotifDB --> UserChecks{사용자 확인}

    UserChecks -->|헤더 벨 클릭| NotifDropdown[알림 드롭다운]
    NotifDropdown --> NotifList[알림 목록]

    NotifList --> NotifActions{알림 액션}

    NotifActions -->|클릭| NavigateTo[해당 페이지로<br/>이동]
    NavigateTo --> MarkRead[(읽음 표시)]
    MarkRead --> End1([종료])

    NotifActions -->|읽음 표시| MarkAllRead[(모두 읽음<br/>표시)]
    MarkAllRead --> NotifList

    NotifActions -->|삭제| DeleteNotif[(알림 삭제)]
    DeleteNotif --> NotifList

    UserChecks -->|알림 설정| NotifSettings[알림 설정 페이지]
    NotifSettings --> AdjustSettings[설정 조정]
    AdjustSettings --> SaveSettings[(설정 저장)]
    SaveSettings --> End1
```

---

## 8. 관리자 대시보드 흐름 (Admin Dashboard Flow)

### 8.1 콘텐츠 관리 및 모더레이션

```mermaid
flowchart TD
    Start([관리자 로그인]) --> CheckRole{권한 확인}
    CheckRole -->|ADMIN| AdminDashboard[관리자 대시보드]
    CheckRole -->|MODERATOR| ModDashboard[모더레이터 대시보드]
    CheckRole -->|USER| AccessDenied[접근 거부]

    AccessDenied --> End1([종료])

    AdminDashboard --> AdminMenu{관리 메뉴}

    AdminMenu -->|사용자 관리| UserManagement[사용자 관리]
    UserManagement --> UserActions{사용자 액션}
    UserActions -->|목록| UserList[전체 사용자 목록]
    UserActions -->|검색| UserSearch[사용자 검색]
    UserActions -->|역할 변경| ChangeRole[역할 변경<br/>USER/MOD/ADMIN]
    UserActions -->|정지| SuspendUser[사용자 정지]
    UserActions -->|삭제| DeleteUser[계정 삭제]

    UserList --> UserDetail
    UserSearch --> UserDetail
    ChangeRole --> UserDetail
    SuspendUser --> UserDetail
    DeleteUser --> UserList

    UserDetail[사용자 상세] --> End1

    AdminMenu -->|콘텐츠 관리| ContentManagement[콘텐츠 관리]
    ContentManagement --> ContentActions{콘텐츠 액션}

    ContentActions -->|게시글 관리| PostManagement[게시글 관리]
    PostManagement --> PostActions{게시글 액션}
    PostActions -->|고정| PinPost[게시글 고정]
    PostActions -->|잠금| LockPost[게시글 잠금]
    PostActions -->|삭제| DeletePost[게시글 삭제]
    PostActions -->|이동| MovePost[카테고리 이동]

    PinPost --> PostList
    LockPost --> PostList
    DeletePost --> PostList
    MovePost --> PostList

    PostList[게시글 목록] --> End1

    ContentActions -->|댓글 관리| CommentManagement[댓글 관리]
    CommentManagement --> CommentActions{댓글 액션}
    CommentActions -->|삭제| DeleteComment[댓글 삭제]
    CommentActions -->|사용자 정지| WarnUser[사용자 경고]

    DeleteComment --> CommentList
    WarnUser --> CommentList

    CommentList[댓글 목록] --> End1

    AdminMenu -->|신고 관리| ReportManagement[신고 관리]
    ReportManagement --> ReportQueue[신고 대기열]

    ReportQueue --> ReportReview{신고 검토}

    ReportReview -->|정당| ValidReport[정당한 신고]
    ValidReport --> TakeAction{조치 선택}

    TakeAction -->|콘텐츠 삭제| RemoveContent[콘텐츠 제거]
    TakeAction -->|사용자 경고| WarnReported[경고 발송]
    TakeAction -->|사용자 정지| SuspendReported[계정 정지]

    RemoveContent --> MarkResolved
    WarnReported --> MarkResolved
    SuspendReported --> MarkResolved

    ReportReview -->|부당| InvalidReport[부당한 신고]
    InvalidReport --> DismissReport[신고 기각]
    DismissReport --> MarkResolved

    MarkResolved[(신고 처리 완료)] --> ReportQueue

    AdminMenu -->|통계| Statistics[통계 대시보드]
    Statistics --> StatsView{통계 뷰}

    StatsView -->|사용자| UserStats[사용자 통계<br/>MAU<br/>신규 가입<br/>활성 사용자]
    StatsView -->|콘텐츠| ContentStats[콘텐츠 통계<br/>게시글 수<br/>댓글 수<br/>평균 응답 시간]
    StatsView -->|트래픽| TrafficStats[트래픽 통계<br/>페이지뷰<br/>체류 시간<br/>인기 페이지]

    UserStats --> End1
    ContentStats --> End1
    TrafficStats --> End1

    ModDashboard --> ModMenu{모더레이터 메뉴}
    ModMenu -->|콘텐츠 관리| ContentManagement
    ModMenu -->|신고 관리| ReportManagement
```

---

---

## 0. 전체 사용자 여정 (Overall User Journey)

### 0.1 일반 사용자의 간단한 행동 흐름

```mermaid
flowchart LR
    Start([사이트 방문]) --> Landing[홈페이지]
    Landing --> Browse{둘러보기}

    Browse -->|관심 콘텐츠| ViewContent[콘텐츠 조회]
    ViewContent --> Decide{참여 결정}

    Decide -->|읽기만| Continue[계속 탐색]
    Continue --> Browse

    Decide -->|참여하고 싶음| SignUp[회원가입/로그인]

    SignUp --> Actions{활동 선택}

    Actions -->|정보 공유| WritePost[게시글 작성]
    Actions -->|질문| AskQuestion[질문 작성]
    Actions -->|답변| WriteAnswer[답변 작성]
    Actions -->|반응| Interact[투표/댓글]

    WritePost --> Engage[커뮤니티 참여]
    AskQuestion --> Engage
    WriteAnswer --> Engage
    Interact --> Engage

    Engage --> GetNotif[알림 수신]
    GetNotif --> Respond{응답}

    Respond -->|확인| CheckNotif[알림 확인]
    CheckNotif --> Actions

    Respond -->|나중에| ProfileCheck[프로필 관리]
    ProfileCheck --> Actions

    Actions -->|종료| End([로그아웃])

    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style SignUp fill:#fff4e1
    style Engage fill:#e1f0ff
```

### 0.2 핵심 사용자 경로 (Key User Paths)

```mermaid
flowchart TD
    Entry([플랫폼 진입]) --> UserType{사용자 유형}

    UserType -->|신규 방문자| NewUser[첫 방문]
    UserType -->|기존 사용자| ReturningUser[재방문]

    NewUser --> Explore[플랫폼 탐색]
    Explore --> Interest{흥미 유발}
    Interest -->|Yes| Register[회원가입]
    Interest -->|No| Leave1([이탈])

    Register --> Onboarding[온보딩]
    Onboarding --> FirstAction{첫 활동}

    FirstAction -->|창작자| ContentCreator[콘텐츠 생성]
    FirstAction -->|학습자| Learner[학습/질문]
    FirstAction -->|참여자| Participant[상호작용]

    ContentCreator --> Post[게시글/프로젝트 작성]
    Learner --> Question[질문하기]
    Participant --> Engage[댓글/투표]

    ReturningUser --> CheckUpdates{업데이트 확인}

    CheckUpdates -->|알림| Notifications[알림 확인]
    CheckUpdates -->|새 콘텐츠| NewContent[새 게시글 탐색]
    CheckUpdates -->|내 활동| MyActivity[내 활동 관리]

    Notifications --> Respond[응답 작성]
    NewContent --> Read[읽기/반응]
    MyActivity --> Manage[관리/수정]

    Post --> Community[커뮤니티 활동]
    Question --> Community
    Engage --> Community
    Respond --> Community
    Read --> Community
    Manage --> Community

    Community --> Satisfaction{만족도}

    Satisfaction -->|높음| Return[재방문 예정]
    Satisfaction -->|중간| Maybe[경험에 따라]
    Satisfaction -->|낮음| Leave2([이탈])

    Return --> RegularUser[정규 사용자]
    Maybe --> CheckUpdates

    RegularUser --> Reputation[평판 쌓기]
    Reputation --> Contributor[핵심 기여자]

    style Entry fill:#e1f5e1
    style Leave1 fill:#ffe1e1
    style Leave2 fill:#ffe1e1
    style Contributor fill:#ffd700
    style Community fill:#e1f0ff
```

### 0.3 주요 기능별 사용자 흐름 요약

```mermaid
flowchart TB
    subgraph Auth[인증]
        A1[방문] --> A2[로그인/가입]
        A2 --> A3[세션 시작]
    end

    subgraph Community[커뮤니티]
        C1[카테고리 선택] --> C2[게시글 작성]
        C2 --> C3[상호작용]
        C3 --> C4[댓글/투표]
    end

    subgraph QA[Q&A]
        Q1[질문 작성] --> Q2[답변 대기]
        Q2 --> Q3[답변 확인]
        Q3 --> Q4[답변 채택]
    end

    subgraph News[뉴스]
        N1[뉴스 목록] --> N2[뉴스 읽기]
        N2 --> N3[좋아요/공유]
    end

    subgraph Profile[프로필]
        P1[내 활동] --> P2[설정 관리]
        P2 --> P3[통계 확인]
    end

    Auth --> Community
    Auth --> QA
    Auth --> News
    Auth --> Profile

    Community --> Notif[알림]
    QA --> Notif
    News --> Notif

    Notif --> Return[재방문]
    Return --> Community
    Return --> QA

    style Auth fill:#fff4e1
    style Community fill:#e1f0ff
    style QA fill:#e1ffe1
    style News fill:#ffe1f0
    style Profile fill:#f0e1ff
    style Notif fill:#ffd700
```

---

## 문서 정보

- **작성일**: 2025-10-21
- **기반 문서**: `docs/PRD.md` v1.2
- **다이어그램 도구**: Mermaid
- **총 흐름 수**: 11개 (전체 흐름 3개 + 세부 흐름 8개)
- **다이어그램 유형**: Flowchart TD/LR (Top-Down/Left-Right)

## 범례 (Legend)

### 다이어그램 노드 유형
- `([텍스트])`: 시작/종료 노드
- `[텍스트]`: 프로세스 노드
- `{텍스트}`: 의사결정 노드
- `[(텍스트)]`: 데이터베이스 작업
- `-->|레이블|`: 조건부 흐름
- `-->`: 일반 흐름

### 주요 색상 구분 (Mermaid 렌더링 시)
- 초록색: 성공 경로
- 빨간색: 실패/에러 경로
- 파란색: 일반 프로세스
- 노란색: 경고/확인 단계
