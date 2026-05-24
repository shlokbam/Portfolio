// Initialize navbar
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navList = document.getElementById('navLinks');
    const backdrop = document.getElementById('navBackdrop');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Safety: always reset body scroll on load
    document.body.style.overflow = '';

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    function openMenu() {
        navList.classList.add('active');
        menuBtn.classList.add('open');
        if (backdrop) backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navList.classList.remove('active');
        menuBtn.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuBtn && navList) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navList.classList.contains('active') ? closeMenu() : openMenu();
        });

        // Close when any nav link clicked
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on backdrop click
        if (backdrop) backdrop.addEventListener('click', closeMenu);
    }

}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initScrollAnimations();
    initSkillBars();
    initProjectFilters();
    initProjectViewAll();
    initCertificationFiltering();
    initAchievementsFiltering();
    initContactForm();
    initTypingEffect();
    initExperienceTabs();
    initScrollToTop();
    initProjectAvailability();
    initProfileFlip();
    initResumeChatbot();
});

// Scroll to top button
function initScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// Scroll animations for elements
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Animate skill bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.progress-bar');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.width = `${level}%`;
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Contact form handling
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;

            try {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;

                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        subject: formData.get('subject'),
                        message: formData.get('message')
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showNotification(data.message, 'success');
                    form.reset();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                showNotification(error.message || 'Failed to send message. Please try again.', 'error');
            } finally {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// Typing effect for hero section
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        typeWriter();
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 150; // Balanced offset

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollPosition >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    // Handle end of page (if scrolled to bottom, highlight last section)
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        const lastSection = sections[sections.length - 1];
        if (lastSection) currentSection = lastSection.getAttribute('id');
    }

    if (currentSection) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Initialize active state on page load
document.addEventListener('DOMContentLoaded', function () {
    const currentSection = window.location.hash || '#home';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
});

// Fade-in animation for sections
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Experience Tabs
function initExperienceTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const timelineContainers = document.querySelectorAll('.timeline-container');
    const themeToggle = document.getElementById('theme-toggle');

    // Show all timeline items in the active container
    function showTimelineItems(container) {
        const items = container.querySelectorAll('.timeline-item');
        items.forEach(item => {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
    }

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show selected timeline
            timelineContainers.forEach(container => {
                container.classList.remove('active');
                if (container.id === tabId) {
                    container.classList.add('active');
                    showTimelineItems(container);
                }
            });
        });
    });

    // Initialize first tab
    const firstContainer = document.querySelector('.timeline-container.active');
    if (firstContainer) {
        showTimelineItems(firstContainer);
    }

    // Theme toggle with modern circular ripple View Transition
    themeToggle.addEventListener('click', (e) => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Graceful fallback for browsers that do not support View Transitions API
        if (!document.startViewTransition) {
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            return;
        }

        // Get coordinates of the theme toggle button to center the circular ripple
        const rect = themeToggle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Calculate diagonal distance to the furthest corner of the viewport
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ];

            document.documentElement.animate(
                {
                    clipPath: clipPath
                },
                {
                    duration: 650, // smooth transition speed
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
        });
    });

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Project filtering
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Show all projects on initial load
    projectCards.forEach(card => {
        card.style.display = 'flex';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            const viewAllBar = document.getElementById('viewAllProjectsBar');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                const isMatch = filterValue === 'all' || category.includes(filterValue);

                if (isMatch) {
                    card.style.display = 'flex';
                    card.classList.remove('filtered-out');
                } else {
                    card.style.display = 'none';
                    card.classList.add('filtered-out');
                }
            });

            // Re-apply view all logic after filtering
            if (initProjectViewAll) {
                initProjectViewAll(true); // reset
            }
        });
    });
}

function initProjectViewAll(isReset = false) {
    const grid = document.getElementById('projectsGrid');
    const bar = document.getElementById('viewAllProjectsBar');
    if (!grid || !bar) return;

    const cards = Array.from(grid.querySelectorAll('.project-card:not(.filtered-out)'));
    const limit = 3;

    if (isReset) {
        bar.classList.remove('active');
        bar.querySelector('.bar-text').textContent = 'All Projects';
    }

    const isExpanded = bar.classList.contains('active');

    cards.forEach((card, i) => {
        if (i >= limit && !isExpanded) {
            card.classList.add('hidden-project');
            card.classList.remove('show-project');
        } else {
            card.classList.remove('hidden-project');
            if (i >= limit) card.classList.add('show-project');
        }
    });

    if (cards.length <= limit) {
        bar.style.display = 'none';
    } else {
        bar.style.display = 'flex';
    }

    if (!isReset && !bar.dataset.initialized) {
        bar.onclick = () => {
            const nowExpanded = !bar.classList.contains('active');
            bar.classList.toggle('active');
            bar.querySelector('.bar-text').textContent = nowExpanded ? 'Show Less' : 'All Projects';

            initProjectViewAll(); // Re-run logic to update visibility (defaults to isReset=false)

            if (!nowExpanded) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };
        bar.dataset.initialized = "true";
    }
}
window.initProjectViewAll = initProjectViewAll;

function initCertificationFiltering() {
    const filterButtons = document.querySelectorAll('.certifications-filter .filter-btn');
    const certificationCards = document.querySelectorAll('.certification-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            certificationCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Achievements filtering
function initAchievementsFiltering() {
    // Limit to the Achievements section only
    const achievementsSection = document.querySelector('#achievements');
    if (!achievementsSection) return;

    const filterButtons = achievementsSection.querySelectorAll('.filter-btn');
    const achievementCards = achievementsSection.querySelectorAll('.hackathon-card');

    if (!filterButtons.length || !achievementCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {

            // Active button highlight
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            achievementCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

        });
    });
}

// ================= HERO STATS (from /api/stats) =================

function initHeroStats() {
    // Only run if the hero cubes are present
    if (!document.getElementById('hLcTotal')) return;

    fetch('/api/stats')
        .then(r => r.json())
        .then(json => {
            if (!json.success) return;
            const d = json.data;

            // LeetCode
            if (d.leetcode) {
                document.getElementById('hLcTotal').textContent = d.leetcode.total ?? '—';
                document.getElementById('hLcRating').textContent = d.leetcode.contestRating ?? '—';
                document.getElementById('hLcRanking').textContent = d.leetcode.contestRanking ?? '—';
                
                // Initialize LeetCode Rating History Line Chart
                const history = d.leetcode.ratingHistory || [];
                const ctxLc = document.getElementById('leetcodeChart');
                if (ctxLc && history.length > 0) {
                    new Chart(ctxLc.getContext('2d'), {
                        type: 'line',
                        data: {
                            labels: history.map((_, index) => `Contest ${index + 1}`),
                            datasets: [{
                                label: 'Rating',
                                data: history,
                                borderColor: '#FFA116',
                                backgroundColor: 'rgba(255, 161, 22, 0.12)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.35,
                                pointRadius: 2,
                                pointBackgroundColor: '#FFA116'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    enabled: true,
                                    callbacks: {
                                        title: () => 'LeetCode Contest',
                                        label: (context) => ` Rating: ${context.raw}`
                                    }
                                }
                            },
                            scales: {
                                x: { display: false },
                                y: {
                                    grid: { display: false },
                                    ticks: {
                                        color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#cbd5e1' : '#475569',
                                        font: { size: 8, weight: 'bold' }
                                    }
                                }
                            }
                        }
                    });
                }
            } else {
                document.getElementById('hLcTotal').textContent = 'N/A';
            }
            hideCubeSpin('hLcSpin');

            // CodeChef
            if (d.codechef) {
                document.getElementById('hCcRating').textContent = d.codechef.rating ?? '—';
                document.getElementById('hCcStars').textContent = d.codechef.stars ?? '—';
                document.getElementById('hCcRank').textContent = d.codechef.globalRank ?? '—';
                
                // Initialize CodeChef Rating History Line Chart
                const ccHistory = d.codechef.ratingHistory || [];
                const ctxCc = document.getElementById('codechefChart');
                if (ctxCc && ccHistory.length > 0) {
                    new Chart(ctxCc.getContext('2d'), {
                        type: 'line',
                        data: {
                            labels: ccHistory.map((_, index) => `Contest ${index + 1}`),
                            datasets: [{
                                label: 'Rating',
                                data: ccHistory,
                                borderColor: '#8d6e63',
                                backgroundColor: 'rgba(141, 110, 99, 0.12)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.35,
                                pointRadius: 2,
                                pointBackgroundColor: '#8d6e63'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    enabled: true,
                                    callbacks: {
                                        title: () => 'CodeChef Contest',
                                        label: (context) => ` Rating: ${context.raw}`
                                    }
                                }
                            },
                            scales: {
                                x: { display: false },
                                y: {
                                    grid: { display: false },
                                    ticks: {
                                        color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#cbd5e1' : '#475569',
                                        font: { size: 8, weight: 'bold' }
                                    }
                                }
                            }
                        }
                    });
                }
            } else {
                document.getElementById('hCcRating').textContent = 'N/A';
            }
            hideCubeSpin('hCcSpin');

            // GitHub
            if (d.github) {
                document.getElementById('hGhCont').textContent = d.github.contributions ?? '—';
                document.getElementById('hGhRepos').textContent = d.github.repos ?? '—';
                
                // Initialize GitHub Contribution Sparkline Chart
                const ghHistory = d.github.contributionHistory || [];
                const ctxGh = document.getElementById('githubChart');
                if (ctxGh && ghHistory.length > 0) {
                    new Chart(ctxGh.getContext('2d'), {
                        type: 'line',
                        data: {
                            labels: ghHistory.map((_, i) => `Day ${i + 1}`),
                            datasets: [{
                                label: 'Contributions',
                                data: ghHistory,
                                borderColor: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.38,
                                pointRadius: 2,
                                pointBackgroundColor: '#10b981'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    enabled: true,
                                    callbacks: {
                                        title: () => 'Recent Activity',
                                        label: (context) => ` Contributions: ${context.raw}`
                                    }
                                }
                            },
                            scales: {
                                x: { display: false },
                                y: {
                                    grid: { display: false },
                                    ticks: {
                                        color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#cbd5e1' : '#475569',
                                        font: { size: 8, weight: 'bold' }
                                    }
                                }
                            }
                        }
                    });
                }
            } else {
                document.getElementById('hGhCont').textContent = 'N/A';
            }
            hideCubeSpin('hGhSpin');
        })
        .catch(() => {
            ['hLcSpin', 'hCcSpin', 'hGhSpin'].forEach(hideCubeSpin);
            ['hLcTotal', 'hLcRating', 'hCcRating', 'hGhCont'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '—';
            });
        });
}

function hideCubeSpin(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', initHeroStats);
// ── Mobile: show only top 3 cards, View All toggle ──────────
function initMobileCardLimit() {
    // Only apply on mobile
    if (window.innerWidth > 900) return;

    const configs = [
        {
            gridSelector: '.certifications-grid',
            cardSelector: '.certification-card',
            wrapSelector: '.certifications-section',
        },
    ];

    configs.forEach(({ gridSelector, cardSelector, wrapSelector }) => {
        const grid = document.querySelector(gridSelector);
        const wrap = document.querySelector(wrapSelector);
        if (!grid || !wrap) return;

        const cards = Array.from(grid.querySelectorAll(cardSelector));
        if (cards.length <= 3) return;

        // Hide cards beyond first 3
        cards.forEach((card, i) => {
            if (i >= 3) card.classList.add('mobile-hidden');
        });

        // Create button
        const btn = document.createElement('button');
        btn.className = 'mobile-view-all-btn';
        btn.innerHTML = `View All (${cards.length}) <i class="fas fa-chevron-down"></i>`;

        let expanded = false;
        btn.addEventListener('click', () => {
            expanded = !expanded;
            cards.forEach((card, i) => {
                if (i >= 3) {
                    card.classList.toggle('mobile-hidden', !expanded);
                }
            });
            btn.classList.toggle('expanded', expanded);
            btn.innerHTML = expanded
                ? `Show Less <i class="fas fa-chevron-down"></i>`
                : `View All (${cards.length}) <i class="fas fa-chevron-down"></i>`;

            // Scroll back to grid top if collapsing
            if (!expanded) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        // Insert button after the grid
        grid.insertAdjacentElement('afterend', btn);
    });
}

document.addEventListener('DOMContentLoaded', initMobileCardLimit);

// Re-run on resize crossing breakpoint
let _wasMobile = window.innerWidth <= 900;
window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 900;
    if (isMobile !== _wasMobile) {
        _wasMobile = isMobile;
        // Remove all mobile-hidden classes and buttons on desktop
        if (!isMobile) {
            document.querySelectorAll('.mobile-hidden').forEach(el => el.classList.remove('mobile-hidden'));
            document.querySelectorAll('.mobile-view-all-btn').forEach(el => el.remove());
        } else {
            // Re-init on switch back to mobile
            document.querySelectorAll('.mobile-view-all-btn').forEach(el => el.remove());
            initMobileCardLimit();
        }
    }
});

// Deployed project availability monitor
function initProjectAvailability() {
    const badges = document.querySelectorAll('.status-badge');
    if (badges.length === 0) return;

    fetch('/api/availability')
        .then(response => response.json())
        .then(data => {
            if (!data.success || !data.statuses) {
                throw new Error("Invalid availability data");
            }
            badges.forEach(badge => {
                const url = badge.getAttribute('data-status-url');
                const status = data.statuses[url] || 'offline';
                
                // Transition to final state class
                badge.classList.remove('checking');
                badge.classList.add(status);
                
                // Update badge text label
                const label = badge.querySelector('.status-text');
                if (label) {
                    label.textContent = status;
                }
            });
        })
        .catch(err => {
            console.error("Failed to check project availability:", err);
            badges.forEach(badge => {
                badge.classList.remove('checking');
                badge.classList.add('offline');
                const label = badge.querySelector('.status-text');
                if (label) {
                    label.textContent = 'offline';
                }
            });
        });
}

// Flip profile cubes (LeetCode & GitHub)
function initProfileFlip() {
    const toggleButtons = document.querySelectorAll('.cube-toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const container = btn.closest('.flip-container');
            if (container) {
                container.classList.toggle('flipped');
            }
        });
    });
}

// Floating Resume AI Chatbot Widget Logic
function initResumeChatbot() {
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatBody = document.getElementById('chatBody');
    const chatSuggestions = document.getElementById('chatSuggestions');
    const pulseDot = chatToggleBtn ? chatToggleBtn.querySelector('.chat-notification-pulse') : null;
    const chatCounter = document.getElementById('chatCounter');

    if (!chatToggleBtn || !chatWindow || !chatInput || !chatSendBtn || !chatBody) return;

    // Fetch initial chat query stats
    if (chatCounter) {
        fetch('/api/chat/stats')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.count !== undefined) {
                    animateCounter(chatCounter, data.count);
                }
            })
            .catch(err => console.error('Error fetching chat stats:', err));
    }

    function animateCounter(element, targetValue) {
        let start = 0;
        const duration = 1200; // 1.2 second animation
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // ease out cubic
            const currentValue = Math.floor(easeProgress * targetValue);
            
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // Toggle Chat Window
    chatToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatWindow.classList.toggle('active');
        // Hide notification pulse on first interaction
        if (pulseDot) {
            pulseDot.style.display = 'none';
        }
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    // Close Chat Window
    chatCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatWindow.classList.remove('active');
    });

    // Close chat if clicked outside the widget
    document.addEventListener('click', (e) => {
        if (!chatWindow.contains(e.target) && !chatToggleBtn.contains(e.target)) {
            chatWindow.classList.remove('active');
        }
    });

    // Suggestion chip triggers
    if (chatSuggestions) {
        chatSuggestions.addEventListener('click', (e) => {
            const btn = e.target.closest('.suggestion-btn');
            if (btn) {
                const query = btn.dataset.query;
                if (query) {
                    sendChatMessage(query);
                    // Hide suggestions after the first tap to clean up UI
                    chatSuggestions.style.display = 'none';
                }
            }
        });
    }

    // Enter Key Send trigger
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const message = chatInput.value.trim();
            if (message) {
                sendChatMessage(message);
            }
        }
    });

    // Send Button trigger
    chatSendBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            sendChatMessage(message);
        }
    });

    // Send chat message core function
    function sendChatMessage(text) {
        // 1. Add user bubble
        appendMessageBubble(text, 'user');
        chatInput.value = '';

        // 2. Add typing indicator
        const typingIndicator = appendTypingIndicator();
        scrollToBottom();

        // 3. Dispatch POST request to API
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('API network response error');
            }
            return response.json();
        })
        .then(data => {
            // Remove typing indicator
            if (typingIndicator) typingIndicator.remove();

            if (data.success && data.reply) {
                appendMessageBubble(data.reply, 'bot');
                if (data.count !== undefined && chatCounter) {
                    chatCounter.textContent = data.count;
                }
            } else {
                appendMessageBubble("I'm sorry, I'm having trouble processing your query right now. Please try again in a moment!", 'bot');
            }
            scrollToBottom();
        })
        .catch(err => {
            console.error('Chat error:', err);
            if (typingIndicator) typingIndicator.remove();
            appendMessageBubble("I ran into a connection issue reaching my AI core. Please check your internet or retry soon!", 'bot');
            scrollToBottom();
        });
    }

    // Helper: Append User or Bot bubble
    function appendMessageBubble(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `message ${sender}`;
        
        // Support simple markdown bullet points or newlines from LLM
        const formattedText = text
            .replace(/\n/g, '<br>')
            .replace(/\*\s/g, '• ') // bullets
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // bolding
            
        bubble.innerHTML = formattedText;
        chatBody.appendChild(bubble);
    }

    // Helper: Append Bouncing Typing Dots
    function appendTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot typing-indicator-container';
        indicator.innerHTML = `
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        chatBody.appendChild(indicator);
        return indicator;
    }

    // Helper: Scroll body to end
    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}
