// ===================================================
// ❗️❗️ script.js 파일 전체를 이 코드로 덮어쓰세요 ❗️❗️
// (48번 요청: '학문의 세계', '예체능' 버튼 텍스트 버그 수정)
// ===================================================

// HTML 요소들을 가져옵니다.
const analyzeButton = document.getElementById('analyze-button');
const resultArea = document.getElementById('result-area');
const loadingIndicator = document.getElementById('loading');

// --- Choices.js 초기화 ---
const electiveSelectElement = document.getElementById('elective-courses-select');
const choices = new Choices(electiveSelectElement, {
    removeItemButton: true,
    placeholder: true,
    placeholderValue: '수강한 과목을 검색 및 선택하세요',
    searchPlaceholderValue: '과목 검색...',
    duplicateItemsAllowed: false,
});
const academiaSelectElement = document.getElementById('foundations-of-academia-select');
const academiaChoices = new Choices(academiaSelectElement, {
    removeItemButton: true,
    placeholder: true,
    placeholderValue: '수강한 과목을 검색 및 선택하세요',
    searchPlaceholderValue: '과목 검색...',
});
const artsSelectElement = document.getElementById('arts-and-sports-select');
const artsChoices = new Choices(artsSelectElement, {
    removeItemButton: true,
    placeholder: true,
    placeholderValue: '수강한 과목을 검색 및 선택하세요',
    searchPlaceholderValue: '과목 검색...',
});
const languageSelectElement = document.getElementById('foreign-language-select');
const languageChoices = new Choices(languageSelectElement, {
    removeItemButton: true,
    placeholder: true,
    placeholderValue: '수강한 외국어 과목을 검색 및 선택하세요',
    searchPlaceholderValue: '과목 검색...',
    maxItemCount: 2,
    maxItemText: (maxItemCount) => `2개까지만 선택할 수 있습니다.`,
});

// '분석 시작!' 버튼 클릭 이벤트
analyzeButton.addEventListener('click', async () => {
    
    // 로딩 UI 표시
    loadingIndicator.classList.remove('hidden');
    resultArea.innerHTML = '';
    
    try {
        // --- 1. 사용자가 선택한 과목 데이터 수집 ---
        const completedCourses = [];

        document.querySelectorAll('#required-courses-list input[type="checkbox"]:checked').forEach(checkbox => {
            completedCourses.push(checkbox.value);
        });
        const selectedElectives = choices.getValue(true);
        completedCourses.push(...selectedElectives);
        document.querySelectorAll('#liberal-arts-courses-list input[type="checkbox"]:checked').forEach(checkbox => {
            completedCourses.push(checkbox.value);
        }); 
        const selectedLanguages = languageChoices.getValue(true);
        completedCourses.push(...selectedLanguages);
        const selectedAcademia = academiaChoices.getValue(true);
        completedCourses.push(...selectedAcademia);
        const selectedArts = artsChoices.getValue(true);
        completedCourses.push(...selectedArts);
        
        const otherCollegeCheckbox = document.getElementById('other-college-checkbox');
        const otherCollegeCountInput = document.getElementById('other-college-count');
        if (otherCollegeCheckbox && otherCollegeCheckbox.checked && otherCollegeCountInput && otherCollegeCountInput.value) {
            const count = parseInt(otherCollegeCountInput.value, 10) || 0;
            for (let i = 0; i < count; i++) {
                completedCourses.push('타단과대 전공');
            }
        }
        
        const extraAnSCheckbox = document.getElementById('extra-artsandsports-checkbox');
        const extraAnSCountInput = document.getElementById('extra-artsandsports-count'); 
        if (extraAnSCheckbox && extraAnSCheckbox.checked && extraAnSCountInput && extraAnSCountInput.value) {
            const count = parseInt(extraAnSCountInput.value, 10) || 0;
            for (let i = 0; i < count; i++) {
                completedCourses.push('음미대, 미학과 전공/교양');
            }
        }

        const allText = completedCourses.join(' ');

        // --- 2. 비교과 체크리스트 데이터 수집 ---
        const checklistData = {
            'volunteer': document.getElementById('volunteer').checked,
            'cpr': document.getElementById('cpr').checked,
            'leadership': document.getElementById('leadership').checked,
            'reading': document.getElementById('reading').checked,
            'human': document.getElementById('human').checked,
            'study': document.getElementById('study').checked,
            'cpm': document.getElementById('cpm').checked,
            'teps': document.getElementById('teps').checked,
        };

        // --- 3. 백엔드로 데이터 전송 ---
        // (Vercel 기준 /api/analyze, Netlify 기준 /.netlify/functions/analyze)
        const response = await fetch('/api/analyze', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: allText, checklist: checklistData }),
        });

        if (!response.ok) {
            throw new Error('서버에서 오류가 발생했습니다.'); 
        }

        const responseData = await response.json();
        displayResults(responseData.analysisResult); 

    } catch (error) {
        console.error('분석 중 오류 발생:', error);
        resultArea.innerHTML = `<p class="error">분석에 실패했습니다. 모든 항목을 올바르게 선택/입력했는지 확인해주세요. (오류: ${error.message})</p>`;
    } finally {
        loadingIndicator.classList.add('hidden');
    }
});

// 분석 결과를 HTML로 만들어 화면에 표시하는 함수
function displayResults(data) {
    let html = '<h2>🔍 분석 결과</h2>';
    
    const categoryOrder = [
        "전공 필수", "전공 선택", "필수 교양", 
        "학문의 세계", "예체능", 
        "필수 수료 요건", "선택 수료 요건"
    ];
    
    if (!data) {
        resultArea.innerHTML = '<p class="error">분석 결과를 받아오는 데 실패했습니다.</p>';
        return;
    }

    // ❗️ [핵심 수정] 'for (const category of categoryOrder)' 루프가
    // 'displayResults' 함수의 유일한 메인 루프인지 확인 (중첩되지 않았는지 확인)
    for (const category of categoryOrder) {
        if (!data[category]) continue;
        const details = data[category];
        
        html += `<div class="category-result"><h3>${category}</h3>`;
        if (details.description) {
            html += `<p class="description">${details.description}</p>`;
        }
        html += `<div class="result-content">`;

        switch (details.displayType) {
            case 'list_all':
                html += `<p><strong>✅ 이수한 과목:</strong> ${details.completed.length > 0 ? details.completed.join(', ') : '없음'}</p>`;
                html += `<p><strong>📝 미이수 과목:</strong> ${details.remaining.length > 0 ? details.remaining.join(', ') : '없음'}</p>`;
                break;

            case 'list_remaining_custom':
                const remainingItems = details.remaining.map(item => (typeof item === 'object' && item !== null) ? "외국어 (택1)" : item);
                const uniqueRemainingItems = [...new Set(remainingItems)];
                html += `<p><strong>📝 미이수 항목:</strong> ${uniqueRemainingItems.length > 0 ? uniqueRemainingItems.join(', ') : '모두 이수 완료'}</p>`;
                break;

            case 'count':
                const completedCount = details.completed.length;
                const requiredCount = details.requiredCount;
                const isCompleted = completedCount >= requiredCount;
                const neededCount = Math.max(0, requiredCount - completedCount);
                html += `<p class="summary ${isCompleted ? 'completed' : 'in-progress'}"><strong>상태: ${requiredCount}개 중 ${completedCount}개 이수 (${neededCount}개 남음) ${isCompleted ? '✔️' : ''}</strong></p>`;
                if (completedCount > 0) {
                    html += `<p><strong>✅ 이수한 과목:</strong> ${details.completed.join(', ')}</p>`;
                }
                break;
 case 'credit_count':
                const isCreditsCompleted = details.remainingCredits === 0;
                html += `<p class="summary ${isCreditsCompleted ? 'completed' : 'in-progress'}"><strong>상태: ${details.requiredCredits}학점 중 ${details.completedCredits}학점 이수 (${details.remainingCredits}학점 남음) ${isCreditsCompleted ? '✔️' : ''}</strong></p>`;
                if (details.completed.length > 0) html += `<p><strong>✅ 이수한 과목:</strong> ${details.completed.join(', ')}</p>`;
                if (details.recommended.length > 0 && !isCreditsCompleted) {
                    const safeCategoryName = 'category-' + encodeURIComponent(category);
                    const elementId = `courses-list-${safeCategoryName}`;
                    html += `<div class="recommendation-area single-button-area">`;
                    html += `<strong>💡 수강 가능 과목 (클릭하여 확인):</strong>`;
                    html += `<button class="toggle-button" onclick="toggleCourseList('${elementId}')">〈${category}〉 과목 목록</button>`;
                    const courseListHtml = details.recommended.map(c => `<li>${c}</li>`).join('');
                    html += `<div id="${elementId}" class="course-list-hidden"><ul class="recommended-list">${courseListHtml}</ul></div>`;
                    html += `</div>`;
                }
                break;

            case 'academia_group_count':
                const isGroupMet = details.completedGroupCount >= details.requiredGroupCount;
                const isCreditMet = details.totalAcademiaCredits >= details.requiredCredits;
                const remainingGroupsCount = Math.max(0, 5 - details.completedGroupCount);
                const remainingCredits = Math.max(0, details.requiredCredits - details.totalAcademiaCredits);

                html += `<p class="summary ${isGroupMet ? 'completed' : 'in-progress'}"><strong>영역: 5개 영역 중 ${details.completedGroupCount}개 영역 이수 (${remainingGroupsCount}개 영역 남음) ${isGroupMet ? '✔️' : ''}</strong></p>`;
                html += `<p class="summary ${isCreditMet ? 'completed' : 'in-progress'}"><strong>학점: ${details.requiredCredits}학점 중 ${details.totalAcademiaCredits}학점 이수 (${remainingCredits}학점 남음) ${isCreditMet ? '✔️' : ''}</strong></p>`;

                if (details.completedCourses.length > 0) {
                    const completedList = details.completedCourses.map(c => `${c.name} (${c.group})`).join(', ');
                    html += `<p><strong>✅ 이수한 과목 (영역):</strong> ${completedList}</p>`;
                }

                if (!isGroupMet && details.remainingGroups.length > 0) {
                    html += `<p><strong>📝 채워야 할 영역:</strong> ${details.remainingGroups.join(', ')}</p>`;
                    html += '<div class="recommendation-area multi-button-area">';
                    html += '<strong>💡 영역별 들을 수 있는 교양 (클릭하여 확인):</strong>';
                    for (const groupName of details.remainingGroups) {
                        const elementId = `courses-list-${encodeURIComponent(groupName)}`;
                        html += `<button class="toggle-button" onclick="toggleCourseList('${elementId}')">〈${groupName}〉 과목 목록</button>`;
                    }
                    for (const groupName of details.remainingGroups) {
                        const elementId = `courses-list-${encodeURIComponent(groupName)}`;
                        const coursesInGroup = details.recommendedCoursesByGroup[groupName] || [];
                        const courseListHtml = coursesInGroup.map(c => `<li>${c}</li>`).join('');
                        html += `<div id="${elementId}" class="course-list-hidden">
                                     <h4 class="list-title"><span class="highlight">〈${groupName}〉 과목 목록</span></h4>
                                     <ul class="recommended-list">${courseListHtml}</ul>
                                 </div>`;
                    }
                    html += '</div>';
                }
                break;
                
            // (필수 수료 요건)
            case 'simple_checklist':
                const completedItems = details.completed.map(key => details.labels[key]);
                const remainingCheckItems = details.remaining.map(key => details.labels[key]);
                
                html += `<p><strong>✅ 완료한 요건:</strong> ${completedItems.length > 0 ? completedItems.join(', ') : '없음'}</p>`;
                html += `<p><strong>📝 남은 요건:</strong> ${remainingCheckItems.length > 0 ? remainingCheckItems.join(', ') : '모두 완료'}</p>`;
                break;

            // (선택 수료 요건)
            case 'count_checklist':
                const isElecCompleted = details.neededCount === 0;
                html += `<p class="summary ${isElecCompleted ? 'completed' : 'in-progress'}">
                             <strong>상태: ${details.requiredCount}개 이상 중 ${details.completedCount}개 완료 (${details.neededCount}개 더 필요) ${isElecCompleted ? '✔️' : ''}</strong>
                         </p>`;
                
                if (details.completed.length > 0) {
                    const completedElecList = details.completed.map(key => details.labels[key]);
                    html += `<p><strong>✅ 완료한 요건:</strong> ${completedElecList.join(', ')}</p>`;
                }
                break;
        }
        html += `</div></div>`;
    }
    resultArea.innerHTML = html;
}

// ❗️❗️ [수정] 아코디언 기능 (Request 2) ❗️❗️
/**
 * 토글 버튼 클릭 시, 다른 리스트는 닫고 해당 리스트만 열어줍니다 (아코디언)
 * @param {string} elementId - 보여주거나 숨길 div의 ID
 */
function toggleCourseList(elementId) {
    const clickedElement = document.getElementById(elementId);
    if (!clickedElement) return; // 안전 장치

    // 1. 클릭한 리스트가 이미 열려있었는지 확인
    const isAlreadyVisible = clickedElement.classList.contains('visible');

    // 2. 모든 '.course-list-hidden'을 찾아서 'visible' 클래스 제거 (전부 닫기)
    const allOpenLists = document.querySelectorAll('.course-list-hidden.visible');
    allOpenLists.forEach(list => {
        list.classList.remove('visible');
    });

    // 3. 만약 클릭한 리스트가 닫혀있었다면, 'visible' 클래스를 추가 (열기)
    // (이미 열려있었다면, 2단계에서 닫힌 상태로 유지됨)
    if (!isAlreadyVisible) {
        clickedElement.classList.add('visible');
    }
}
