//@ts-nocheck
import { useLoader } from "@react-three/fiber";
import { useState, useRef, useMemo, useCallback } from "react";
import { RigidBody } from "@react-three/rapier";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Html } from "@react-three/drei";

export const GameMap = ({ model }) => {
  const { scene } = useLoader(GLTFLoader, model);
  const group = useRef();
  const [driveOptions, setDriveOptions] = useState(false);

  // Separate transport and static meshes
  const { transportMeshes, staticMeshes } = useMemo(() => {
    const transportMeshes = [];
    const staticMeshes = [];

    scene.children.forEach((mesh) => {
      if (mesh.name?.startsWith("transport")) {
        transportMeshes.push(mesh);
      } else {
        staticMeshes.push(mesh);
      }
    });

    return { transportMeshes, staticMeshes };
  }, [scene]);

 

  return (
    <group ref={group}>
      {/* Transport Meshes (Dynamic) */}
      {transportMeshes.map((mesh, index) => (
        <RigidBody
          key={index}
          colliders="cuboid" // Larger collider than the object
          activeEvents="collision"
          type="dynamic"
          linearDamping={16}
          angularDamping={100}
          gravityScale={6}
          friction={1.5}
          userData={{ type: "drive" }}
          mass={5000}
        >
          <primitive object={mesh} />
        </RigidBody>
      ))}

      {/* Static Meshes (Fixed) */}
      <RigidBody colliders="trimesh" type="fixed">
        {staticMeshes.map((mesh, index) => (
          <primitive key={index} object={mesh} />
        ))}
      </RigidBody>
    </group>
  );
};
