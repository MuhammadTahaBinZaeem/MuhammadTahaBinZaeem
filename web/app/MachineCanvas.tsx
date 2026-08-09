"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  PresentationControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

function MeshyCore({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF("/models/machine-core.glb");
  const normalizedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 0.75;
          material.needsUpdate = true;
        }
      });
    });
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z) || 1;
    clone.position.sub(center);
    clone.scale.setScalar(2.35 / longestSide);
    return clone;
  }, [scene]);

  useEffect(() => onReady(), [onReady]);

  return <primitive object={normalizedScene} position={[0.35, -0.38, 0]} />;
}

function SignalRig({
  reducedMotion,
  onReady,
}: {
  reducedMotion: boolean;
  onReady: () => void;
}) {
  const rig = useRef<THREE.Group>(null);
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = scrollable > 0 ? window.scrollY / scrollable : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (!rig.current) return;
    const targetY = scrollProgress.current * Math.PI * 2.4 + state.pointer.x * 0.12;
    const targetX = -0.18 + scrollProgress.current * 0.52 + state.pointer.y * 0.08;
    rig.current.rotation.y = THREE.MathUtils.damp(
      rig.current.rotation.y,
      targetY,
      reducedMotion ? 20 : 2.8,
      delta,
    );
    rig.current.rotation.x = THREE.MathUtils.damp(
      rig.current.rotation.x,
      targetX,
      reducedMotion ? 20 : 3.2,
      delta,
    );
  });

  return (
    <group ref={rig} rotation={[-0.18, -0.52, 0.03]}>
      <Float
        speed={reducedMotion ? 0 : 1.25}
        rotationIntensity={reducedMotion ? 0 : 0.12}
        floatIntensity={reducedMotion ? 0 : 0.22}
      >
        <Suspense fallback={null}>
          <MeshyCore onReady={onReady} />
        </Suspense>
      </Float>

      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.25}>
        <torusGeometry args={[1.05, 0.008, 8, 128]} />
        <meshBasicMaterial color="#ff5c35" transparent opacity={0.58} />
      </mesh>
      <mesh rotation={[Math.PI / 2.7, 0.2, 0.15]} scale={1.52}>
        <torusGeometry args={[1.05, 0.004, 8, 128]} />
        <meshBasicMaterial color="#d8cdbb" transparent opacity={0.24} />
      </mesh>
    </group>
  );
}

export function MachineCanvas({
  active,
  reducedMotion,
  onReady,
}: {
  active: boolean;
  reducedMotion: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reducedMotion || !active ? "demand" : "always"}
      camera={{ position: [0, 0.2, 5.6], fov: 33, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      shadows
    >
      <ambientLight intensity={1.15} color="#f6ead7" />
      <directionalLight
        castShadow
        position={[4, 5, 5]}
        intensity={5.2}
        color="#fff4df"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 0.4, 2]} intensity={18} color="#ff5c35" />
      <pointLight position={[2, -1, -3]} intensity={10} color="#b8c9ff" />

      <PresentationControls
        global
        cursor
        snap
        speed={reducedMotion ? 0 : 1.1}
        rotation={[0, 0, 0]}
        polar={[-0.28, 0.28]}
        azimuth={[-0.48, 0.48]}
      >
        <SignalRig reducedMotion={reducedMotion} onReady={onReady} />
      </PresentationControls>

      <ContactShadows
        position={[0, -1.55, 0]}
        scale={7}
        opacity={0.28}
        blur={2.4}
        far={4.2}
        color="#000000"
        frames={reducedMotion ? 1 : 48}
      />
    </Canvas>
  );
}
