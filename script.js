// script.js

const analyzeButton = document.getElementById('analyze-button');
const fileInput = document.getElementById('timetable-files');
const resultArea = document.getElementById('result-area');
const loadingIndicator = document.getElementById('loading');
const loadingText = loadingIndicator.querySelector('p'); // 로딩 텍스트 요소

// '분석 시작!' 버튼 클릭 이벤트
analyzeButton.addEventListener('click', async () => {
    if (fileInput.files.length === 0) {
        alert('시간표 사진을 선택해주세요!');
        return;
    }

    // 로딩 시작
    loadingIndicator.classList.remove('hidden');
    resultArea.innerHTML = '';
    
    try {
        let allText = '';
        const files = Array.from(fileInput.files);

        // Tesseract.js로 각 이미지를 순서대로 텍스트로 변환
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            loadingText.textContent = `이미지 분석 중 (${i + 1}/${files.length})... 잠시만 기다려주세요.`;
            
            const worker = await Tesseract.createWorker('kor'); // 한국어 모델 사용
            
            await worker.setParameters({
        tessedit_char_blacklist: '0123456789',
    });
            
            const ret = await worker.recognize(file);
            allText += ret.data.text + '\n';
            await worker.terminate(); // 작업 완료 후 worker 종료
        }

        // --- 여기에 체크리스트 데이터 수집 로직 추가 ---
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

        loadingText.textContent = '분석 결과를 서버에서 받아오는 중...';

         // 추출된 텍스트와 체크리스트 데이터를 백엔드로 전송
        const response = await fetch('/.netlify/functions/analyze', {
            method: 'POST',
            // body에 checklist 데이터 추가
            body: JSON.stringify({ text: allText, checklist: checklistData }), 
        });

        if (!response.ok) {
            throw new Error('서버에서 오류가 발생했습니다.');
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        console.error('분석 중 오류 발생:', error);
        resultArea.innerHTML = `<p style="color: red;">분석에 실패했습니다. 다시 시도해주세요.</p>`;
    } finally {
        loadingIndicator.classList.add('hidden');
        loadingText.textContent = '분석 중입니다... 잠시만 기다려주세요.'; // 기본 텍스트로 복구
    }
});

// script.js

// 분석 결과를 HTML로 만들어 화면에 표시하는 함수
function displayResults(data) {
    let html = '<h2>🔍 분석 결과</h2>';
    const categoryOrder = ["전공 필수", "전공 선택", "필수 교양", "학문의 세계", "예체능", "기타 이수 과목"];

    for (const category of categoryOrder) {
        if (!data[category]) continue;
        const details = data[category];
        
        html += `<div class="category-result"><h3>${category}</h3>`;
        if (details.description) {
            html += `<p class="description">${details.description}</p>`;
        }
        html += `<div class="result-content">`;

        // 백엔드에서 받은 displayType에 따라 UI를 다르게 생성
        switch (details.displayType) {
            case 'list_all':
                html += `<p><strong>✅ 이수한 과목:</strong> ${details.completed.length > 0 ? details.completed.join(', ') : '없음'}</p>`;
                html += `<p><strong>📝 미이수 과목:</strong> ${details.remaining.length > 0 ? details.remaining.join(', ') : '없음'}</p>`;
                break;

            case 'list_remaining_custom':
    // remaining 배열의 각 항목이 객체인지 확인하고, 텍스트로 변환
    const remainingItems = details.remaining.map(item => {
        if (typeof item === 'object' && item !== null) {
            // 필요에 따라 더 구체적인 처리가 가능하지만, 여기서는 '외국어'로 통일
            return "외국어 (택1)";
        }
        return item; // 텍스트는 그대로 반환
    });
    // 중복 제거 (만약의 경우를 대비)
    const uniqueRemainingItems = [...new Set(remainingItems)];
    html += `<p><strong>📝 미이수 항목:</strong> ${uniqueRemainingItems.length > 0 ? uniqueRemainingItems.join(', ') : '모두 이수 완료'}</p>`;
    break;

            case 'count':
                const isCompleted = details.completedCount >= details.requiredCount;
                html += `<p class="summary ${isCompleted ? 'completed' : 'in-progress'}">
                            <strong>상태: ${details.requiredCount}개 중 ${details.completedCount}개 이수 ${isCompleted ? '✔️' : ''}</strong>
                         </p>`;
                if (details.completed.length > 0) {
                  html += `<p><strong>✅ 이수한 과목:</strong> ${details.completed.join(', ')}</p>`;
                }
                break;

            case 'group_count':
                const isGroupCompleted = details.completedCount >= details.requiredCount;
                html += `<p class="summary ${isGroupCompleted ? 'completed' : 'in-progress'}">
                            <strong>상태: 5개 영역 중 ${details.completedCount}개 영역 이수 (3개 이상 필요) ${isGroupCompleted ? '✔️' : ''}</strong>
                         </p>`;
                if (details.completed.length > 0) {
                    // 이수한 과목과 그 과목이 속한 그룹을 함께 표시
                    const completedCoursesWithGroup = details.completed.map(c => `${c.name} (${c.group})`);
                    html += `<p><strong>✅ 이수한 과목 (영역):</strong> ${completedCoursesWithGroup.join(', ')}</p>`;
                }
                if (details.remaining.length > 0) {
                    html += `<p><strong>📝 남은 영역:</strong> ${details.remaining.join(', ')}</p>`;
                }
                break;
            
            case 'list_completed_only':
                if (details.completed.length > 0) {
                  html += `<p><strong>✅ 이수한 과목:</strong> ${details.completed.join(', ')}</p>`;
                } else {
                  html += `<p>이수한 과목이 없습니다.</p>`;
                }
                break;
        }
        html += `</div></div>`;
    }
    resultArea.innerHTML = html;
}
