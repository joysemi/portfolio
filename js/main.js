(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSmoothScroll();
        initHeaderScroll();
        initProjectScrollAnimation();
        initSkillsScroll();
        initCustomCursor();
        initDesignTabs();
        initDesignModal();
    });

    /* 디자인 섹션 탭 메뉴 활성화 */
    function initDesignTabs() {
        const tabButtons = document.querySelectorAll('.design_tab');
        const contentPanels = document.querySelectorAll('.design_content');

        if (!tabButtons.length || !contentPanels.length) {
            return;
        }

        function showPanel(activeIndex) {
            tabButtons.forEach(function(btn, i) {
                if (i === activeIndex) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            contentPanels.forEach(function(panel, i) {
                if (i === activeIndex && panel) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });

            /* 탭 전환 시 스크롤 아이템 모두 맨 위로 초기화 */
            var scrollItems = document.querySelectorAll('.design_item_scroll');
            scrollItems.forEach(function(el) {
                el.scrollTop = 0;
            });
        }

        tabButtons.forEach(function(btn, index) {
            btn.addEventListener('click', function() {
                showPanel(index);
            });
        });

        showPanel(0);
    }

    /* 디자인 섹션: 아이템 클릭 시 모달 열기 */
    function initDesignModal() {
        const modal = document.getElementById('design_modal');
        const modalImg = modal.querySelector('.design_modal_img');
        const closeBtn = modal.querySelector('.design_modal_close');
        const overlay = modal.querySelector('.design_modal_overlay');
        const content = modal.querySelector('.design_modal_content');

        document.querySelectorAll('.design_item img').forEach(img => {
            img.addEventListener('click', () => {
            modalImg.src = img.src;
            modalImg.alt = img.alt || '';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            //스크롤 위치 초기화
            content.scrollTop = 0;
            content.scrollLeft = 0;
            });
        });

        function closeModal() {
            modal.classList.remove('active');
            modalImg.removeAttribute('src');
            document.body.style.overflow = '';

            content.scrollTop = 0;
            content.scrollLeft = 0;
        }

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    // 스킬 무한 스크롤 복제
    function initSkillsScroll() {
        const skillsList = document.querySelector('.skills_list');
        const skillItems = Array.from(skillsList.children);
        
        // 2번 더 복제 (총 3세트)
        for(let i = 0; i < 2; i++) {
            skillItems.forEach(item => {
                const clone = item.cloneNode(true);
                skillsList.appendChild(clone);
            });
        }
    }

    /* 스무스 스크롤 기능 */
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('a.nav_link[href^="#"]');
        const logoLink = document.querySelector('h1#logo a[href^="#"]');

        // 네비게이션 링크 스무스 스크롤
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // 로고 링크 스무스 스크롤
        if (logoLink) {
            logoLink.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    /* 프로젝트 아이템 스크롤 애니메이션 */
    function initProjectScrollAnimation() {
        const projectItems = document.querySelectorAll('.project_list .project_item');
        if (!projectItems.length || typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        projectItems.forEach(function(item) {
            gsap.from(item, {
                y: 140,
                opacity: 0.7,
                ease: 'sine.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 100%',
                    end: 'top 30%',
                    scrub: 1.5,
                    //markers: true,
                }
            });
        });
    }

    /* 헤더 스크롤 효과 */
    function initHeaderScroll() {
        const header = document.getElementById('header_wrap');
        const projectSection = document.getElementById('project');
        if (!header || !projectSection) return;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const projectOffsetTop = projectSection.offsetTop;
            const headerHeight = 80;

            // 프로젝트 섹션에 도달했는지 확인
            if (scrollTop >= projectOffsetTop - headerHeight) {
                // 프로젝트 섹션 이후: 하얀색 배경 + 주황색 선
                header.classList.add('header_scrolled');
            } else {
                // 프로젝트 섹션 이전: 주황색 배경
                header.classList.remove('header_scrolled');
            }
        });
    }

    /* 커스텀 커서 초기화 */
    function initCustomCursor() {
        // 커스텀 커서 요소 생성
        const cursor = document.createElement('div');
        cursor.className = 'custom_cursor';
        cursor.innerHTML = '<img src="/portfolio/images/mouse.png" alt="커서">';
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        // 마우스 이동 이벤트
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // 부드러운 애니메이션을 위한 requestAnimationFrame
        function animateCursor() {
            // 부드러운 추적 효과 (lerp)
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

    }

  

})();
