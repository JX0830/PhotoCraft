import React from "react";
import { Tabs, Tab } from "react-bootstrap";

const ImageBanner = ({ previewImage, setPreviewImage,setIsOpen }) => {
  const importAll = (r) => r.keys().map(r);

  const photo = importAll(
    require.context(`./images/photo`, false, /\.(png|jpe?g|svg|webp)$/)
  );
  const pose = importAll(
    require.context(`./images/pose`, false, /\.(png|jpe?g|svg|webp)$/)
  );
  const painting = importAll(
    require.context(`./images/painting`, false, /\.(png|jpe?g|svg|webp)$/)
  );

  const handleImageClick = (path) => {
    setIsOpen(true);
    setPreviewImage(path);
  };

  return (
    <Tabs
      defaultActiveKey="photo"
      transition={false}
      id="noanim-tab-example"
      className="mb-3"
    >
      <Tab eventKey="photo" title="Photo">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {photo.map((image, index) => (
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
                    previewImage === image ? "10px solid blue" : "none",
                }}
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>
      </Tab>
      <Tab eventKey="pose" title="Pose">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {pose.map((image, index) => (
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
                    previewImage === image ? "10px solid blue" : "none",
                }}
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>
      </Tab>
      <Tab eventKey="painting" title="Painting">
        <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {painting.map((image, index) => (
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
                    previewImage === image ? "10px solid blue" : "none",
                }}
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>
        </div>
      </Tab>
    </Tabs>
  );
};

export default ImageBanner;
