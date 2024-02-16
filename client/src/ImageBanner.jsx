import React, { useRef } from "react";
import { Tabs, Tab, Button, Row } from "react-bootstrap";

const ImageBanner = ({ previewImage, setPreviewImage, setIsOpen, loading }) => {
  const importAll = (r) => r.keys().map(r);
  const photo_portrait = importAll(
    require.context(`./images/photo_portrait`, false, /\.(png|jpe?g|svg|webp)$/)
  );
  const photo_landscape = importAll(
    require.context(
      `./images/photo_landscape`,
      false,
      /\.(png|jpe?g|svg|webp)$/
    )
  );

  const pose_portrait = importAll(
    require.context(`./images/pose_portrait`, false, /\.(png|jpe?g|svg|webp)$/)
  );
  const pose_landscape = importAll(
    require.context(`./images/pose_landscape`, false, /\.(png|jpe?g|svg|webp)$/)
  );
  const painting_landscape = importAll(
    require.context(
      `./images/painting_landscape`,
      false,
      /\.(png|jpe?g|svg|webp)$/
    )
  );
  const painting_portrait = importAll(
    require.context(
      `./images/painting_portrait`,
      false,
      /\.(png|jpe?g|svg|webp)$/
    )
  );
  const handleImageClick = (path) => {
    if (!loading) {
      setIsOpen(true);
      setPreviewImage(path);
    }
  };

  const containerRef_photo_landscape = useRef(null);
  const containerRef_photo_portrait = useRef(null);
  const containerRef_pose_landscape = useRef(null);
  const containerRef_pose_portrait = useRef(null);
  const containerRef_painting_landscape = useRef(null);
  const containerRef_painting_portrait = useRef(null);
  // Add refs for other tabs similarly

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: -800,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: 800,
        behavior: "smooth",
      });
    }
  };

  const tabs = (eventKey, title, containerRef, images, orientation) => {
    const width = orientation == "P" ? "200px" : "300px";
    const height = orientation == "P" ? "300px" : "200px";
    return (
      <Tab eventKey={eventKey} title={title}>
        <Button
          onClick={() => scrollLeft(containerRef)}
          variant="outline-light"
          style={{
            position: "absolute",
            left: -50,
            top: "50%",
            height: "50px",
            width: "50px",
            padding: "10px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          &lt;
        </Button>
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
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: width,
                    height: height,
                    objectFit: "cover",
                    marginRight: "10px",
                    cursor: "pointer",
                    border:
                      previewImage === image
                        ? "5px solid blue"
                        : "5px solid white",
                  }}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          </div>
        </div>
        <Button
          variant="outline-light"
          onClick={() => scrollRight(containerRef)}
          style={{
            position: "absolute",
            right: -50,
            top: "50%",
            height: "50px",
            width: "50px",
            padding: "10px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          &gt;
        </Button>
      </Tab>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <Tabs
        defaultActiveKey="photo_portrait"
        transition={false}
        id="noanim-tab-example"
        className="mb-3"
        style={{ color: "yellow", marginTop: "30px" }}
      >
        {tabs(
          "photo_portrait",
          "Photo Portrait",
          containerRef_photo_portrait,
          photo_portrait,
          "P"
        )}
        {tabs(
          "photo_landscape",
          "Photo Landscape",
          containerRef_photo_landscape,
          photo_landscape,
          "L"
        )}
        {tabs(
          "pose_portrait",
          "Pose Portrait",
          containerRef_pose_portrait,
          pose_portrait,
          "P"
        )}
        {tabs(
          "pose_landscape",
          "Pose Landscape",
          containerRef_pose_landscape,
          pose_landscape,
          "L"
        )}
        {tabs(
          "painting_portrait",
          "Painting Portrait",
          containerRef_painting_portrait,
          painting_portrait,
          "P"
        )}
        {tabs(
          "painting_landscape",
          "Painting Landscape",
          containerRef_painting_landscape,
          painting_landscape,
          "L"
        )}
      </Tabs>
    </div>
  );
};

export default ImageBanner;
