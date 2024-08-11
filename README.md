# 🐰 Penny Buddy

<p align="center">
<br>
<img alt="image" src="https://github.com/user-attachments/assets/b3dc9d04-3a6d-4a9b-b926-bea9363db63f">
<br>
</p>


## 프로젝트 소개

Penny Buddy는 사용자의 재정 관리를 돕기 위한 웹 애플리케이션입니다. 사용자는 자신의 지출과 수입을 손쉽게 기록하고, 차트로 시각화하여 한눈에 확인할 수 있습니다. Vue.js와 Pinia를 사용하여 상태 관리를 효율적으로 수행하며, Chart.js를 이용해 다양한 형태의 차트를 제공합니다.



## 실행 방법

### 개발 환경에서 실행

개발 환경에서 애플리케이션을 실행하려면, 아래의 단계를 따라주세요.

1. 프로젝트 클론
   ```bash
   git clone https://github.com/your-repository/kb-pennybuddy.git
   cd kb-pennybuddy
   ```
2. 종속성 설치
    ```
    npm install
    ```
3. 개발 서버 실행
   ```
   npm run dev
   ```
   실행 후, 브라우저에서 http://localhost:5173를 열어 애플리케이션을 확인할 수 있습니다.

### 프로덕션 빌드
프로덕션 환경에서 애플리케이션을 빌드하려면 아래 명령어를 실행합니다.
```
npm run build
```
빌드가 완료되면, dist 폴더에 생성된 파일들을 배포할 서버에 업로드합니다.

프로덕션 빌드 미리보기

빌드된 애플리케이션을 로컬에서 미리보기 위해 아래 명령어를 실행합니다.

```
npm run preview
```

## 기술 스택

![image](https://github.com/user-attachments/assets/c3125ddd-3d56-4abc-bbba-d1b304fb1815)


<br>

## 화면별 기능

### Intro View

- 화면을 클릭하거나 ‘Enter’ 키를 눌러 Main View로 이동.

### Main View

1.	소비 데이터 분석
- 카테고리별/월별 소비 데이터 그래프 제공.
2.	AI 금융 매니저
- ‘대화하기’ 옵션을 선택하여 일상 대화, 경제 뉴스 등 일반적인 대화 가능.
- 거래 내역 조회를 통해 입력한 거래내역을 빠르고 쉽게 조회하며, 소비 패턴에 맞는 조언 제공.
- 금융 매니저를 클릭하거나 특정 상황에서 애니메이션이 재생되어 사용자에게 즐거움을 제공.
4.	거래 리스트
- 상세 리스트 보기 버튼을 눌러 List View로 이동.
- 추가하기 버튼을 눌러 리스트로 이동하면서 추가 컴포넌트를 함께 표시하여 빠른 추가 가능.



## 만든이

<table>
<tbody>
<tr>
<td align="center"><a href="https://github.com/pq5910"><img src="https://avatars.githubusercontent.com/u/81617589?v=4" width="100px;" alt=""/><br /><sub><b> 김우정 </b></sub></a><br /></td>
<td align="center"><a href="https://github.com/testjd1"><img src="https://avatars.githubusercontent.com/u/87185470?v=4" width="100px;" alt=""/><br /><sub><b> 김재동 </b></sub></a><br /></td>
<td align="center"><a href="https://github.com/lee-JunR"><img src="https://avatars.githubusercontent.com/u/68640939?v=4" width="100px;" alt=""/><br /><sub><b> 이준렬 </b></sub></a><br /></td>
</tr>
</tbody>
</table>

## 👥 협업 진행 방식

1. fork후 dev_ljr 로 branch 생성 → dev_ljr 브런치에 merge
2. 이후 각 Page 별main 브런치에 PR 요청 후 합병


## 🥄 커밋 규칙

`태그 : 제목` 의 형태이며, `:`뒤에만 space가 있음에 유의한다.

- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `docs` : 문서 수정
- `style` : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- `refactor` : 코드 리펙토링
- `test` : 테스트 코드, 리펙토링 테스트 코드 추가
- `chore` : 빌드 업무 수정, 패키지 매니저 수정

## 🍴 PR 규칙

- PR 제목
    
    예시 : `yymmdd {이름} {기능} 구현` (예시 : 240701 이준렬 css 구현)
    

## 프로젝트 진행 과정에서 배운점, 어려웠던 부분 기록

- tmp

## 라이센스

MIT © [NoHack 템플릿](mailto:lbjp114@gmail.com)
