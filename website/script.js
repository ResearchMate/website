// Initialize Lenis for Smooth Scroll
const lenis = new Lenis({
    duration: 2.5, // Increased from 1.2 for much smoother, floaty feel
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 0.7, // Slower, smoother scroll amount
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);



// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Reveal - Staggered text
    const tl = gsap.timeline();

    // Break hero title into characters/words for detailed animation (simple split manually or via CSS)
    // We'll just animate the blocks cleanly for now as we didn't include SplitType lib

    tl.from('.nav-logo', { scale: 0, rotation: -90, duration: 1, ease: 'back.out(1.7)' })
        .from('.logo-text', { x: -20, opacity: 0, duration: 0.8 }, '-=0.8')
        // .from('.nav-links', ...) REMOVED: CSS handles visibility
        .from('.hero-title', { y: 100, opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=0.6')
        .from('.hero-subtitle', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
        // .from('.hero-actions a', ...) REMOVED: CSS handles visibility
        .from('.mouse', { y: -20, opacity: 0, duration: 1 }, '-=0.4');

    // Unified Parallax to prevent overlap
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: -50 // Move entire block together
    });

    // Features Stagger Reveal
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none' /* Changed from reverse to none to keep visible */
            },
            y: 100,
            opacity: 0,
            rotation: 5,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1
        });
    });

    // Semantic Section Reveals
    gsap.utils.toArray('section h2').forEach(heading => {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                toggleActions: 'play none none none' /* Changed from reverse to none to keep visible */
            },
            y: 50,
            opacity: 0,
            scale: 0.9,
            duration: 0.8
        });
    });

    // AI Chip Rotate
    gsap.to('.circle-outer', {
        scrollTrigger: {
            trigger: '.hybrid-ai',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        rotation: 360
    });

    // Mockup Reveal 3D
    gsap.from('.browser-mockup', {
        scrollTrigger: {
            trigger: '.demo',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
        },
        rotationX: 20,
        scale: 0.9,
        y: 50,
        opacity: 0
    });

    // Initialize Canvas Particles
    initParticles();
});

// Particles from before
function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h;
    let particles = [];

    // Interaction
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = Math.random() * 0.5 - 0.25;
            this.vy = Math.random() * 0.5 - 0.25;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(99, 102, 241,' : 'rgba(56, 189, 248,';
            this.alpha = Math.random() * 0.5 + 0.1;
            this.baseAlpha = this.alpha;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Warp edges
            if (this.x < 0) this.x = w;
            if (this.x > w) this.x = 0;
            if (this.y < 0) this.y = h;
            if (this.y > h) this.y = 0;

            // Mouse interaction (repulse)
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const force = (150 - dist) / 150;
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * force * 2;
                this.y -= Math.sin(angle) * force * 2;
                this.alpha = Math.min(1, this.baseAlpha + force);
            } else {
                this.alpha = this.baseAlpha;
            }
        }

        draw() {
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}
