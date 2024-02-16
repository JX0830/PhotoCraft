import React, { useRef } from "react";
import { Button } from "react-bootstrap";

const PromptStyle = ({ formik }) => {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200; // Adjust scroll amount as needed
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200; // Adjust scroll amount as needed
    }
  };

  const handleSelectButtonClick = async(prompt) => {
    formik.setFieldValue("prompt", prompt);
  }

  return (
    <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>

        <h4>Styles</h4>
      <div
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          position: "relative",
        }}
        ref={containerRef}
      >
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", flexWrap: "nowrap" }}>
            <Button
              variant="outline-warning"
              style={{ marginRight: "10px" }}
              onClick={() => {handleSelectButtonClick(",Monochrome")}}
            >
              Monochrome
            </Button>
            <Button variant="outline-warning" style={{ marginRight: "10px" }}>
              Style
            </Button>
            <Button variant="outline-warning" style={{ marginRight: "10px" }}>
              Style
            </Button>
            <Button variant="outline-warning" style={{ marginRight: "10px" }}>
              Style
            </Button>
            <Button variant="outline-warning" style={{ marginRight: "10px" }}>
              Style
            </Button>
            <Button variant="outline-warning" style={{ marginRight: "10px" }}>
              Style
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptStyle;
