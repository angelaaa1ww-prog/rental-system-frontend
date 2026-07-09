import React, { useEffect, useRef } from 'react';

export function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = ['#5581FF', '#6BA7F9', '#4ADE80', '#F59E0B'][Math.floor(Math.random() * 4)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += (Math.random() - 0.5) * 0.02;
        this.opacity = Math.max(0.1, Math.min(0.8, this.opacity));

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId;
    const animate = () => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

export function GlowEffect({ children }) {
  return (
    <div
      style={{
        position: 'relative',
        boxShadow: '0 0 60px rgba(85, 129, 255, 0.3), inset 0 0 60px rgba(85, 129, 255, 0.1)',
        borderRadius: '1rem',
      }}
    >
      {children}
    </div>
  );
}

export function AnimatedBorder({ children }) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '1rem',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -50,
          left: -50,
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(85, 129, 255, 0.5), transparent)',
          borderRadius: '50%',
          animation: 'moveGlow 6s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <style>{`
        @keyframes moveGlow {
          0% { transform: translate(0, 0); }
          50% { transform: translate(100px, 100px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
      {children}
    </div>
  );
}
