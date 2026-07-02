import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ============================================================
// 3D ENVELOPE — Three.js
// ============================================================

export const Envelope3D = ({ isOpen, reducedMotion }) => {
  const mountRef = useRef(null);
  const flapTargetRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff4e0, 0.55));
    const key = new THREE.DirectionalLight(0xffe8c2, 1.0);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xf5e6d3, 0.35);
    fill.position.set(-3, -1, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xb8924f, 0.25);
    rim.position.set(0, 2, -3);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    const bodyGeom = new THREE.BoxGeometry(2.4, 1.6, 0.08);
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xf0e6d2, roughness: 0.88, metalness: 0.02 });
    group.add(new THREE.Mesh(bodyGeom, paperMat));

    const innerGeom = new THREE.PlaneGeometry(2.3, 1.5);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xe8d9bd, roughness: 0.92 });
    const inner = new THREE.Mesh(innerGeom, innerMat);
    inner.position.set(0, 0, 0.041);
    group.add(inner);

    const sealGeom = new THREE.CylinderGeometry(0.17, 0.17, 0.05, 48);
    const sealMat = new THREE.MeshStandardMaterial({ color: 0x7a1f2b, roughness: 0.35, metalness: 0.18 });
    const seal = new THREE.Mesh(sealGeom, sealMat);
    seal.rotation.x = Math.PI / 2;
    seal.position.set(0, -0.08, 0.075);
    group.add(seal);

    const embossGeom = new THREE.TorusGeometry(0.075, 0.013, 10, 32);
    const embossMat = new THREE.MeshStandardMaterial({ color: 0xb8924f, roughness: 0.35, metalness: 0.5 });
    const emboss = new THREE.Mesh(embossGeom, embossMat);
    emboss.position.set(0, -0.08, 0.105);
    group.add(emboss);

    const dotGeom = new THREE.SphereGeometry(0.018, 16, 16);
    const dot = new THREE.Mesh(dotGeom, embossMat);
    dot.position.set(0, -0.08, 0.108);
    group.add(dot);

    const flapShape = new THREE.Shape();
    flapShape.moveTo(-1.21, 0);
    flapShape.lineTo(1.21, 0);
    flapShape.lineTo(0, -0.92);
    flapShape.lineTo(-1.21, 0);
    const flapGeom = new THREE.ShapeGeometry(flapShape);
    const flapMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc6, roughness: 0.85, side: THREE.DoubleSide });
    const flap = new THREE.Mesh(flapGeom, flapMat);
    flap.position.set(0, 0.8, 0.055);
    group.add(flap);

    group.rotation.x = -0.04;
    const target = { x: -0.04, y: 0 };
    const current = { x: -0.04, y: 0 };
    let flapCurrent = 0;

    const handlePointer = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      target.y = ((x / window.innerWidth) * 2 - 1) * 0.28;
      target.x = (-((y / window.innerHeight) * 2 - 1)) * 0.18 - 0.04;
    };
    window.addEventListener('mousemove', handlePointer);
    window.addEventListener('touchmove', handlePointer, { passive: true });

    let raf;
    let t = 0;
    const animate = () => {
      t += 0.008;
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      group.rotation.x = current.x + Math.sin(t * 0.7) * 0.018;
      group.rotation.y = current.y + Math.sin(t * 0.5) * 0.022;
      group.position.y = Math.sin(t * 0.6) * 0.045;

      flapCurrent += (flapTargetRef.current - flapCurrent) * 0.07;
      flap.rotation.x = flapCurrent;

      const openAmt = -flapCurrent / 2.0;
      emboss.scale.setScalar(1 + openAmt * 0.15 + Math.sin(t * 2) * 0.02 * openAmt);
      dot.scale.setScalar(1 + openAmt * 0.3);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handlePointer);
      window.removeEventListener('touchmove', handlePointer);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      [bodyGeom, innerGeom, sealGeom, embossGeom, flapGeom, dotGeom].forEach((g) => g.dispose());
      [paperMat, innerMat, sealMat, embossMat, flapMat].forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [reducedMotion]);

  useEffect(() => {
    flapTargetRef.current = isOpen ? -2.0 : 0;
  }, [isOpen]);

  if (reducedMotion) {
    return (
      <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', opacity: 0.6 }}>
        ✉️
      </div>
    );
  }

  return <div ref={mountRef} style={{ width: '100%', height: '240px', cursor: 'grab' }} />;
};
