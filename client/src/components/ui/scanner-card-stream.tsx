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
  file?: File | null;
  isScanning?: boolean;
};

const ScannerCardStream = ({
  file = null,
  isScanning = false,
}: ScannerCardStreamProps) => {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const asciiCode = useMemo(() => generateCode(60, 40), []);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

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

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      material.uniforms.time.value += 0.05;
      renderer.render(scene, camera);

      if (isScanning) {
        ctx.clearRect(0, 0, scannerCanvas.width, scannerCanvas.height);
        
        // Horizontal scan line
        scanY = (scanY + 2.5) % scannerCanvas.height;
        ctx.strokeStyle = "rgba(255, 85, 62, 0.9)";
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255, 85, 62, 1)";
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(scannerCanvas.width, scanY);
        ctx.stroke();

        // Disintegration particles on the line
        for (let i = 0; i < 5; i++) {
          particles.push({
            x: Math.random() * scannerCanvas.width,
            y: scanY,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 1.2) * 3,
            life: 1.0,
            size: Math.random() * 3 + 1
          });
        }

        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.015;
          if (p.life <= 0) {
            particles.splice(i, 1);
            return;
          }
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(255, 85, 62, ${p.life})`;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        });
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
    };
  }, [isScanning]);

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center overflow-hidden bg-black/5 rounded-2xl border border-border/40">
      <canvas ref={particleCanvasRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 w-[300px] h-[400px] bg-white shadow-2xl rounded-lg overflow-hidden border border-white/20">
        {/* The PDF/Image Preview */}
        <div className="absolute inset-0">
          {previewUrl ? (
            <iframe 
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0 pointer-events-none"
              title="Resume Preview"
            />
          ) : (
            <div className="w-full h-full bg-slate-50 flex items-center justify-center p-8">
              <div className="space-y-4 w-full">
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
                <div className="h-2 w-full bg-slate-100 rounded" />
                <div className="h-2 w-full bg-slate-100 rounded" />
                <div className="pt-8 space-y-2">
                  <div className="h-3 w-1/2 bg-slate-200 rounded" />
                  <div className="h-2 w-full bg-slate-100 rounded" />
                  <div className="h-2 w-5/6 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* The Disintegration Overlay (Digital Code) */}
        <div 
          className="absolute inset-0 bg-black/80 p-4 font-mono text-[8px] leading-[1.2] text-[#FF553E] overflow-hidden whitespace-pre pointer-events-none mix-blend-screen"
          style={{ 
            clipPath: isScanning ? 'none' : 'inset(100% 0 0 0)',
            transition: 'clip-path 0.5s ease-in-out',
            opacity: isScanning ? 1 : 0
          }}
        >
          {asciiCode}
        </div>

        {/* Scanner Line and Particles Canvas */}
        <canvas ref={scannerCanvasRef} className="absolute inset-0 pointer-events-none z-20" />
      </div>
    </div>
  );
};

export default ScannerCardStream;
