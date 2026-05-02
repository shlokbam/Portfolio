// Initialize navbar
function initNavbar() {
    const navbar   = document.querySelector('.navbar');
    const menuBtn  = document.getElementById('mobileMenuBtn');
    const navList  = document.getElementById('navLinks');
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

    // Highlight active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section[id]').forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href').substring(1) === current
            );
        });
    });
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for better accuracy

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Initialize active state on page load
document.addEventListener('DOMContentLoaded', function() {
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

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
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
        card.style.display = 'block';
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
                document.getElementById('hLcTotal').textContent = d.leetcode.total   ?? '—';
                document.getElementById('hLcRating').textContent  = d.leetcode.contestRating ?? '—';
                document.getElementById('hLcRanking').textContent = d.leetcode.contestRanking ?? '—';
            } else {
                document.getElementById('hLcTotal').textContent = 'N/A';
            }
            hideCubeSpin('hLcSpin');

            // CodeChef
            if (d.codechef) {
                document.getElementById('hCcRating').textContent = d.codechef.rating     ?? '—';
                document.getElementById('hCcStars').textContent  = d.codechef.stars      ?? '—';
                document.getElementById('hCcRank').textContent   = d.codechef.globalRank ?? '—';
            } else {
                document.getElementById('hCcRating').textContent = 'N/A';
            }
            hideCubeSpin('hCcSpin');
        })
        .catch(() => {
            ['hLcSpin','hCcSpin'].forEach(hideCubeSpin);
            ['hLcTotal','hLcRating','hCcRating'].forEach(id => {
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
            gridSelector:   '.certifications-grid',
            cardSelector:   '.certification-card',
            wrapSelector:   '.certifications-section',
        },
    ];

    configs.forEach(({ gridSelector, cardSelector, wrapSelector }) => {
        const grid  = document.querySelector(gridSelector);
        const wrap  = document.querySelector(wrapSelector);
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