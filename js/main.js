(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSmoothScroll();
        initHeaderScroll();
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

    /* 디자인 섹션: 아이템 클릭 시 모달 열기 (원본 이미지 크기) */
    function initDesignModal() {
        var modal = document.getElementById('design_modal');
        var modalImg = modal && modal.querySelector('.design_modal_img');
        var modalClose = modal && modal.querySelector('.design_modal_close');
        var modalOverlay = modal && modal.querySelector('.design_modal_overlay');
        var modalContent = modal && modal.querySelector('.design_modal_content');
        var loadingEl = modal && modal.querySelector('.design_modal_loading');

        if (!modal || !modalImg) return;

        var designItems = document.querySelectorAll('.design_item');
        designItems.forEach(function(item) {
            var img = item.querySelector('img');
            if (!img) return;

            item.addEventListener('click', function() {
                var src = img.getAttribute('src');
                var alt = img.getAttribute('alt') || '디자인 이미지';
                if (!src) return;

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';

                if (loadingEl) loadingEl.style.display = 'block';
                modalImg.style.opacity = '0';
                modalImg.removeAttribute('src');

                var newImg = new Image();
                newImg.onload = function() {
                    modalImg.setAttribute('src', src);
                    modalImg.setAttribute('alt', alt);
                    if (loadingEl) loadingEl.style.display = 'none';
                    modalImg.style.opacity = '1';
                };
                newImg.onerror = function() {
                    if (loadingEl) {
                        loadingEl.textContent = '이미지를 불러올 수 없습니다';
                        loadingEl.style.display = 'block';
                    }
                };
                newImg.src = src;
            });
        });

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (loadingEl) {
                loadingEl.style.display = 'none';
                loadingEl.textContent = '로딩 중...';
            }
            modalImg.removeAttribute('src');
            modalImg.style.opacity = '0';
        }

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    /* 스킬 무한 스크롤: 리스트 아이템 복제 → 한 세트 너비만큼 왼쪽으로 이동해 루프 */
    function initSkillsScroll() {
        var list = document.querySelector('.skills_list');
        if (!list) return;

        var items = list.querySelectorAll('.skill_item');
        items.forEach(function(item) {
            list.appendChild(item.cloneNode(true));
        });

        var all = list.querySelectorAll('.skill_item');
        var half = all.length / 2;
        if (all[half]) {
            list.style.setProperty('--skills-set-width', all[half].offsetLeft + 'px');
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
                    
                    // GSAP ScrollToPlugin 사용
                    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
                        gsap.registerPlugin(ScrollToPlugin);
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: {
                                y: targetElement,
                                offsetY: 80 // 헤더 높이만큼 오프셋
                            },
                            ease: 'power2.inOut'
                        });
                    } else {
                        // GSAP이 없을 경우 기본 스무스 스크롤
                        const headerHeight = 80;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
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
                    
                    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
                        gsap.registerPlugin(ScrollToPlugin);
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: {
                                y: targetElement,
                                offsetY: 0
                            },
                            ease: 'power2.inOut'
                        });
                    } else {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        }
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
