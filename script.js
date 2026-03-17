let currentLang = 'tr';

const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

let W, H;
let glowX = window.innerWidth  / 2;
let glowY = window.innerHeight / 2;
let targetGlowX = glowX;
let targetGlowY = glowY;

function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', e => {
    targetGlowX = e.clientX;
    targetGlowY = e.clientY;
});

function drawBG() {
    glowX += (targetGlowX - glowX) * 0.06;
    glowY += (targetGlowY - glowY) * 0.06;

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.028)';
    ctx.lineWidth   = 1;
    const S = 32;

    for (let x = 0; x <= W; x += S) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
    }
    for (let y = 0; y <= H; y += S) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }

    const vignette = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.72);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.94)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    const mouseGlow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 340);
    mouseGlow.addColorStop(0, 'rgba(240,81,56,0.06)');
    mouseGlow.addColorStop(0.5, 'rgba(240,81,56,0.02)');
    mouseGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = mouseGlow;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(drawBG);
}

drawBG();


(function createParticles() {
    const container = document.getElementById('particles');
    const count = window.innerWidth < 768 ? 10 : 18;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';

        const size = Math.random() * 2 + 0.8;
        p.style.cssText = `
            left:               ${Math.random() * 100}%;
            width:              ${size}px;
            height:             ${size}px;
            animation-duration: ${Math.random() * 20 + 14}s;
            animation-delay:    -${Math.random() * 14}s;
        `;
        container.appendChild(p);
    }
})();


const rolesTR = ['Öğrenci & Geliştirici', 'iOS Developer', 'Swift Enthusiast', 'Game Dev Dreamer'];
const rolesEN = ['Student & Developer',   'iOS Developer', 'Swift Enthusiast', 'Game Dev Dreamer'];
const typedEl  = document.getElementById('typed-text');

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

function getCurrentRoles() {
    return currentLang === 'tr' ? rolesTR : rolesEN;
}

function typeWriter() {
    const roles       = getCurrentRoles();
    const currentRole = roles[roleIndex % roles.length];

    if (!isDeleting) {
        typedEl.textContent = currentRole.substring(0, ++charIndex);
        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeWriter, 2400);
            return;
        }
    } else {
        typedEl.textContent = currentRole.substring(0, --charIndex);
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex  = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeWriter, isDeleting ? 45 : 90);
}

typeWriter();


const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade');

function checkReveal() {
    revealEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95) {
            el.classList.add('visible');
        }
    });
}

checkReveal();
window.addEventListener('scroll', checkReveal, { passive: true });


const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.progress-fill').forEach(bar => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width + '%';
                }, 100);
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.yetenek-karti').forEach(card => barObserver.observe(card));


const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === entry.target.id);
            });
        }
    });
}, { rootMargin: '-35% 0px -60% 0px' });

sections.forEach(s => activeObserver.observe(s));


const headerEl = document.getElementById('header');

window.addEventListener('scroll', () => {
    headerEl.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMobile() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}


async function handleForm(event) {
    event.preventDefault();

    const form            = event.target;
    const btn             = document.getElementById('formBtn');
    const originalContent = btn.innerHTML;

    btn.disabled  = true;
    btn.innerHTML = '<span class="loader"></span>';

    const data = new FormData(form);

    try {
        const response = await fetch('https://formspree.io/f/xaqpdbwo', {
            method:  'POST',
            body:    data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            btn.classList.add('btn-success-state');
            btn.innerHTML = '✓';
            form.reset();

            setTimeout(() => {
                btn.classList.remove('btn-success-state');
                btn.innerHTML = originalContent;
                btn.disabled  = false;
            }, 3500);
        } else {
            throw new Error('error');
        }

    } catch (error) {
        alert(currentLang === 'tr' ? 'Mesaj gönderilemedi, lütfen tekrar deneyin.' : 'Message could not be sent, please try again.');
        btn.innerHTML = originalContent;
        btn.disabled  = false;
    }
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


function animateCounter(el, target, duration) {
    const end  = parseInt(target);
    if (isNaN(end)) return;
    let start  = 0;
    const step = Math.ceil(end / (duration / 16));
    const suffix = el.dataset.suffix || '';
    const timer = setInterval(() => {
        start = Math.min(start + step, end);
        el.textContent = start + suffix;
        if (start >= end) clearInterval(timer);
    }, 16);
}

const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(el => {
                if (el.dataset.nocount) return;
                const val = el.textContent.trim();
                const num = parseInt(val);
                if (!isNaN(num)) {
                    const suffix = val.replace(num.toString(), '');
                    el.dataset.suffix = suffix;
                    animateCounter(el, num, 1200);
                }
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);


document.querySelectorAll('.proje-karti, .yetenek-karti, .sertifika-karti').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width)  * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
        card.classList.add('spotlight-active');
    });
    card.addEventListener('mouseleave', () => {
        card.classList.remove('spotlight-active');
    });
});


function toggleLang() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    const btn   = document.getElementById('langToggle');
    btn.textContent = currentLang === 'tr' ? 'EN' : 'TR';
    btn.classList.toggle('lang-active', currentLang === 'en');

    document.querySelectorAll('[data-tr]').forEach(el => {
        const val = currentLang === 'tr' ? el.dataset.tr : el.dataset.en;
        if (!val) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
        if (el.dataset.tr.includes('<')) {
            el.innerHTML = val;
        } else {
            el.textContent = val;
        }
    });

    document.querySelectorAll('[data-placeholder-tr]').forEach(el => {
        el.placeholder = currentLang === 'tr' ? el.dataset.placeholderTr : el.dataset.placeholderEn;
    });

    document.documentElement.lang = currentLang;

    roleIndex  = 0;
    charIndex  = 0;
    isDeleting = false;
}