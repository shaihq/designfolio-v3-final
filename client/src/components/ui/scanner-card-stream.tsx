'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

const ASCII_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";
const generateCode = (width: number, height: number): string => {
  let text = "";
  for (let i = 0; i < width * height; i++) {
    text += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
  }
  let out = "";
  for (let i = 0; i < height; i++) {
    out += text.substring(i * width, (i + 1) * width) + "\n";
  }
  return out;
};

type ScannerCardStreamProps = {
  cardImages?: string[];
  isScanning?: boolean;
};

const ScannerCardStream = ({
  cardImages = [
    "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png"
  ],
  isScanning = false,
}: ScannerCardStreamProps) => {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const asciiCode = useMemo(() => generateCode(60, 20), []);

  useEffect(() => {
    const particleCanvas = particleCanvasRef.current;
    const scannerCanvas = scannerCanvasRef.current;
    if (!particleCanvas || !scannerCanvas) return;

    // Three.js Particle Background
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, 150, -150, 1, 1000);
    camera.position.z = 100;
    const renderer = new THREE.WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, 300);
    renderer.setClearColor(0x000000, 0);

    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const alphas = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 2] = 0;
      alphas[i] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.0;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * 0.5);
        }
      `
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Scanner Canvas 2D
    const ctx = scannerCanvas.getContext('2d')!;
    scannerCanvas.width = 600;
    scannerCanvas.height = 400;

    let scanY = 0;
    let particles: any[] = [];

    const animate = () => {
      requestAnimationFrame(animate);
      
      material.uniforms.time.value += 0.05;
      renderer.render(scene, camera);

      if (isScanning) {
        ctx.clearRect(0, 0, scannerCanvas.width, scannerCanvas.height);
        
        // Horizontal scan line
        scanY = (scanY + 2) % scannerCanvas.height;
        ctx.strokeStyle = "rgba(255, 85, 62, 0.8)";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 85, 62, 1)";
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(scannerCanvas.width, scanY);
        ctx.stroke();

        // Disintegration particles
        if (Math.random() > 0.5) {
          particles.push({
            x: Math.random() * scannerCanvas.width,
            y: scanY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 1) * 2,
            life: 1.0
          });
        }

        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.01;
          if (p.life <= 0) particles.splice(i, 1);
          ctx.fillStyle = `rgba(255, 85, 62, ${p.life})`;
          ctx.fillRect(p.x, p.y, 2, 2);
        });
      }
    };

    animate();

    return () => {
      renderer.dispose();
      scene.clear();
    };
  }, [isScanning]);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-black/5 rounded-2xl">
      <canvas ref={particleCanvasRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 w-[280px] h-[360px] bg-white shadow-2xl rounded-lg overflow-hidden border border-white/20">
        {/* The Card View */}
        <div className="absolute inset-0 transition-opacity duration-500">
          <img 
            src={cardImages[0]} 
            className="w-full h-full object-cover opacity-80" 
            alt="Resume Preview"
          />
        </div>

        {/* The ASCII / Disintegration Layer */}
        <div 
          className="absolute inset-0 bg-black/90 p-4 font-mono text-[8px] leading-[1.2] text-[#FF553E] overflow-hidden whitespace-pre pointer-events-none"
          style={{ 
            clipPath: isScanning ? 'none' : 'inset(100% 0 0 0)',
            transition: 'clip-path 0.5s ease-in-out'
          }}
        >
          {asciiCode}
        </div>

        <canvas ref={scannerCanvasRef} className="absolute inset-0 pointer-events-none mix-blend-screen" />
      </div>
    </div>
  );
};

export default ScannerCardStream;
