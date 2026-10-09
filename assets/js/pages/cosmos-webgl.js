/* Optional local particle painter. Projection/picking/selection belong to the host. */
import { WebGLRenderer, Scene, OrthographicCamera, BufferGeometry, Float32BufferAttribute, ShaderMaterial, Points, AdditiveBlending, Color } from 'three';

export function createRenderer(canvas, onFailure, capacity) {
  if (!Number.isInteger(capacity) || capacity < 1) throw new Error('Particle capacity must be a positive integer.');
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const scene = new Scene();
  const camera = new OrthographicCamera(0, 1, 0, 1, -1, 1);
  const geometry = new BufferGeometry();
  // Allocate the known scene maximum once. Reveal/filter/degradation change
  // drawRange, never replace uploaded attributes and orphan their GPU buffers.
  geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(capacity * 3), 3));
  geometry.setAttribute('tint', new Float32BufferAttribute(new Float32Array(capacity * 3), 3));
  geometry.setAttribute('size', new Float32BufferAttribute(new Float32Array(capacity), 1));
  geometry.setAttribute('opacity', new Float32BufferAttribute(new Float32Array(capacity), 1));
  const material = new ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false, blending: AdditiveBlending,
    uniforms: { pixelRatio: { value: Math.min(devicePixelRatio || 1, 2) } },
    vertexShader: 'attribute float size; attribute float opacity; attribute vec3 tint; varying vec3 vTint; varying float vOpacity; uniform float pixelRatio; void main(){vTint=tint;vOpacity=opacity;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_PointSize=size*pixelRatio;}',
    fragmentShader: 'varying vec3 vTint; varying float vOpacity; void main(){float r=length(gl_PointCoord-vec2(.5))*2.;if(r>1.)discard;float glow=exp(-r*r*7.);gl_FragColor=vec4(vTint,glow*vOpacity);}'
  });
  scene.add(new Points(geometry, material));
  const color = new Color();
  let width = 0, height = 0, disposed = false;
  const failed = event => { event.preventDefault(); onFailure('增强画面中断，已恢复基础星图'); };
  canvas.addEventListener('webglcontextlost', failed);
  return {
    render(particles, w, h) {
      if (disposed) return;
      if (particles.length > capacity) throw new Error('Particle count exceeds the allocated scene capacity.');
      if (width !== w || height !== h) {
        width = w; height = h;
        renderer.setSize(w, h, false);
        camera.right = w; camera.bottom = h; camera.updateProjectionMatrix();
      }
      particles.forEach((p, i) => {
        geometry.attributes.position.setXYZ(i, p.x, p.y, 0);
        color.set(p.color);
        geometry.attributes.tint.setXYZ(i, color.r, color.g, color.b);
        geometry.attributes.size.setX(i, p.size);
        geometry.attributes.opacity.setX(i, p.alpha);
      });
      for (const attribute of Object.values(geometry.attributes)) attribute.needsUpdate = true;
      geometry.setDrawRange(0, particles.length);
      renderer.render(scene, camera);
    },
    dispose() {
      if (disposed) return;
      disposed = true; canvas.removeEventListener('webglcontextlost', failed);
      geometry.dispose(); material.dispose(); renderer.dispose();
    }
  };
}
