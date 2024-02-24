import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

const PromptStyle = ({ formik }) => {
  const containerRef = useRef(null);
  const [promptStyle, setPromptStyle] = useState(null);
  const [selectedPromptStyle, setSelectedPromptStyle] = useState(null);

  const getPromptyStyle = async () => {
    try {
      const result = await axios.get("http://127.0.0.1:8000/promptStyle");
      setPromptStyle(result.data);
      console.log(result.data);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleSelectButtonClick = async (promptyStyle) => {
    formik.setFieldValue("prompt", promptyStyle.Description);
    setSelectedPromptStyle(promptyStyle.Style);
  };
  useEffect(() => {
    getPromptyStyle();
  }, []);

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
              ? promptStyle.map((promptyStyle, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedPromptStyle == promptyStyle.Style
                        ? "warning"
                        : "outline-warning"
                    }
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      handleSelectButtonClick(promptyStyle);
                    }}
                  >
                    {promptyStyle.Style}
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
