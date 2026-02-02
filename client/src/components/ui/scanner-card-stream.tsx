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
  const [scanProgress, setScanProgress] = useState(0);
  
  const asciiCode = useMemo(() => generateCode(80, 50), []);

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

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, 200, -200, 1, 1000);
    camera.position.z = 100;
    const renderer = new THREE.WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, 400);
    renderer.setClearColor(0x000000, 0);

    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const alphas = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = 0;
      alphas[i] = Math.random() * 0.5;
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
          gl_PointSize = 1.5;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha);
        }
      `
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const ctx = scannerCanvas.getContext('2d')!;
    scannerCanvas.width = 800;
    scannerCanvas.height = 500;

    let scanX = 0;
    let particles: any[] = [];

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      material.uniforms.time.value += 0.05;
      renderer.render(scene, camera);

      if (isScanning) {
        ctx.clearRect(0, 0, scannerCanvas.width, scannerCanvas.height);
        
        scanX = (scanX + 3) % scannerCanvas.width;
        setScanProgress(scanX / scannerCanvas.width);
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        ctx.beginPath();
        ctx.moveTo(scanX, 0);
        ctx.lineTo(scanX, scannerCanvas.height);
        ctx.stroke();

        for (let i = 0; i < 8; i++) {
          particles.push({
            x: scanX,
            y: Math.random() * scannerCanvas.height,
            vx: (Math.random() - 1.5) * 4,
            vy: (Math.random() - 0.5) * 2,
            life: 1.0,
            size: Math.random() * 2 + 0.5
          });
        }

        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.012;
          if (p.life <= 0) {
            particles.splice(i, 1);
            return;
          }
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.8})`;
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
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden bg-black rounded-3xl border border-white/10 shadow-2xl">
      <canvas ref={particleCanvasRef} className="absolute inset-0 pointer-events-none opacity-30" />
      
      <div className="relative w-[340px] h-[440px] bg-zinc-900 rounded-xl overflow-hidden border border-white/5">
        {/* The Digital Code Layer (Background) */}
        <div 
          className="absolute inset-0 p-6 font-mono text-[9px] leading-[1.3] text-blue-400/40 overflow-hidden whitespace-pre pointer-events-none"
        >
          {asciiCode}
        </div>

        {/* The PDF/Image Preview Layer */}
        <div 
          className="absolute inset-0 bg-white transition-all duration-300"
          style={{ 
            clipPath: isScanning ? `inset(0 0 0 ${ scanProgress * 100 }%)` : 'none',
          }}
        >
          {previewUrl ? (
            <iframe 
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0 pointer-events-none"
              title="Resume Preview"
            />
          ) : (
            <div className="w-full h-full bg-white flex items-center justify-center p-12">
              <div className="space-y-6 w-full">
                <div className="h-6 w-2/3 bg-slate-100 rounded" />
                <div className="h-3 w-full bg-slate-50 rounded" />
                <div className="h-3 w-full bg-slate-50 rounded" />
                <div className="pt-12 space-y-3">
                  <div className="h-4 w-1/2 bg-slate-100 rounded" />
                  <div className="h-3 w-full bg-slate-50 rounded" />
                  <div className="h-3 w-5/6 bg-slate-50 rounded" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Glowing Scanner Line and Trailing Particles */}
        <canvas 
          ref={scannerCanvasRef} 
          className="absolute inset-0 pointer-events-none z-30" 
          style={{ width: '100%', height: '100%' }}
        />

        {/* Inner Shadow / Depth */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] z-40" />
      </div>
    </div>
  );
};

export default ScannerCardStream;
