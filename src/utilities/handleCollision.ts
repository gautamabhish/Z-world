//@ts-nocheck

const handleCollision = (setDriveOptions, drive, rb, carRef, event) => {
    if (!drive && event?.other?.rigidBody?.userData?.type === "drive") {
      console.log("Collided with a driveable car:", event?.other);
      
      setDriveOptions(true);
      carRef.current = event?.other; // Store car reference
      console.log(carRef);
      setTimeout(() => {
        setDriveOptions(false);
        
      }, 1500);
    }
  };
  
  export {handleCollision}