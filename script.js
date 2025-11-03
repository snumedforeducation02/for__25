// ===================================================
// ❗️❗️ script.js 파일 전체를 이 코드로 덮어쓰세요 ❗️❗️
// (필수/선택 요건 분리, 목록 스타일링 로직 추가)
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
    
    // (월 1회 제한 로직 삭제됨)

    // 로딩 UI 표시
    loadingIndicator.classList.remove('hidden');
    resultArea.innerHTML = '';
    
    try {
        // --- 1. 사용자가 선택한 과목 데이터 수집 ---
        const completedCourses = [];

        // (데이터 수집 로직은 모두 동일)
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

        // (결과 표시 버그 수정됨)
        const responseData = await response.json();
        displayResults(responseData.analysisResult); 

        // (localStorage.setItem 삭제됨)

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
    
    // ❗️ [수정 1] "비교과"를 "필수 수료 요건", "선택 수료 요건"으로 변경
    const categoryOrder = [
        "전공 필수", "전공 선택", "필수 교양", 
        "학문의 세계", "예체능", 
        "필수 수료 요건", "선택 수료 요건"
    ];
    
    // ❗️ [수정 2] checklistLabels 변수 삭제 (이제 서버에서 받음)

    if (!data) {
        resultArea.innerHTML = '<p class="error">분석 결과를 받아오는 데 실패했습니다.</p>';
        return;
    }

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

            case 'credit_count': // '전공 선택' 및 '예체능'
                const isCreditsCompleted = details.remainingCredits === 0;
                html += `<p class="summary ${isCreditsCompleted ? 'completed' : 'in-progress'}"><strong>상태: ${details.requiredCredits}학점 중 ${details.completedCredits}학점 이수 (${details.remainingCredits}학점 남음) ${isCreditsCompleted ? '✔️' : ''}</strong></p>`;
                if (details.completed.length > 0) {
                    html += `<p><strong>✅ 이수한 과목:</strong> ${details.completed.join(', ')}</p>`;
                }
                if (details.recommended.length > 0 && !isCreditsCompleted) {
                    html += `<p><strong>💡 추천 과목:</strong> ${details.recommended.join(', ')}</p>`;
                }
                break;

            case 'academia_group_count': // '학문의 세계'
                const isGroupMet = details.completedGroupCount >= details.requiredGroupCount;
                const isCreditMet = details.totalAcademiaCredits >= details.requiredCredits;
                const remainingGroupsCount = Math.max(0, 5 - details.completedGroupCount);
                const remainingCredits = Math.max(0, details.requiredCredits - details.totalAcademiaCredits);

                html += `<p class="summary ${isGroupMet ? 'completed' : 'in-progress'}"><strong>그룹: 5개 영역 중 ${details.completedGroupCount}개 영역 이수 (${remainingGroupsCount}개 영역 남음) ${isGroupMet ? '✔️' : ''}</strong></p>`;
                html += `<p class="summary ${isCreditMet ? 'completed' : 'in-progress'}"><strong>학점: ${details.requiredCredits}학점 중 ${details.totalAcademiaCredits}학점 이수 (${remainingCredits}학점 남음) ${isCreditMet ? '✔️' : ''}</strong></p>`;

                if (details.completedCourses.length > 0) {
                    const completedList = details.completedCourses.map(c => `${c.name} (${c.group})`).join(', ');
                    html += `<p><strong>✅ 이수한 과목 (영역):</strong> ${completedList}</p>`;
                }
                if (!isGroupMet && details.remainingGroups.length > 0) {
                    html += `<p><strong>📝 채워야 할 영역:</strong> ${details.remainingGroups.join(', ')}</p>`;
                    html += '<div class="recommendation-area"><strong>💡 영역별 들을 수 있는 교양 (클릭하여 확인):</strong>';
                    for (const groupName of details.remainingGroups) {
                        const coursesInGroup = details.recommendedCoursesByGroup[groupName] || [];
                        const elementId = `courses-list-${groupName.replace(/[^a-zA-Z0-9]/g, '')}`; 
                        html += `<button class="toggle-button" onclick="toggleCourseList('${elementId}')">${groupName} 과목 목록 보기 (${coursesInGroup.length}개)</button>`;
                        
                        // ❗️ [수정 3] "한 줄에 하나씩" 리스트로 변경
                        const courseListHtml = coursesInGroup.map(course => `<li>${course}</li>`).join('');
                        html += `<div id="${elementId}" class="course-list-hidden">
                                     <ul class="recommended-list">${courseListHtml}</ul>
                                 </div>`;
                    }
                    html += '</div>';
                }
                break;
                
            // ❗️ [수정 4] 'checklist' 케이스 삭제
            
            // ❗️ [수정 5] "필수 수료 요건"을 위한 새 케이스
            case 'simple_checklist':
                const completedItems = details.completed.map(key => details.labels[key]);
                const remainingCheckItems = details.remaining.map(key => details.labels[key]);
                
                html += `<p><strong>✅ 완료한 요건:</strong> ${completedItems.length > 0 ? completedItems.join(', ') : '없음'}</p>`;
                html += `<p><strong>📝 남은 요건:</strong> ${remainingCheckItems.length > 0 ? remainingCheckItems.join(', ') : '모두 완료'}</p>`;
                break;

            // ❗️ [수정 6] "선택 수료 요건"을 위한 새 케이스
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

/**
 * 토글 버튼 클릭 시 과목 목록을 보여주거나 숨깁니다.
 * @param {string} elementId - 보여주거나 숨길 div의 ID
 */
function toggleCourseList(elementId) {
    const listElement = document.getElementById(elementId);
    if (listElement) {
        // ❗️ [수정 7] CSS 클래스로 제어 (더 부드러움)
        listElement.classList.toggle('visible');
    }
}
