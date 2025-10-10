const stringSimilarity = require('string-similarity');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    // 1. 프론트엔드에서 보낸 데이터 가져오기
    const { text: allText, checklist } = JSON.parse(event.body);
    if (!allText) {
      return { statusCode: 400, body: '분석할 텍스트가 없습니다.' };
    }

    // 2. 수료 기준 데이터 파일 읽어오기
    const requirementsPath = path.join(__dirname, '..', '..', 'requirements.json');
    const requirementsData = JSON.parse(fs.readFileSync(requirementsPath, 'utf8'));
    const ocrWords = [...new Set(allText.match(/[a-zA-Z0-9가-힣]{2,}/g) || [])];
    
    // 3. 분석 로직 시작
    const analysisResult = {};
    const allRequiredCourseNames = new Set();

    for (const category in requirementsData) {
        const categoryData = requirementsData[category];
        const completed = [];
        let remaining = [];
        let completedCount = 0;
        let requiredCount = 0;
        let displayType = 'default';

        switch (category) {
            case "전공 필수":
                displayType = 'list_all';
                categoryData.courses.forEach(course => {
                    const courseName = typeof course === 'object' ? course.name : course;
                    allRequiredCourseNames.add(courseName);

                    const matches = stringSimilarity.findBestMatch(courseName, ocrWords);

                    // 1. 기본 유사도 기준을 0.2로 설정
                    let threshold = 0.2;

                    // 2. '의예과신입생세미나' 과목일 경우 기준을 0.5로 변경
                    if (courseName === "의예과신입생세미나") {
                        threshold = 0.5;
                    }

                    // 3. 최종 설정된 기준(threshold)으로 이수 여부 판단
                    if (matches.bestMatch.rating > threshold) {
                        completed.push(courseName);
                    } else {
                        remaining.push(courseName);
                    }
                });
                break;

            case "전공 선택":
                displayType = 'count';
                requiredCount = 4;
                categoryData.courses.forEach(course => {
                    const courseName = typeof course === 'object' ? course.name : course;
                    allRequiredCourseNames.add(courseName);
                    const matches = stringSimilarity.findBestMatch(courseName, ocrWords);
                    if (matches.bestMatch.rating > 0.5) {
                        completed.push(courseName);
                    }
                });
                completedCount = completed.length;
                break;

            // analyze.js

           // analyze.js

            // analyze.js

            case "필수 교양":
                displayType = 'list_all'; 
                const foreignLanguages = [
                    "한국어", "중국어", "한문", "프랑스어", "독일어", "러시아어", 
                    "스페인어", "포르투갈어", "몽골어", "스와힐리어", "이태리어", 
                    "히브리어", "라틴어", "그리스어", "말레이-인도네시아어", 
                    "산스크리트어", "베트남어", "아랍어", "힌디어", "일본어",
                    "독문 강독"
                ];
                const specialCourses = [
                    "대학 글쓰기 1", 
                    "대학 글쓰기 2: 과학기술글쓰기", 
                    "생물학", 
                    "생물학실험",
                    "대학영어 1",
                    "대학영어 2"
                ];

                // --- 1단계: 이수한 모든 과목('completed' 배열)을 먼저 확정합니다 ---

                // '대학 글쓰기' 처리
                if (allText.includes("대학") && allText.includes("글쓰")) {
                    if (allText.includes("과학기술글")) {
                        completed.push("대학 글쓰기 2: 과학기술글쓰기");
                    } else {
                        completed.push("대학 글쓰기 1");
                    }
                }
                // '생물학' 처리
                if (allText.includes("생물학실")) {
                    completed.push("생물학실험");
                } else if (allText.includes("생물학")) {
                    completed.push("생물학");
                }
                // '대학영어' 처리 (더 정확한 정규식 사용)
                if (/(대학영어|대학 영어)\s*2/.test(allText)) {
                    completed.push("대학영어 2");
                } else if (/(대학영어|대학 영어)\s*1/.test(allText)) {
                    completed.push("대학영어 1");
                }
                
                // 외국어 처리
                for (const lang of foreignLanguages) {
                    if (stringSimilarity.findBestMatch(lang, ocrWords).bestMatch.rating > 0.6) {
                        if (!completed.includes(lang)) completed.push(lang);
                        break; // 하나만 찾으면 중단
                    }
                }

                // 나머지 일반 과목 처리
                const otherCourses = categoryData.courses.filter(course => {
                    const courseName = typeof course === 'object' ? course.name : course;
                    return !foreignLanguages.includes(courseName) && !specialCourses.includes(courseName);
                });
                otherCourses.forEach(course => {
                    const courseName = typeof course === 'object' ? course.name : course;
                    if (stringSimilarity.findBestMatch(courseName, ocrWords).bestMatch.rating > 0.5) {
                        if (!completed.includes(courseName)) completed.push(courseName);
                    }
                });

                // --- 2단계: 확정된 'completed' 목록을 기준으로 'remaining' 목록을 단 한번만 생성합니다 ---
                const allRequiredInCat = categoryData.courses.map(c => typeof c === 'object' ? c.name : c);
                const isForeignLangGroupCompleted = completed.some(c => foreignLanguages.includes(c));

                // 전체 필수 목록에서, 이수했거나(completed) 외국어 그룹에 속한 과목을 제외하고 미이수 목록을 만듭니다.
                remaining = allRequiredInCat.filter(courseName => 
                    !completed.includes(courseName) && !foreignLanguages.includes(courseName)
                );
                
                // 외국어 그룹을 이수하지 못했다면, 미이수 목록에 "외국어 (택1)"을 추가합니다.
                if (!isForeignLangGroupCompleted) {
                    remaining.push("외국어 (택1)");
                }

                // 마지막으로, 모든 과목 이름을 Set에 추가합니다.
                allRequiredInCat.forEach(courseName => allRequiredCourseNames.add(courseName));
                break;
            
            case "학문의 세계":
                displayType = 'group_count';
                requiredCount = 3;
                const completedGroups = new Set();
                const allGroups = new Set(categoryData.courses.map(course => course.group));
                
                ocrWords.forEach(word => {
                    const matches = stringSimilarity.findBestMatch(word, categoryData.courses.map(c => c.name));
                    if (matches.bestMatch.rating > 0.5) {
                        const matchedCourseName = matches.bestMatch.target;
                        const originalCourse = categoryData.courses.find(c => c.name === matchedCourseName);
                        if (originalCourse) {
                            completedGroups.add(originalCourse.group);
                            if (!completed.some(c => c.name === originalCourse.name)) {
                                completed.push({ name: originalCourse.name, group: originalCourse.group });
                            }
                        }
                    }
                });
                remaining = Array.from(allGroups).filter(group => !completedGroups.has(group));
                completedCount = completedGroups.size;
                categoryData.courses.forEach(course => allRequiredCourseNames.add(course.name));
                break;

            case "예체능":
                displayType = 'count';
                requiredCount = 3;
                categoryData.courses.forEach(course => {
                    const courseName = typeof course === 'object' ? course.name : course;
                    allRequiredCourseNames.add(courseName);
                    const matches = stringSimilarity.findBestMatch(courseName, ocrWords);
                    if (matches.bestMatch.rating > 0.5) {
                        if (!completed.includes(courseName)) {
                            completed.push(courseName);
                        }
                    }
                });
                completedCount = completed.length;
                break;
        }

        analysisResult[category] = {
            description: categoryData.description,
            completed,
            remaining,
            completedCount,
            requiredCount,
            displayType,
        };
    }

    // ...
analysisResult["비교과"] = {
    description: "비교과 수료 요건 달성 현황입니다.",
    data: checklist,
    displayType: 'checklist'
};
analysisResult["기타 이수 과목"] = {
    description: "수료 기준에 포함되지 않은 이수 과목 목록입니다.",
    completed: otherCompletedCourses,
    displayType: 'list_completed_only'
};


    // 5. 최종 분석 결과 전송
    return {
        statusCode: 200,
        body: JSON.stringify(analysisResult),
    };

  } catch (error) {
    console.error('백엔드 오류:', error);
    return { statusCode: 500, body: JSON.stringify({ message: '분석 중 서버에서 오류가 발생했습니다.' }) };
  }
};
