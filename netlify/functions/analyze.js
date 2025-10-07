// analyze.js

const stringSimilarity = require('string-similarity');

const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    // 1. 프론트엔드에서 보낸 '텍스트' 데이터 가져오기
    const { text: allText } = JSON.parse(event.body);
    if (!allText) {
      return { statusCode: 400, body: '분석할 텍스트가 없습니다.' };
    }

    // 2. 수료 기준 데이터 파일 읽어오기
    const requirementsPath = path.join(__dirname, '..', '..', 'requirements.json');
    const requirementsData = JSON.parse(fs.readFileSync(requirementsPath, 'utf8'));
    const ocrWords = [...new Set(allText.match(/[a-zA-Z0-9가-힣]{2,}/g) || [])];
    
    // 3. 분석 로직 시작
    const analysisResult = {};
    const allRequiredCourseNames = new Set(); // 기타 과목 분류용

    for (const category in requirementsData) {
        const categoryData = requirementsData[category];
        const completed = [];
        let remaining = [];
        let completedCount = 0;
        let requiredCount = 0;
        let displayType = 'default';

        // 각 카테고리별로 맞춤형 로직 적용
        switch (category) {
            case "전공 필수":
                displayType = 'list_all';

    categoryData.courses.forEach(course => {
        allRequiredCourseNames.add(course);

        // ocrWords 목록과 필수 과목(course)의 유사도를 비교
        const matches = stringSimilarity.findBestMatch(course.name, ocrWords);

        // 가장 유사한 단어의 유사도(rating)가 0.4 이상이면 이수한 것으로 간주
         if (matches.bestMatch.rating > 0.4) {
        completedGroups.add(course.group);
        if (!completed.some(c => c.name === course.name)) {
            completed.push({ name: course.name, group: course.group });
        }
         } else {
            // 유사도가 낮으면 미이수 처리 (필요하다면)
            remaining.push(course); 
        }
    });
                break;

            case "전공 선택":
                displayType = 'count';
                requiredCount = 4;

    categoryData.courses.forEach(course => {
        allRequiredCourseNames.add(course);

        // ocrWords 목록과 필수 과목(course)의 유사도를 비교
        const matches = stringSimilarity.findBestMatch(course.name, ocrWords);

        // 가장 유사한 단어의 유사도(rating)가 0.4 이상이면 이수한 것으로 간주
         if (matches.bestMatch.rating > 0.4) {
        completedGroups.add(course.group);
        if (!completed.some(c => c.name === course.name)) {
            completed.push({ name: course.name, group: course.group });
        }
         } else {
            // 유사도가 낮으면 미이수 처리 (필요하다면)
            remaining.push(course); 
        }
    });
                completedCount = completed.length;
                break;

            case "필수 교양":
    displayType = 'list_remaining_custom';
    const foreignLanguages = ["한국어", "중국어", "한문", "프랑스어", "독일어", "러시아어", "스페인어", "포르투갈어", "몽골어", "스와힐리어", "이태리어", "히브리어", "라틴어", "그리스어", "말레이-인도네시아어", "산스크리트어", "베트남어", "아랍어", "힌디어", "일본어"];
    const nonLanguageCourses = categoryData.courses.filter(c => !foreignLanguages.includes(c));

    // 외국어 그룹 처리 (string-similarity 적용)
    // OCR 단어들과 외국어 목록을 비교해 가장 높은 유사도를 찾음
    const langMatches = stringSimilarity.findBestMatch('외국어', ocrWords.map(word => {
        // 외국어와 유사한 단어가 있는지 확인
        const langMatch = stringSimilarity.findBestMatch(word, foreignLanguages);
        return langMatch.bestMatch.rating > 0.5 ? '외국어' : word;
    }));
    
    if (langMatches.bestMatch.rating < 0.6) { // '외국어'라는 단어 자체나 유사 단어가 없다면
        remaining.push("외국어 (택1)");
    }
    foreignLanguages.forEach(c => allRequiredCourseNames.add(c));

    // 나머지 필수 교양 처리 (string-similarity 적용)
nonLanguageCourses.forEach(course => {
    // course가 객체인지 문자열인지 확인
    const courseName = typeof course === 'object' ? course.name : course;

    allRequiredCourseNames.add(courseName);
    const matches = stringSimilarity.findBestMatch(courseName, ocrWords);
    
    // 유사도가 0.5 미만이면 미이수 과목으로 간주
    if (matches.bestMatch.rating < 0.5) {
        remaining.push(courseName);
    }
});
break;

// ... switch (category) ...
case "학문의 세계":
    displayType = 'group_count';
    requiredCount = 3;
    const completedGroups = new Set();
    const allGroups = new Set(categoryData.courses.map(course => course.group));
    
    // OCR로 인식된 단어 하나하나를 전체 과목 목록과 비교
    ocrWords.forEach(word => {
        // 과목 목록에서 현재 단어(word)와 가장 유사한 과목을 찾음
        const matches = stringSimilarity.findBestMatch(
            word, 
            categoryData.courses.map(c => c.name) // 과목 이름들만 배열로 만듦
        );

        // 가장 유사한 과목의 유사도(rating)가 0.4 이상이면 매칭 성공으로 간주
        if (matches.bestMatch.rating > 0.4) {
            const matchedCourseName = matches.bestMatch.target;
            
            // 매칭된 과목 이름으로 원래 과목 객체를 찾음
            const originalCourse = categoryData.courses.find(c => c.name === matchedCourseName);
            
            if (originalCourse) {
                completedGroups.add(originalCourse.group);
                // completed 배열에는 이수한 것으로 처리된 과목과 그룹 정보를 저장
                // 단, 중복 저장을 방지하기 위해 이미 추가되었는지 확인
                if (!completed.some(c => c.name === originalCourse.name)) {
                    completed.push({ name: originalCourse.name, group: originalCourse.group });
                }
            }
        }
    });

    // 이수한 그룹 목록을 바탕으로 남은 그룹과 이수 카운트 계산
    remaining = Array.from(allGroups).filter(group => !completedGroups.has(group));
    completedCount = completedGroups.size;
    
    // 기타 과목 분류를 위해 모든 과목명을 Set에 추가
    categoryData.courses.forEach(course => allRequiredCourseNames.add(course.name));
    break;

            case "예체능":
    displayType = 'count';
    requiredCount = 3;

    categoryData.courses.forEach(course => {
        // course가 객체일 경우를 대비해 과목 이름(문자열)을 추출
        const courseName = typeof course === 'object' ? course.name : course;

        allRequiredCourseNames.add(courseName);

        // ocrWords 목록과 현재 과목(courseName)의 유사도를 비교
        const matches = stringSimilarity.findBestMatch(courseName, ocrWords);

        // 유사도가 0.4 이상이면 이수한 것으로 간주
        if (matches.bestMatch.rating > 0.4) {
            // 중복 추가 방지
            if (!completed.includes(courseName)) {
                completed.push(courseName);
            }
        }
    });

    completedCount = completed.length;
    break;

    // 4. 기타 이수 과목 분류 (이전과 동일)
    const courseCandidates = allText.match(/[a-zA-Z0-9가-힣]{2,}/g) || [];
    const uniqueCourses = [...new Set(courseCandidates)];
    const otherCompletedCourses = uniqueCourses.filter(course => !allRequiredCourseNames.has(course));
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
    return { statusCode: 500, body: JSON.stringify({ message: '분석 중 서버 오류가 발생했습니다.' }) };
  }
};
