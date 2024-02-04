import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Dropdown, Spinner } from "react-bootstrap";

const ControlNet = ({ formik }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [controlNetImage, setControlNetImage] = useState();
  const [loading, updateLoading] = useState();
  const importAll = (r) => r.keys().map(r);
  const images = importAll(
    require.context(`./images`, false, /\.(png|jpe?g|svg|webp)$/)
  );
  const [selectedImagePath, setSelectedImagePath] = useState(null);

  const handleImageClick = (path) => {
    setSelectedImagePath(path);
    setSelectedFile(path);
  };

  const handleFileChange = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
      uploadFile(file, formik.values.controlNetOption);
    }
  };
  const handleSelectButtonClick = async () => {
    const response = await fetch(selectedImagePath);
    const blob = await response.blob();
    const imageFile = new File([blob], "default.jpg", { type: blob.type });

    // Set default image
    handleFileChange(imageFile);
    handleCloseModal();
  };

  const uploadFile = async (file, controlNetOption) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("controlNetOption", controlNetOption);
    updateLoading(true);
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/uploadImage", formData);
      setControlNetImage(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      updateLoading(false);
    }
  };
  

  const handleDropdownChange = (eventKey) => {
    formik.setFieldValue("controlNetOption", eventKey);
    uploadFile(selectedFile, eventKey);
  };

  const handleViewImages = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        <button className="mr-2" type="button" onClick={handleViewImages}>
          Available Images
        </button>
        &nbsp;&nbsp;
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files[0])}
        />
      </div>
      <p>Selected Image:</p>
      {selectedFile && (
  <div style={{ display: "flex" }}>
    <div style={{ boxShadow: "lg",  borderRadius: "md", height: "200px", width: "50%", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <img
        src={previewImage}
        alt="Preview"
        style={{ maxWidth: "100%", maxHeight: "200px" }}
      />
    </div></div>
    <div style={{ boxShadow: "lg",  borderRadius: "md", height: "200px", width: "50%", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : controlNetImage ? (
          <img
            src={`data:image/png;base64,${controlNetImage}`}
            alt="Generated"
            style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }}
          />
        ) : null}
      </div>
    </div>
  </div>
)}


      {/* Image Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>All Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: "200px",
                    height: "300px",
                    objectFit: "cover",
                    marginBottom: "10px",
                    cursor: "pointer",
                    border:
                      selectedImagePath === image ? "10px solid blue" : "none",
                  }}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
            {selectedImagePath && (
              <div>
                <p>Selected Image:</p>
                <img
                  style={{
                    maxWidth: "500px",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                  }}
                  src={selectedImagePath}
                  alt="Selected"
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSelectButtonClick}>
            Select
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ControlNet;