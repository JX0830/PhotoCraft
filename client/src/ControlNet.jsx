import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Dropdown, Spinner, Row, Col } from "react-bootstrap";

const ControlNet = ({ formik, previewImage, setPreviewImage, loading }) => {
  const [controlNetImage, setControlNetImage] = useState();
  const [controlNetLoading, updateControlNetLoading] = useState();
  const [selectedImage, setSelectdImage] = useState(null);

  const handleFileChange = (file, controlNetOption) => {
    setSelectdImage(file);
    if (file) {
      uploadFile(file, controlNetOption);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectdImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange2 = (file) => {
    setSelectdImage(file);
    if (file) {
      uploadFile(file, formik.values.controlNetOption);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectdImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSelectButtonClick = async (path, controlNetOption) => {
    const response = await fetch(path);
    const blob = await response.blob();
    const imageFile = new File([blob], "default.jpg", { type: blob.type });

    // Set default image
    handleFileChange(imageFile, controlNetOption);
  };
  const handleDropdownChange = async (controlNetOption) => {
    formik.setFieldValue("controlNetOption", controlNetOption);
    await handleSelectButtonClick(selectedImage, controlNetOption);
  };

  useEffect(() => {
    if (previewImage) {
      setSelectdImage(previewImage);
      handleSelectButtonClick(previewImage, formik.values.controlNetOption);
    }
  }, [previewImage]);

  const uploadFile = async (file, controlNetOption) => {
    console.log(file);
    console.log(controlNetOption);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("controlNetOption", controlNetOption);
    updateControlNetLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/uploadImage",
        formData
      );
      setControlNetImage(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      updateControlNetLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-2">
        <Dropdown onSelect={handleDropdownChange} style={{ width: "350px" }}>
          <Dropdown.Toggle
            style={{ minWidth: "150px" }}
            id="dropdown-basic"
            className="text-left d-flex align-items-center justify-content-between"
            variant="success"
            disabled={loading}
          >
            {formik.values.controlNetOption}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="Canny">Canny</Dropdown.Item>
            <Dropdown.Item eventKey="OpenPose">OpenPose</Dropdown.Item>
            <Dropdown.Item eventKey="Depth">Depth</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="mb-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange2(e.target.files[0])}
          disabled={loading}
        />
      </div>
      <Row>
        <Col>
          <p>Selected Image:</p>
        </Col>
        <Col>
          <p>ControlNet Image:</p>
        </Col>
      </Row>

      {selectedImage && (
        <div style={{ display: "flex" }}>
          <div
            style={{
              boxShadow: "lg",
              borderRadius: "md",
              height: "200px",
              width: "50%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <img
                src={selectedImage}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          </div>
          <div
            style={{
              boxShadow: "lg",
              borderRadius: "md",
              height: "200px",
              width: "50%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {controlNetLoading ? (
                <Spinner animation="border" variant="primary" />
              ) : controlNetImage ? (
                <img
                  src={`data:image/png;base64,${controlNetImage}`}
                  alt="Generated"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlNet;
