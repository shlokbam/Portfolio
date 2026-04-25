"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sphere, Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const skills = [
  { name: "React", pos: [-2, 1, 0], color: "#00f2ff" },
  { name: "Next.js", pos: [0, 2, 1], color: "#ffffff" },
  { name: "TypeScript", pos: [2, 1, -1], color: "#3178c6" },
  { name: "Node.js", pos: [1, -1, 2], color: "#00ffaa" },
  { name: "Tailwind", pos: [-1, -2, 1], color: "#38bdf8" },
  { name: "Three.js", pos: [3, -1, 0], color: "#ff0055" },
  { name: "Docker", pos: [-3, -1, -2], color: "#2496ed" },
  { name: "AWS", pos: [0, -3, -1], color: "#ff9900" },
];

function Node({ position, name, color }: { position: [number, number, number], name: string, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.15, 32, 32]} ref={meshRef}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </Sphere>
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.2}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </Float>
    </group>
  );
}

function Connections() {
  const points = useMemo(() => {
    const lines = [];
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        if (Math.random() > 0.6) {
          lines.push([skills[i].pos, skills[j].pos]);
        }
      }
    }
    return lines;
  }, []);

  return (
    <>
      {points.map((p, i) => (
        <Line
          key={i}
          points={p as [[number, number, number], [number, number, number]]}
          color="#00f2ff"
          lineWidth={0.5}
          transparent
          opacity={0.1}
        />
      ))}
    </>
  );
}

function BackgroundParticles() {
  const points = useMemo(() => {
    const p = new Float32Array(300);
    for (let i = 0; i < 300; i++) {
      p[i] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00f2ff" transparent opacity={0.2} />
    </points>
  );
}

export default function NetworkGraph() {
  return (
    <div className="w-full h-[600px] glass-panel border-primary/10 relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-primary font-mono text-xs tracking-[0.3em]">SKILLS_NETWORK.SYS</h3>
        <p className="text-primary/40 text-[10px] font-mono mt-1">INTERACTIVE TOPOLOGY VIEW</p>
      </div>
      
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        
        {skills.map((skill, i) => (
          <Node key={i} position={skill.pos as [number, number, number]} name={skill.name} color={skill.color} />
        ))}
        
        <Connections />
        <BackgroundParticles />
      </Canvas>

      {/* Interface Overlays */}
      <div className="absolute bottom-6 right-6 z-10 text-right font-mono text-[9px] text-primary/30 space-y-1">
        <p>REDUNDANCY: 99.9%</p>
        <p>LATENCY: 12ms</p>
        <p>UPTIME: 342:12:01</p>
      </div>
    </div>
  );
}
