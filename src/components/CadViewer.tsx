import { useEffect, useRef, useState, type ReactNode } from 'react';
import { resolveAsset } from '../content';
import { useWeekDir } from '../week-context';
import { imageDimensions } from './Gallery';

export function CadViewer({src,poster,caption,flip=false,color='#b4c3ca'}:{src:string;poster:string;caption:string;flip?:boolean;color?:string}) {
  const dir=useWeekDir(), url=resolveAsset(dir,src), image=resolveAsset(dir,poster), size=imageDimensions(dir,poster);
  const host=useRef<HTMLDivElement>(null), reset=useRef<()=>void>();
  const [status,setStatus]=useState(''),[ready,setReady]=useState(false);
  useEffect(()=>{
    if(!url || !host.current) return;
    const node=host.current;let disposed=false;let cleanup=()=>{};
    setStatus('Loading model…');
    (async()=>{
      const [THREE,{STLLoader},{OrbitControls}]=await Promise.all([import('three'),import('three/addons/loaders/STLLoader.js'),import('three/addons/controls/OrbitControls.js')]);
      const geometry=await new STLLoader().loadAsync(url);
      if(disposed){geometry.dispose();return;}
      const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','Interactive CAD model. Drag to rotate, scroll to zoom; arrow keys rotate.');
      const scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(35,1,.01,10000);
      geometry.rotateX(flip ? Math.PI/2 : -Math.PI/2);geometry.center();geometry.computeBoundingSphere();geometry.computeVertexNormals();
      const radius=geometry.boundingSphere!.radius;
      const material=new THREE.MeshStandardMaterial({color,roughness:.68,metalness:.08,side:THREE.DoubleSide});
      scene.add(new THREE.Mesh(geometry,material));scene.add(new THREE.HemisphereLight(0xffffff,0x77818b,2.4));
      const lamp=new THREE.DirectionalLight(0xffffff,3);lamp.position.set(3,5,4);scene.add(lamp);
      const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.minDistance=radius*1.2;controls.maxDistance=radius*12;
      const render=()=>{renderer.render(scene,camera);renderer.domElement.dataset.view=String(camera.position.x.toFixed(3))+','+camera.position.z.toFixed(3);};
      const fit=()=>{const aspect=node.clientWidth/node.clientHeight;camera.aspect=aspect;camera.updateProjectionMatrix();const distance=radius/Math.sin(Math.min(camera.fov*Math.PI/360,Math.atan(Math.tan(camera.fov*Math.PI/360)*aspect)))*1.15;camera.position.set(distance*.7,distance*.55,distance*.8);camera.lookAt(0,0,0);controls.target.set(0,0,0);controls.update();render();};
      node.appendChild(renderer.domElement);
      const resize=()=>{renderer.setSize(node.clientWidth,node.clientHeight);fit();};resize();
      const observer=new ResizeObserver(resize);observer.observe(node);controls.addEventListener('change',render);reset.current=fit;
      const key=(e:KeyboardEvent)=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const rotation=new THREE.Quaternion().setFromAxisAngle(e.key.includes('Left')||e.key.includes('Right')?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0),e.key==='ArrowLeft'||e.key==='ArrowUp'?.15:-.15);camera.position.applyQuaternion(rotation);camera.lookAt(0,0,0);controls.update();render();};
      renderer.domElement.addEventListener('keydown',key);
      cleanup=()=>{observer.disconnect();controls.dispose();geometry.dispose();material.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();reset.current=undefined;};
      setReady(true);setStatus('Drag to rotate · Scroll to zoom');
    })().catch(()=>{if(!disposed)setStatus('Preview unavailable. Download the STL to open it locally.');});
    return()=>{disposed=true;cleanup();};
  },[url,flip,color]);
  return <figure className="figure cad-viewer">
    <div className="cad-stage" ref={host}>
      <img className="cad-poster print-only" src={image} width={size?.width} height={size?.height} alt={caption}/>
    </div>
    <div className="cad-tools no-print"><span role="status">{status || 'STL model · Interactive preview'}</span>{ready && <button onClick={()=>reset.current?.()}>Reset view</button>}{url && <a href={url} download>Download STL</a>}</div>
    <figcaption><span className="caption-pointer" aria-hidden="true">▲</span>{caption}</figcaption>
  </figure>;
}

export function CadGroup({children}:{children?:ReactNode}) {
  return <div className="cad-group">{children}</div>;
}
