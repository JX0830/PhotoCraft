import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

const PromptStyle = ({ formik }) => {
  const containerRef = useRef(null);
  const [promptStyle, setPromptStyle] = useState(null);

  const getPromptyStyle = async () => {
    try {
      const result = await axios.get("http://127.0.0.1:8000/promptStyle");
      setPromptStyle(result.data);
      console.log(result.data)
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleSelectButtonClick = async (prompt) => {
    formik.setFieldValue("prompt", prompt);
  };
  useEffect(() => {
    getPromptyStyle();
  }, []);

  const buttons = () => {
    return promptStyle ? (
      <Button
        variant="outline-warning"
        style={{ marginRight: "10px" }}
        onClick={() => {
          handleSelectButtonClick(",Monochrome");
        }}
      >
        Monochrome
      </Button>
    ) : (
      ""
    );
  };

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
            {promptStyle
              ? promptStyle.map((style, index) => (
                  <Button
                    key={index}
                    variant="outline-warning"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      handleSelectButtonClick(style.Description);
                    }}
                  >
                    {style.Style}
                  </Button>
                ))
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptStyle;
