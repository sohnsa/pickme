
document.addEventListener('DOMContentLoaded', function() {
    const drawButton = document.getElementById('drawButton');
    const resetButton = document.getElementById('resetButton');
    const resultContainer = document.getElementById('result');
    const selectedNumbers = document.getElementById('selectedNumbers');

    // 랜덤으로 6명을 뽑는 함수
    function drawCleaningDuty() {
        return new Promise((resolve) => {
            const numbers = [];
            const usedNumbers = new Set();

            // 애니메이션 효과를 위한 지연
            setTimeout(() => {
                // 1부터 28까지 중에서 중복 없이 6개 선택
                while (numbers.length < 6) {
                    const randomNum = Math.floor(Math.random() * 28) + 1;
                    if (!usedNumbers.has(randomNum)) {
                        usedNumbers.add(randomNum);
                        numbers.push(randomNum);
                    }
                }

                // 번호를 오름차순으로 정렬
                numbers.sort((a, b) => a - b);
                resolve(numbers);
            }, 1500); // 1.5초 지연
        });
    }

    // 결과를 화면에 표시하는 함수
    function displayResult(numbers) {
        selectedNumbers.innerHTML = '';
        
        // Bootstrap 그리드 시스템을 활용하여 카드 생성
        numbers.forEach((number, index) => {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-4 col-lg-2';
            
            const numberCard = document.createElement('div');
            numberCard.className = 'number-card';
            numberCard.innerHTML = `<i class="bi bi-person-badge me-1"></i>${number}번`;
            numberCard.style.animationDelay = `${index * 0.1}s`;
            
            col.appendChild(numberCard);
            selectedNumbers.appendChild(col);
        });

        // 결과 컨테이너 표시 (Bootstrap fade-in 효과)
        resultContainer.style.display = 'block';
        resultContainer.style.animation = 'fadeInUp 0.5s ease';
        
        // 리셋 버튼 표시
        resetButton.style.display = 'inline-block';
        drawButton.innerHTML = '<i class="bi bi-dice-3 me-2"></i>다시 뽑기';
    }

    // 초기화 함수
    function reset() {
        // SweetAlert2 확인 다이얼로그
        Swal.fire({
            title: '다시 뽑으시겠습니까?',
            text: "현재 선택된 청소당번이 초기화됩니다.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네, 다시 뽑기',
            cancelButtonText: '취소',
            reverseButtons: true,
            customClass: {
                confirmButton: 'btn btn-primary me-2',
                cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                // 부드러운 페이드아웃 효과
                resultContainer.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    resultContainer.style.display = 'none';
                    resetButton.style.display = 'none';
                    selectedNumbers.innerHTML = '';
                    drawButton.innerHTML = '<i class="bi bi-dice-3 me-2"></i>청소당번 뽑기';
                }, 300);

                Swal.fire({
                    title: '초기화 완료!',
                    text: '새로운 청소당번을 뽑아보세요.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }

    // 뽑기 버튼 이벤트 리스너
    drawButton.addEventListener('click', async function() {
        // 버튼 로딩 상태
        const originalText = drawButton.innerHTML;
        drawButton.disabled = true;
        drawButton.innerHTML = '<span class="loading-spinner me-2"></span>뽑는 중...';

        // SweetAlert2 로딩 다이얼로그
        Swal.fire({
            title: '청소당번을 뽑고 있습니다...',
            html: '잠시만 기다려주세요 <i class="bi bi-hourglass-split"></i>',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const selectedCleaners = await drawCleaningDuty();
            
            // 로딩 다이얼로그 닫기
            Swal.close();
            
            // 결과 표시
            displayResult(selectedCleaners);
            
            // 성공 알림
            Swal.fire({
                title: '청소당번 선정 완료!',
                html: `총 <strong>${selectedCleaners.length}명</strong>이 선택되었습니다.<br>
                       <small class="text-muted">선택된 번호: ${selectedCleaners.join(', ')}</small>`,
                icon: 'success',
                timer: 2500,
                showConfirmButton: false,
                position: 'top-end',
                toast: true
            });

        } catch (error) {
            Swal.fire({
                title: '오류 발생!',
                text: '청소당번을 뽑는 중 문제가 발생했습니다.',
                icon: 'error',
                confirmButtonText: '다시 시도'
            });
        } finally {
            // 버튼 상태 복원
            drawButton.disabled = false;
            drawButton.innerHTML = originalText;
        }
    });

    // 리셋 버튼 이벤트 리스너
    resetButton.addEventListener('click', reset);

    // 페이지 로드 시 환영 메시지
    setTimeout(() => {
        Swal.fire({
            title: '환영합니다! 👋',
            text: '청소당번을 공정하게 뽑아보세요!',
            icon: 'info',
            timer: 3000,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
    }, 500);
});

// 페이드아웃 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(-30px);
    }
}
`;
document.head.appendChild(style);
