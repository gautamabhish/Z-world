//@ts-nocheck
import React from 'react';
import { Html } from '@react-three/drei';

const CarDashboard: React.FC = () => {
  const buttonStyle: React.CSSProperties = {
    flex: 1,
    margin: "10px",
    padding: "12px 24px",
    background: "rgb(0,125,130)",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    textAlign: "center",
  };

  return (
    <Html center style={{pointerEvents:"none"}}position={[-1.3, 6.2, 1]}>
      <div
        style={{
          width: "300px",
          padding: "10px",
          background: "#000",
          color: "white",
          textAlign: "center",
          borderRadius: "10px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div style={buttonStyle}>Speed:80</div>
          <div style={buttonStyle}>Brake: S</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div style={buttonStyle}>Horn:H </div>
          <div style={{ ...buttonStyle, background: "darkred" }}>Exit</div>
        </div>
      </div>
    </Html>
  );
};

export default CarDashboard;