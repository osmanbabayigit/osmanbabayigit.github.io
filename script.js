/* =============================================
   OSMAN BABAYİĞİT — PORTFOLIO v4 | script.js
   ============================================= */


// ---- DİNAMİK ARKA PLAN (CANVAS) ----

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
    // Smooth glow follow
    glowX += (targetGlowX - glowX) * 0.06;
    glowY += (targetGlowY - glowY) * 0.06;

    ctx.clearRect(0, 0, W, H);

    // Grid
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

    // Vignette
    const vignette = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.72);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.94)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    // Mouse glow
    const mouseGlow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 340);
    mouseGlow.addColorStop(0, 'rgba(240,81,56,0.06)');
    mouseGlow.addColorStop(0.5, 'rgba(240,81,56,0.02)');
    mouseGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = mouseGlow;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(drawBG);
}

drawBG();


// ---- UÇUŞAN PARÇACIKLAR ----

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


// ---- TYPEWRITER ----

const roles   = ['Öğrenci & Geliştirici', 'iOS Developer', 'Swift Enthusiast', 'Game Dev Dreamer'];
const typedEl = document.getElementById('typed-text');

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

function typeWriter() {
    const currentRole = roles[roleIndex];

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


// ---- REVEAL ON SCROLL ----

const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade');

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // fire once
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


// ---- PROGRESS BARS ----

const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.progress-fill').forEach(bar => {
                // Small delay so animation is visible
                setTimeout(() => {
                    bar.style.width = bar.dataset.width + '%';
                }, 100);
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.yetenek-karti').forEach(card => barObserver.observe(card));


// ---- AKTİF MENÜ TAKİBİ ----

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


// ---- HEADER ----

const headerEl = document.getElementById('header');

window.addEventListener('scroll', () => {
    headerEl.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


// ---- MOBİL MENÜ ----

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


// ---- FORM ----

async function handleForm(event) {
    event.preventDefault();

    const form            = event.target;
    const btn             = document.getElementById('formBtn');
    const originalContent = btn.innerHTML;

    btn.disabled  = true;
    btn.innerHTML = '<span class="loader"></span> Gönderiliyor...';

    const data = new FormData(form);

    try {
        const response = await fetch('https://formspree.io/f/xaqpdbwo', {
            method:  'POST',
            body:    data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            btn.classList.add('btn-success-state');
            btn.innerHTML = '✓ Gönderildi!';
            form.reset();

            setTimeout(() => {
                btn.classList.remove('btn-success-state');
                btn.innerHTML = originalContent;
                btn.disabled  = false;
            }, 3500);
        } else {
            throw new Error('Sunucu hatası');
        }

    } catch (error) {
        alert('Mesaj gönderilemedi, lütfen tekrar deneyin.');
        btn.innerHTML = originalContent;
        btn.disabled  = false;
    }
}


// ---- SMOOTH ANCHOR SCROLL ----

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});