// ❗️가장 먼저 매뉴얼을 읽고, 매뉴얼을 참고해 코드를 보는 것을 추천드립니다.❗️
// 매뉴얼에도 적어놨지만, 자칫 잘못 바꾸면 사이트가 완전히 셧다운될 수 있습니다.
// 그러니 수정해야 할 부분이 생길 경우, 교육국 단톡방에 보고 후 조치 부탁드립니다.
// 모르겠을 땐 gemini에게 물어보는걸 추천드립니다!

// 0. '지성의 열쇠' 과목 데이터 
const allAcademiaCourses = [
    // 과목명이 바뀌거나, 과목 추가 등을 할 경우, 아래를 수정해주세요!
{"name": "고대그리스.로마문학의 세계", "group": "문화 해석과 상상"}, {"name": "공연예술의 이해", "group": "문화 해석과 상상"}, {"name": "그리스.로마신화", "group": "문화 해석과 상상"},  
{"name": "그리스비극", "group": "문화 해석과 상상"}, {"name": "기독교와 서양문명", "group": "문화 해석과 상상"}, {"name": "대중예술의 이해", "group": "문화 해석과 상상"},  
{"name": "도시의 문화사", "group": "문화 해석과 상상"}, {"name": "도스토예프스키와 톨스토이", "group": "문화 해석과 상상"}, {"name": "독일명작의 이해", "group": "문화 해석과 상상"},  
{"name": "동서양 명작 읽기", "group": "문화 해석과 상상"}, {"name": "동시대 미술과 현장", "group": "문화 해석과 상상"}, {"name": "동양미술사입문", "group": "문화 해석과 상상"},  
{"name": "동양의 고전", "group": "문화 해석과 상상"}, {"name": "디자인과 생활", "group": "문화 해석과 상상"}, {"name": "러시아명작의 이해", "group": "문화 해석과 상상"},  
{"name": "르네상스의 세계", "group": "문화 해석과 상상"}, {"name": "문학과 공연예술", "group": "문화 해석과 상상"}, {"name": "문학과 사회", "group": "문화 해석과 상상"},  
{"name": "문학과 영상", "group": "문화 해석과 상상"}, {"name": "문학과 정신분석", "group": "문화 해석과 상상"}, {"name": "문학과 철학의 대화", "group": "문화 해석과 상상"},  
{"name": "문학 속 인간과 기계", "group": "문화 해석과 상상"}, {"name": "문학으로 읽는 서양문명", "group": "문화 해석과 상상"}, {"name": "미국문화와 현대사회의 이해", "group": "문화 해석과 상상"},  
{"name": "미디어 리터러시의 세계", "group": "문화 해석과 상상"}, {"name": "미술론입문", "group": "문화 해석과 상상"}, {"name": "상상력과 문화", "group": "문화 해석과 상상"},  
{"name": "서양근대문학의 이해", "group": "문화 해석과 상상"}, {"name": "서양미술사입문", "group": "문화 해석과 상상"}, {"name": "서양연극의 이해", "group": "문화 해석과 상상"},  
{"name": "서양의 문화적 전통", "group": "문화 해석과 상상"}, {"name": "세계문학과 영문학", "group": "문화 해석과 상상"}, {"name": "스페인어권 문화의 이해", "group": "문화 해석과 상상"},  
{"name": "스페인어권명작의 이해", "group": "문화 해석과 상상"}, {"name": "아시아미술의 이해", "group": "문화 해석과 상상"}, {"name": "아시아의 종교와 미술", "group": "문화 해석과 상상"},  
{"name": "알타이민족의 언어", "group": "문화 해석과 상상"}, {"name": "언어와 사회", "group": "문화 해석과 상상"}, {"name": "여성과 문학", "group": "문화 해석과 상상"},  
{"name": "영미 대중소설의 이해", "group": "문화 해석과 상상"}, {"name": "영미 문화의 이해", "group": "문화 해석과 상상"}, {"name": "영상예술의 이해", "group": "문화 해석과 상상"},  
{"name": "영시의 이해", "group": "문화 해석과 상상"}, {"name": "예술과 과학", "group": "문화 해석과 상상"}, {"name": "예술과 사회", "group": "문화 해석과 상상"},  
{"name": "음악과 사회", "group": "문화 해석과 상상"}, {"name": "음악론입문", "group": "문화 해석과 상상"}, {"name": "이중언어사용", "group": "문화 해석과 상상"},  
{"name": "인간과 문화", "group": "문화 해석과 상상"}, {"name": "인도의 전통과 현대", "group": "문화 해석과 상상"}, {"name": "전통과 일상의 한국문화", "group": "문화 해석과 상상"},  
{"name": "종교와 예술", "group": "문화 해석과 상상"}, {"name": "중국어권의 사회와 문화", "group": "문화 해석과 상상"}, {"name": "중국인의 언어와 문화", "group": "문화 해석과 상상"},  
{"name": "창작의 세계", "group": "문화 해석과 상상"}, {"name": "프랑스명작의 이해", "group": "문화 해석과 상상"}, {"name": "프랑스어권 문화의 이해", "group": "문화 해석과 상상"},  
{"name": "한국 문학의 깊이와 상상력", "group": "문화 해석과 상상"}, {"name": "한국문학과 문화예술", "group": "문화 해석과 상상"}, {"name": "한국문학과 세계문학", "group": "문화 해석과 상상"},  
{"name": "한국문학과 여행", "group": "문화 해석과 상상"}, {"name": "한국미술사입문", "group": "문화 해석과 상상"}, {"name": "한국어 어휘와 표현", "group": "문화 해석과 상상"},  
{"name": "한국의 신화", "group": "문화 해석과 상상"}, {"name": "한국의 한자와 한자어", "group": "문화 해석과 상상"}, {"name": "한국인의 언어와 문화", "group": "문화 해석과 상상"},  
{"name": "한국현대시 읽기", "group": "문화 해석과 상상"}, {"name": "한글맞춤법의 이론과 실제", "group": "문화 해석과 상상"}, {"name": "한자와 동양문화", "group": "문화 해석과 상상"},  
{"name": "현대미술의 이해", "group": "문화 해석과 상상"}, {"name": "현대종교와 문화", "group": "문화 해석과 상상"}, 
{"name": "고고학개론", "group": "역사적 탐구와 철학적 사유"}, {"name": "규장각과 한국문화", "group": "역사적 탐구와 철학적 사유"}, {"name": "근·현대 한국민족주의", "group": "역사적 탐구와 철학적 사유"},  
{"name": "근대 한국의 역사와 문화", "group": "역사적 탐구와 철학적 사유"}, {"name": "남북분단과 한국전쟁", "group": "역사적 탐구와 철학적 사유"}, {"name": "논리학", "group": "역사적 탐구와 철학적 사유"},  
{"name": "도덕적 추론", "group": "역사적 탐구와 철학적 사유"}, {"name": "동서문명의 만남과 실크로드", "group": "역사적 탐구와 철학적 사유"}, {"name": "동아시아의 역사분쟁", "group": "역사적 탐구와 철학적 사유"},  
{"name": "동아시아의 왕권", "group": "역사적 탐구와 철학적 사유"}, {"name": "동양예술론입문", "group": "역사적 탐구와 철학적 사유"}, {"name": "동양철학의 고전", "group": "역사적 탐구와 철학적 사유"},  
{"name": "동양철학의 이해", "group": "역사적 탐구와 철학적 사유"}, {"name": "문명의 기원", "group": "역사적 탐구와 철학적 사유"}, {"name": "미학과 예술론", "group": "역사적 탐구와 철학적 사유"},  
{"name": "법과 가치", "group": "역사적 탐구와 철학적 사유"}, {"name": "사상과 윤리", "group": "역사적 탐구와 철학적 사유"}, {"name": "사회철학의 이해", "group": "역사적 탐구와 철학적 사유"},  
{"name": "생명의료윤리", "group": "역사적 탐구와 철학적 사유"}, {"name": "서양문명의 역사 1: 고대에서 르네상스까지", "group": "역사적 탐구와 철학적 사유"}, {"name": "서양문명의 역사 2: 종교개혁에서 냉전까지", "group": "역사적 탐구와 철학적 사유"},  
{"name": "서양철학의 고전", "group": "역사적 탐구와 철학적 사유"}, {"name": "서양철학의 이해", "group": "역사적 탐구와 철학적 사유"}, {"name": "성의 철학과 성윤리", "group": "역사적 탐구와 철학적 사유"},  
{"name": "세계종교입문", "group": "역사적 탐구와 철학적 사유"}, {"name": "역사 속의 중화와 그 이웃", "group": "역사적 탐구와 철학적 사유"}, {"name": "역사와 역사 재현", "group": "역사적 탐구와 철학적 사유"},  
{"name": "예술과 신화", "group": "역사적 탐구와 철학적 사유"}, {"name": "예술의 가치와 비평", "group": "역사적 탐구와 철학적 사유"}, {"name": "이슬람 문명의 역사", "group": "역사적 탐구와 철학적 사유"},  
{"name": "인류문화의 기원", "group": "역사적 탐구와 철학적 사유"}, {"name": "인물로 본 한국사", "group": "역사적 탐구와 철학적 사유"}, {"name": "일본의 인물과 역사", "group": "역사적 탐구와 철학적 사유"},  
{"name": "자아탐색과 자아실현", "group": "역사적 탐구와 철학적 사유"}, {"name": "조선의 역사적 성취와 유산", "group": "역사적 탐구와 철학적 사유"}, {"name": "종교 상징의 세계", "group": "역사적 탐구와 철학적 사유"},  
{"name": "주제어로 본 동양철학", "group": "역사적 탐구와 철학적 사유"}, {"name": "중국고전과 중국사상", "group": "역사적 탐구와 철학적 사유"}, {"name": "중국의 전통과 현대", "group": "역사적 탐구와 철학적 사유"},  
{"name": "처음 배우는 서양사", "group": "역사적 탐구와 철학적 사유"}, {"name": "철학개론", "group": "역사적 탐구와 철학적 사유"}, {"name": "철학으로 예술 보기", "group": "역사적 탐구와 철학적 사유"},  
{"name": "테마 중국사", "group": "역사적 탐구와 철학적 사유"}, {"name": "페미니즘 미학과 예술", "group": "역사적 탐구와 철학적 사유"}, {"name": "한국 중세의 사회와 문화", "group": "역사적 탐구와 철학적 사유"},  
{"name": "한국고대사의 쟁점", "group": "역사적 탐구와 철학적 사유"}, {"name": "한국문화와 불교", "group": "역사적 탐구와 철학적 사유"}, {"name": "한국문화와 유교사회", "group": "역사적 탐구와 철학적 사유"},  
{"name": "한국사", "group": "역사적 탐구와 철학적 사유"}, {"name": "한국사의 새로운 해석", "group": "역사적 탐구와 철학적 사유"}, {"name": "한국의 문화유산", "group": "역사적 탐구와 철학적 사유"},  
{"name": "한국의 역사가와 역사학", "group": "역사적 탐구와 철학적 사유"}, {"name": "한국현대사의 이해", "group": "역사적 탐구와 철학적 사유"}, {"name": "현대사회와 윤리", "group": "역사적 탐구와 철학적 사유"},  
{"name": "현대서양의 형성", "group": "역사적 탐구와 철학적 사유"},
{"name": "경영학개론", "group": "인간의 이해와 사회 분석"}, {"name": "공공행정의 이해", "group": "인간의 이해와 사회 분석"}, {"name": "교육의 이해", "group": "인간의 이해와 사회 분석"},  
{"name": "국가와 시민", "group": "인간의 이해와 사회 분석"}, {"name": "국제정치학입문", "group": "인간의 이해와 사회 분석"}, {"name": "글로벌 이슈와 윤리적 사고", "group": "인간의 이해와 사회 분석"},  
{"name": "기업과 사회", "group": "인간의 이해와 사회 분석"}, {"name": "남북관계와 통일의 전망", "group": "인간의 이해와 사회 분석"}, {"name": "독일어권 문화의 이해", "group": "인간의 이해와 사회 분석"},  
{"name": "디지털시대의 영상문화와 윤리", "group": "인간의 이해와 사회 분석"}, {"name": "라틴아메리카 문학과 사회", "group": "인간의 이해와 사회 분석"}, {"name": "러시아인의 삶과 문화", "group": "인간의 이해와 사회 분석"},  
{"name": "미디어와 현대사회", "group": "인간의 이해와 사회 분석"}, {"name": "민주시민과 기본적 인권", "group": "인간의 이해와 사회 분석"}, {"name": "민주시민과 헌법", "group": "인간의 이해와 사회 분석"},  
{"name": "법학개론", "group": "인간의 이해와 사회 분석"}, {"name": "복지국가의 이해", "group": "인간의 이해와 사회 분석"}, {"name": "사랑과 일, 그리고 젠더", "group": "인간의 이해와 사회 분석"},  
{"name": "사회학의 이해", "group": "인간의 이해와 사회 분석"}, {"name": "삶과 교육", "group": "인간의 이해와 사회 분석"}, {"name": "생활공간과 인간", "group": "인간의 이해와 사회 분석"},  
{"name": "성과 사랑의 역사", "group": "인간의 이해와 사회 분석"}, {"name": "섹슈얼리티와 성평등", "group": "인간의 이해와 사회 분석"}, {"name": "소비자와 시장", "group": "인간의 이해와 사회 분석"},  
{"name": "언어의 세계", "group": "인간의 이해와 사회 분석"}, {"name": "역사 속의 전쟁과 평화", "group": "인간의 이해와 사회 분석"}, {"name": "영화 속 세계정치", "group": "인간의 이해와 사회 분석"},  
{"name": "인공지능과 알고리듬 사회", "group": "인간의 이해와 사회 분석"}, {"name": "인권, NGO, 세계시민사회", "group": "인간의 이해와 사회 분석"}, {"name": "정치와 정치이념", "group": "인간의 이해와 사회 분석"},  
{"name": "정치학개론", "group": "인간의 이해와 사회 분석"}, {"name": "젠더와 범죄", "group": "인간의 이해와 사회 분석"}, {"name": "젠더와 법", "group": "인간의 이해와 사회 분석"},  
{"name": "주권국가와 국제법원", "group": "인간의 이해와 사회 분석"}, {"name": "지구화 시대의 공공외교", "group": "인간의 이해와 사회 분석"}, {"name": "한국정치의 분석과 이해", "group": "인간의 이해와 사회 분석"},  
{"name": "부모교육", "group": "인간의 이해와 사회 분석"}, {"name": "친밀성과 가족", "group": "인간의 이해와 사회 분석"}, {"name": "행복한 삶과 사회복지", "group": "인간의 이해와 사회 분석"},  
{"name": "현대국가와 행정", "group": "인간의 이해와 사회 분석"}, {"name": "현대사회와 국제어", "group": "인간의 이해와 사회 분석"}, {"name": "현대사회와 법", "group": "인간의 이해와 사회 분석"},  
{"name": "현대사회의 생로병사", "group": "인간의 이해와 사회 분석"}, {"name": "현대정치의 이해", "group": "인간의 이해와 사회 분석"}
];
// 마찬가지로, 학문의 세계 영역 명을 변경하고 싶은 경우, 아래를 수정해주세요. 이때, 위 과목 group 옆 이름과 아래 영역 이름이 동일해야 합니다.
const allAcademiaGroups = [
    "문화 해석과 상상", "역사적 탐구와 철학적 사유", "인간의 이해와 사회 분석"
];       
const allVeritasCourses = [
    // ❗️ 모든 과목은 3학점 가정입니다. ❗️
    "기후위기와 인류", "데이터로 디자인하는 리더십", "아르스 롱가 - 과학, 음악, 문학의 만남",
    "인간과 동물", "자유와 정의", "공연만들기", "눈과 마음", "데이터 시각화와 나",
    "디자인적 사고의 확장적 실천", "사회혁신 디자인하기", "신체조형", "여행의 윤리",
    "연극적 표현과 실천", "영상 제작을 통해 글로벌 공동체로서의 대학을 재사유하기",
    "포용사회 실현을 위한 지역커뮤니티 문제해결", "한국전통가창과 노랫말 분석을 통한 미디 창작 및 실습"
];
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  try {
    const bodyData = req.body || {};
    const allText = bodyData.text || "";
    const checklistData = bodyData.checklist || {};

    const analysisResult = {};
    


    // ======================================================
    // 2. 전공 필수 과목명 변경을 원하는 경우, 아래를 수정해주세요!
    // ======================================================
    const allRequiredCourses = [
      "의예과신입생세미나", "의학입문", "자유주제탐구",
      "의학연구의 이해", "기초의학통계학 및 실험"
    ];
    const completedRequired = [];
    const remainingRequired = [];

    allRequiredCourses.forEach(course => {
      if (allText.includes(course)) completedRequired.push(course);
      else remainingRequired.push(course);
    });

    analysisResult["전공 필수"] = {
      description: "총 5개의 전공 필수 과목을 모두 이수해야 합니다.",
      displayType: "list_all",
      completed: completedRequired,
      remaining: remainingRequired
    };

    // ======================================================
    // 3. 전공 선택 과목명 변경 및 과목 추가를 원하는 경우, 아래를 수정해주세요!
    // ======================================================
    const allElectiveCourses = [
      "국제의학의 이해", "몸 속으로의 여행", "바이오헬스케어와 혁신사고",
      "사례병 질병 진단의 실제", "사회와 의료현장에서의 리빙랩", "세계예술 속 의학의 이해",
      "세포분자생물학", "의대생을 위한 고전읽기", "의료와 데이터사이언스",
      "의생명과학 논문의 이해", "의학연구의 실제", "통일의료"
    ];
      // 이 부분은 2학점 전공 선택을 분석을 위해 따로 빼놓은 부분입니다. 2학점 전선 과목 수정을 원하는 경우, 아래를 수정해주세요! 
    const twoCreditElectives = [
      "국제의학의 이해", "몸 속으로의 여행", "세계예술 속 의학의 이해", "통일의료"
    ];
    const requiredElectiveCredits = 12;
    let totalElectiveCredits = 0;
    const completedElectiveCourses = [];
    const recommendedElectiveCourses = [];

    allElectiveCourses.forEach(course => {
      if (allText.includes(course)) {
        completedElectiveCourses.push(course);
        totalElectiveCredits += twoCreditElectives.includes(course) ? 2 : 3;
      } else {
        recommendedElectiveCourses.push(course);
      }
    });

    const otherCollegeCredits = (allText.match(/타단과대 전공/g) || []).length;
    if (otherCollegeCredits > 0) {
      totalElectiveCredits += otherCollegeCredits;
      completedElectiveCourses.push(`타단과대(자연대, 농생대, 공대, 수의대, 치대, 혁신공유학부) 전공 (${otherCollegeCredits}학점)`);
    }

    const remainingCredits = Math.max(0, requiredElectiveCredits - totalElectiveCredits);

    analysisResult["전공 선택"] = {
      description: "12학점 이상 이수해야 합니다. <br>*국제의학의 이해, 몸 속으로의 여행, 세계에술 속 의학의 이해, 통일의료-2학점, 그외 3학점",
      displayType: "credit_count",
      completed: completedElectiveCourses,
      recommended: recommendedElectiveCourses,
      completedCredits: totalElectiveCredits,
      requiredCredits: requiredElectiveCredits,
      remainingCredits
    };

    // ======================================================
    // 4. 필수 교양 과목명 변경 및 추가를 원하는 경우, 아래를 수정해주세요!
    // ======================================================
    const fixedLiberalArts = [
      "대학글쓰기 1", "대학글쓰기 2: 과학기술글쓰기", "말하기와 토론",
      "생물학", "생물학실험", "생명과학을 위한 수학/고급수학+수연",
      "화학/고급화학", "화학실험"
    ];
    const foreignLanguageOptions = ["고급영어", "대학영어1", "대학영어2", "외국어1", "외국어2"];
    const completedLiberalArts = [];
    const remainingLiberalArts = [];

    fixedLiberalArts.forEach(course => {
      if (allText.includes(course)) completedLiberalArts.push(course);
      else remainingLiberalArts.push(course);
    });

    let foreignLanguageCount = 0;
    foreignLanguageOptions.forEach(lang => {
      if (allText.includes(lang)) {
        completedLiberalArts.push(lang);
        foreignLanguageCount++;
      }
    });

    const neededLanguages = 2 - foreignLanguageCount;
    if (neededLanguages > 0)
      remainingLiberalArts.push(`영어/외국어 (${neededLanguages}과목 추가 필요)`);

    analysisResult["필수 교양"] = {
      description: "아래 교양 과목을 모두 이수해야 합니다.",
      displayType: "list_all",
      completed: completedLiberalArts,
      remaining: remainingLiberalArts
    };

    // ======================================================
    // 5. 지성의 열쇠 영역명 및 과목명은 이 파일 맨 위에서 이미 기록이 되어있습니다! 수정을 원하는 경우, 그 부분을 수정해주세요.
    // ======================================================
    const completedAcademiaCourses = [];
    const completedGroups = new Set();
    const completedGroupCredits = {}; 
    let totalAcademiaCredits = 0;
    const requiredAcademiaCredits = 9; 
    const requiredGroupCredit = 3; 

    allAcademiaCourses.forEach(course => {
      if (allText.includes(course.name)) {
        completedAcademiaCourses.push(course);
        completedGroups.add(course.group);
        totalAcademiaCredits += 3; 
        completedGroupCredits[course.group] = (completedGroupCredits[course.group] || 0) + 3;
      }
    });

   
    const remainingGroups = allAcademiaGroups.filter(groupName => (completedGroupCredits[groupName] || 0) < requiredGroupCredit);

    const recommendedCoursesByGroup = {};
    remainingGroups.forEach(groupName => {
      recommendedCoursesByGroup[groupName] = allAcademiaCourses
        .filter(c => c.group === groupName)
        .map(c => c.name);
    });

    const isGroupMet = remainingGroups.length === 0;

    analysisResult["지성의 열쇠"] = {
     description: "3개 영역 모두에서 3학점 이상, 총 9학점 이상 이수해야 합니다. (모든 과목 3학점)",
      displayType: "academia_group_count",
      completedCourses: completedAcademiaCourses,
      completedGroupCount: allAcademiaGroups.length - remainingGroups.length, 
      requiredGroupCount: allAcademiaGroups.length, 
      totalAcademiaCredits,
      requiredCredits: requiredAcademiaCredits,
      remainingGroups,
      recommendedCoursesByGroup,
      isGroupMet
    };
// ======================================================
// 6. 베리타스 (3학점 이상) 
// ======================================================
    const requiredVeritasCredits = 3;
    let totalVeritasCredits = 0;
    const completedVeritasCourses = [];
    const recommendedVeritasCourses = [];

    allVeritasCourses.forEach(course => {
        if (allText.includes(course)) {
            completedVeritasCourses.push(course);
            totalVeritasCredits += 3;
        } else {
            recommendedVeritasCourses.push(course);
        }
    });

    const remainingVeritasCredits = Math.max(0, requiredVeritasCredits - totalVeritasCredits);

    analysisResult["베리타스"] = {
        description: "3학점 이상 이수해야 합니다. (모든 과목 3학점)",
        displayType: "credit_count",
        completed: completedVeritasCourses,
        recommended: recommendedVeritasCourses,
        completedCredits: totalVeritasCredits,
        requiredCredits: requiredVeritasCredits,
        remainingCredits: remainingVeritasCredits
    };
   // ======================================================
// 7. 예체능 과목명 변경 및 과목 추가를 원하는 경우, 아래를 수정해주세요!
// ======================================================
const allArtsAndSportsCourses = [
    "교양연주-가야금", "교양연주-거문고", "교양연주-단소", "교양연주-색소폰1",
    "교양연주-합창", "교양연주-해금", "골프초급", "교양연주",
    "농구초급", "달리기와 건강", "댄스스포츠", "도예의 기초", "배구",
    "배드민턴초급", "소묘의 기초", "수묵화의 기초", "수영 1", "수영 2",
    "수영 3", "수영 4", "수영 5", "수채화의 기초", "야구", "양궁", "에어로빅",
    "운동과 건강", "체력단련", "축구", "탁구초급", "탁구중급",
    "태권도", "테니스초급", "테니스중급", "핸드볼", "호신술", "한국무용", "현대무용"
];

// 예체능에서 분석을 위해 2학점 예체능 실기 과목만 따로 빼놓은 부분입니다. 해당 부분 수정을 원하는 경우, 아래를 수정해주세요!
const twoCreditArts = ["도예의 기초", "소묘의 기초", "수묵화의 기초", "수채화의 기초"];

const requiredArtsCredits = 3;
let totalArtsCredits = 0;
const completedArtsCourses = [];
const recommendedArtsCourses = [];

allArtsAndSportsCourses.forEach(course => {
    if (allText.includes(course)) {
        completedArtsCourses.push(course);
        totalArtsCredits += twoCreditArts.includes(course) ? 2 : 1;
    } else {
        recommendedArtsCourses.push(course);
    }
});

const extraArtsCredits = (allText.match(/음미대, 미학과 전공\/교양/g) || []).length;
if (extraArtsCredits > 0) {
    totalArtsCredits += extraArtsCredits;
    completedArtsCourses.push(`음미대, 인문대 미학과 전공/교양 (${extraArtsCredits}학점)`);
}

const remainingArtsCredits = Math.max(0, requiredArtsCredits - totalArtsCredits);

analysisResult["예체능"] = {
    description: "3학점 이상 이수해야 합니다. <br>*도예의 기초, 소묘의 기초, 수묵화의 기초, 수채화의 기초-2학점, 그외 1학점",
    displayType: "credit_count", // '전공 선택'과 동일한 표시 형식을 사용
    completed: completedArtsCourses,
    recommended: recommendedArtsCourses,
    completedCredits: totalArtsCredits,
    requiredCredits: requiredArtsCredits,
    remainingCredits: remainingArtsCredits
};

      // ======================================================
// 8. "필수 수료 요건" 분석 파트입니다. 필수 수료 요건이 변경될 경우, 아래를 수정해주세요! 작은 따옴표 안은 그대로 유지하고, 오른쪽의 항목명만 수정하시길 바랍니다!
// ======================================================

const requiredChecklistKeys = ['volunteer', 'cpr', 'leadership', 'reading'];
const completedRequiredChecks = [];
const remainingRequiredChecks = [];

const requiredLabels = {
    'volunteer': '60시간 이상의 봉사활동 (보라매병원 포함)',
    'cpr': 'CPR 교육 이수',
    'leadership': '인성·리더십 교육 모듈1, 모듈2 이수',
    'reading': '독서 일기 20편 이상 제출'
};

requiredChecklistKeys.forEach(key => {
    if (checklistData[key]) {
        completedRequiredChecks.push(key);
    } else {
        remainingRequiredChecks.push(key);
    }
});

analysisResult["필수 수료 요건"] = {
    description: "아래 4개 요건을 모두 충족해야 합니다.",
    displayType: "simple_checklist", // ★ 새로운 타입
    completed: completedRequiredChecks,
    remaining: remainingRequiredChecks,
    labels: requiredLabels
};

// ======================================================
// 9. "선택 수료 요건" 분석 파트입니다. 선택 수료 요건이 변경될 경우, 아래를 수정해주세요! 작은 따옴표 안은 그대로 유지하고, 오른쪽의 항목명만 수정하시길 바랍니다!
// ======================================================
const electiveChecklistKeys = ['human', 'study', 'cpm', 'teps'];
const completedElectiveChecks = [];
const requiredElectiveCount = 2;

const electiveLabels = {
    'human': '인문사회계열 과목 20학점 이상 이수',
    'study': '의학 연구의 실제(전선, 3학점) 수강',
    'cpm': 'CPM(맞춤형 교육과정) 이수',
    'teps': 'TEPS 453점, IBT TOEFL 114점 이상'
};

electiveChecklistKeys.forEach(key => {
    if (checklistData[key]) {
        completedElectiveChecks.push(key);
    }
});

const neededElectiveCount = Math.max(0, requiredElectiveCount - completedElectiveChecks.length);

analysisResult["선택 수료 요건"] = {
    description: `4개 요건 중 2개 이상을 충족해야 합니다.`,
    displayType: "count_checklist", 
    completed: completedElectiveChecks,
    completedCount: completedElectiveChecks.length,
    requiredCount: requiredElectiveCount,
    neededCount: neededElectiveCount,
    labels: electiveLabels
};
// ======================================================
// 10. 기타 (12학점 이상) 
// ======================================================
    let excessElectiveCredits = Math.max(0, totalElectiveCredits - requiredElectiveCredits);
    const ELECTIVE_CAP = 7;
    if (excessElectiveCredits > ELECTIVE_CAP) {
        excessElectiveCredits = ELECTIVE_CAP;
    }

    let excessAcademiaCredits = Math.max(0, totalAcademiaCredits - requiredAcademiaCredits);
    let excessVeritasCredits = Math.max(0, totalVeritasCredits - requiredVeritasCredits); // 👈 베리타스 초과 학점 포함
    let excessArtsCredits = Math.max(0, totalArtsCredits - requiredArtsCredits);

    const otherCredits = (allText.match(/기타 학점/g) || []).length;

    const requiredOtherCredits = 12;

    // 초과 학점과 일반 교양 학점을 합산
    const totalOtherCredits = excessElectiveCredits + excessAcademiaCredits + excessVeritasCredits + excessArtsCredits + otherCredits;
    const remainingOtherCredits = Math.max(0, requiredOtherCredits - totalOtherCredits);

    const otherDescription = `
        *일반 교양 ${otherCredits}학점 + 
        기타(전선 초과 ${excessElectiveCredits}학점 + 
        지성의열쇠 초과 ${excessAcademiaCredits}학점 + 
        베리타스 초과 ${excessVeritasCredits}학점 +
        예체능 초과 ${excessArtsCredits}학점)
    `;

    analysisResult["기타"] = {
        description: otherDescription,
        displayType: "credit_count_simple",
        completedCredits: totalOtherCredits,
        requiredCredits: requiredOtherCredits,
        remainingCredits: remainingOtherCredits
    };


    return res.status(200).json({ success: true, analysisResult });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
