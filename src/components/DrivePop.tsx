//@ts-nocheck
import { useEffect } from "react";
import { Html } from "@react-three/drei";
const DrivePop = ({ setDrive }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "e") {
        setDrive(true);
        console.log("Drive mode activated! 🚗");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setDrive]);

  return (
    <Html>
    <button
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "radial-gradient(circle, #00faff 20%, #002bff 80%)",
        border: "2px solid cyan",
        color: "white",
        fontSize: "22px",
        fontFamily: "'Press Start 2P', cursive",
        textTransform: "uppercase",
        textShadow: "2px 2px 4px rgba(0, 255, 255, 0.8)",
        boxShadow: "0px 5px 0px cyan, 0px 10px 10px rgba(0, 255, 255, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        position: "relative",
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setDrive(true);
        e.target.style.boxShadow = "0px 3px 0px cyan, 0px 6px 6px rgba(0, 255, 255, 0.3)";
        e.target.style.transform = "translateY(18px)";
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        e.target.style.boxShadow = "0px 5px 0px cyan, 0px 10px 10px rgba(0, 255, 255, 0.3)";
        e.target.style.transform = "translateY(0px)";
      }}
    >
      ⚡ {/* Power Icon */}
    </button>
    </Html>
  );
};

export default DrivePop;
