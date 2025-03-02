//@ts-nocheck
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useCallback } from "react";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import * as THREE from "three";

import Character from "./Character";
import { Html } from "@react-three/drei";
import image from "/imgs/power.png"
import CarDashboard from "./DriveDashBoard";
import DrivePop from "./DrivePop";
import { handleCollision } from "../utilities/handleCollision";

import { lerpAngle } from "../utilities/lerpAngle";

export const CharacterController = () => {
  const WALK_SPEED = 3, RUN_SPEED = 5, ROTATION_SPEED = 0.01

  const container = useRef();
  const character = useRef();

  const characterRef = useRef();
  const carRef = useRef();
  const rb = useRef();

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());


  const containerPlayer = useRef();
  const cameraTargetPlayer = useRef();
  const cameraPositionPlayer = useRef();
  const characterPlayer = useRef();

  const [drive, setDrive] = useState(false);
  const [animation, setAnimation] = useState("idle");
  const [driveOptions, setDriveOptions] = useState(false);
  const [, get] = useKeyboardControls();
  const isClicking = useRef(false);


  

  useEffect(() => {
  
     if (drive && carRef.current) {
      rb.current = carRef.current?.rigidBody ;
      container.current = carRef?.current?.rigidBody; 
      cameraTarget.current = carRef?.current?.rigidBodyObject;
      cameraPosition.current = carRef?.current?.rigidBodyObject; 
    }
  else {
      rb.current = characterRef.current;
      container.current = containerPlayer?.current;
      cameraTarget.current = cameraTargetPlayer?.current ; 
      cameraPosition.current = cameraPositionPlayer?.current;
      character.current = characterPlayer?.current;
    }
  }, [drive]);
  
  useEffect(()=>{
    console.log(carRef);
  },[carRef.current])
  
  useEffect(() => {
    const onMouseDown = (e) => {
      isClicking.current = true;
    };
    const onMouseUp = (e) => {
      isClicking.current = false;
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    // touch
    document.addEventListener("touchstart", onMouseDown);
    document.addEventListener("touchend", onMouseUp);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onMouseDown);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  useFrame(({ camera, mouse }) => {
    if(!rb.current)return;
   
    if (drive) {
   
      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };
    
      // 🚗 Movement Controls
      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;
    
      // 🔄 Apply Rotation to the Car Itself
      if (movement.x !== 0) {
        rotationTarget.current = MathUtils.lerp(rotationTarget.current, rotationTarget.current + 0.05 * movement.x, 0.1);// Smooth turning
        rb.current.setAngvel({ x: 0, y: movement.x * 1.5, z: 0 }, true); // 🔥 Rotates car
      }
    
      // 🏎️ Apply Forward/Backward Movement Based on Rotation
      if (movement.z !== 0) {
        vel.x = Math.sin(rotationTarget.current) * 14 * movement.z;
        vel.z = Math.cos(rotationTarget.current) * 14 * movement.z;
      }
    
      rb.current.setLinvel(vel, true);
    
      // 🎯 Apply Rotation Directly to the Car Model
      character.current.rotation.y = MathUtils.lerp(character.current.rotation.y, rotationTarget.current*4, 0.1);
    
      // 📷 CAMERA FOLLOW SYSTEM
      container.current.rotation.y = MathUtils.lerp(container.current.rotation.y, rotationTarget.current, 0.1);
      
      if (carRef.current) {
        carRef.current.rigidBodyObject.getWorldPosition(cameraWorldPosition.current);
      }
    
      // 🚀 Adjust Camera Height & Distance
    
  cameraWorldPosition.current.set(
    carRef.current.rigidBodyObject.position.x - Math.sin(rotationTarget.current) * 10, // Stay behind the car
    carRef.current.rigidBodyObject.position.y + 2, // Keep camera at a height
    carRef.current.rigidBodyObject.position.z - Math.cos(rotationTarget.current) * 10  // Stay behind based on rotation
  );
      camera.position.lerp(cameraWorldPosition.current, 0.1);
    
      // 🎯 Ensure Camera Always Looks at the Car
      if (cameraTarget.current) {
        cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
        cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
        camera.lookAt(cameraLookAt.current);
      }
  }


    
   
    else if (!drive && rb.current) {
      // 🏃 CHARACTER CONTROLS 🏃
      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };
  
      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
  
      let speed = get().run ? RUN_SPEED : WALK_SPEED;
  
      if (isClicking.current) {
        if (Math.abs(mouse.x) > 0.1) movement.x = -mouse.x;
        movement.z = mouse.y + 0.4;
        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED;
        }
      }
  
      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;
      if (get().jump) rb.current.applyImpulse({ x: 0, y: 50, z: 0 }, true);
  
      if (movement.x !== 0) rotationTarget.current += ROTATION_SPEED * movement.x;
  
      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
        vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;
  
        setAnimation(speed === RUN_SPEED ? "sprint" : "walk");
      } else {
        setAnimation("idle");
      }
  
      character.current.rotation.y = lerpAngle(character.current.rotation.y, characterRotationTarget.current, 0.1);
      rb.current.setLinvel(vel, true);


       // CAMERA FOLLOW
    container.current.rotation.y = MathUtils.lerp(container.current.rotation.y, rotationTarget.current, 0.1);
    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);

    camera.position.lerp(cameraWorldPosition.current, 0.1);
  
    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
    }
    }
  
   
  });
  
  

 
  return (
    <>    <RigidBody
      type="dynamic"
      //  colliders={"capsule"}
      lockRotations
      linearDamping={1}
      mass={50}
      userData={{ type: "player" }}
      ccd={true}
      ref={characterRef}
      activeEvent="collison"
      onCollisionEnter={(e)=>{handleCollision(setDriveOptions,drive,rb,carRef,e)}}>
      <group ref={containerPlayer}>
        <group ref={cameraTargetPlayer} position-z={15} />
        <group ref={cameraPositionPlayer} position-y={6} position-z={-5} />
        <group ref={characterPlayer} position-y={3} position-x={1}>
          {!drive && (
            <group>
              <Character scale={1.2} animation={animation} />

              {driveOptions && <DrivePop setDrive={setDrive} container={container} cameraPosition={cameraPosition} character={character}/>}

              <CapsuleCollider args={[0.5, 0.35]} position={[0, 0.6, 0]} />
            </group>
          )} 
        </group>
        {drive && (
          <CarDashboard />
        )}
      </group>

    </RigidBody>

    </>


  );
}; 