/* =============================================
   OSMAN BABAYİĞİT — PORTFOLIO v3 | script.js
   ============================================= */


// 1. DİNAMİK ARKA PLAN (CANVAS)

const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

let W, H;
let glowX = window.innerWidth  / 2;
let glowY = window.innerHeight / 2;

function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', e => {
    glowX = e.clientX;
    glowY = e.clientY;
});

function drawBG() {
    ctx.clearRect(0, 0, W, H);

    // Grid çizgileri
    ctx.strokeStyle = 'rgba(255,255,255,0.033)';
    ctx.lineWidth   = 1;
    const S = 28;

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

    // Vinyeti karartma
    const vignette = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.68);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.92)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    // Mouse takipli parıltı
    const mouseGlow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 300);
    mouseGlow.addColorStop(0, 'rgba(240,81,56,0.055)');
    mouseGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = mouseGlow;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(drawBG);
}

drawBG();


// 2. UÇUŞAN PARÇACIKLAR

(function createParticles() {
    const container = document.getElementById('particles');

    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';

        const size = Math.random() * 2.5 + 1;
        p.style.cssText = `
            left:               ${Math.random() * 100}%;
            width:              ${size}px;
            height:             ${size}px;
            animation-duration: ${Math.random() * 18 + 12}s;
            animation-delay:    ${Math.random() * 14}s;
        `;

        container.appendChild(p);
    }
})();


// 3. OTOMATİK YAZI (TYPEWRITER)

const roles   = ['Öğrenci & Geliştirici', 'iOS Developer', 'Swift Enthusiast', 'Game Dev Dreamer'];
const typedEl = document.getElementById('typed-text');

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        typedEl.textContent = currentRole.substring(0, ++charIndex);

        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeWriter, 2200);
            return;
        }
    } else {
        typedEl.textContent = currentRole.substring(0, --charIndex);

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex  = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeWriter, isDeleting ? 52 : 95);
}

typeWriter();


// 4. KAYDIRINCA AÇILMA (REVEAL)

const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade');

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));


// 5. YETENEKLER PROGRESS BARS

const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.progress-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.yetenek-karti').forEach(card => barObserver.observe(card));


// 6. AKTİF MENÜ TAKİBİ

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
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => activeObserver.observe(section));


// 7. HEADER KOYULAŞTIRMA

window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scrolled', window.scrollY > 60);
});


// 8. MOBİL MENÜ

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

function closeMobile() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
}


// 9. İLETİŞİM FORMU

async function handleForm(event) {
    event.preventDefault();

    const form            = event.target;
    const btn             = document.getElementById('formBtn');
    const originalContent = btn.innerHTML;

    // Yükleniyor durumu
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
            // Başarı durumu
            btn.classList.add('btn-success-state');
            btn.innerHTML = 'Gönderildi!';
            form.reset();

            // 3 saniye sonra butonu eski haline döndür
            setTimeout(() => {
                btn.classList.remove('btn-success-state');
                btn.innerHTML = originalContent;
                btn.disabled  = false;
            }, 3000);

        } else {
            throw new Error('Sunucu hatası');
        }

    } catch (error) {
        alert('Mesaj gönderilemedi, lütfen tekrar deneyin.');
        btn.innerHTML = originalContent;
        btn.disabled  = false;
    }
}