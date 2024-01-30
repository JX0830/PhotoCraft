import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Card,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ControlNet from './ControlNet'

const validationSchema = Yup.object({
  height: Yup.number()
    .required("Height is required")
    .integer("Height must be an integer")
    .min(512, "Height cannot be lesser than 512"),
  width: Yup.number()
    .required("Width is required")
    .integer("Height must be an integer")
    .min(512, "Width cannot be lesser than 512"),
  steps: Yup.number()
    .required("Height is required")
    .integer("Height must be an integer"),
});

const App = () => {
  const [image, updateImage] = useState();
  const [loading, updateLoading] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [controlNetOptions, setControlNetOptions] = useState("Canny");
  const toggleCard = () => {
    setIsOpen(!isOpen);
  };
  const formik = useFormik({
    initialValues: {
      prompt: "",
      height: 512,
      width: 512,
      guidance_scale: 7.5,
      steps: 50,
      controlNetOptions: "Canny"
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      generate(values);
    },
  });

  const generate = async (formValues) => {
    console.log(formValues);
    updateLoading(true);
    try {
      const url = isOpen ? "http://127.0.0.1:8000/controlNet" : "http://127.0.0.1:8000/";
      const result = await axios.post(
        url,
        formValues
      );
      updateImage(result.data);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      updateLoading(false);
    }
  };

  useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);

  return (
    <Container>
      <Row className="mb-3">
        <Row>
          <h1 className="text-center">Stable Diffusion FYP</h1>
        </Row>
        {/* Left Section */}
        <Col sm={6}>
          <h1>Input</h1>

          <Form onSubmit={formik.handleSubmit}>
            <Row className="mb-3">
              <Form.Group controlId="prompt">
                <Form.Label>Prompt:</Form.Label>
                <Form.Control
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prompt}
                  width={"350px"}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="height">
                  <Form.Label>Height:</Form.Label>
                  <Form.Control
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.height}
                    width={"100px"}
                    min={512}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="width">
                  <Form.Label>Width:</Form.Label>
                  <Form.Control
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.width}
                    width={"100px"}
                    min={512}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="guidance_scale">
                  <Form.Label>Guidance Scale:</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.guidance_scale}
                    width={"100px"}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="steps">
                  <Form.Label>Steps:</Form.Label>
                  <Form.Control
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.steps}
                    width={"100px"}
                    min={10}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="steps">
                <Card>
                  <Card.Header>
                    <Button
                      variant="link"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: "transparent",
                        border: "none",
                        textDecoration: 'none',
                      }}
                      onClick={toggleCard}
                    >
                      <strong>ControlNet ({isOpen?"Enabled":"Disabled"})</strong>
                    </Button>
                  </Card.Header>
                  {isOpen && (
                    <Card.Body>
                      {/* Your content goes here */}
                      <ControlNet 
                      controlNetOptions={controlNetOptions}
                      setControlNetOptions={setControlNetOptions}
                      formik={formik}/>
                    </Card.Body>
                  )}
                </Card>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Button type="submit">Generate</Button>
            </Row>
          </Form>
        </Col>

        {/* Right Section */}
        <Col sm={6}>
          <h1>Output</h1>
          <div
            style={{
              boxShadow: "lg",
              border: "1px solid #ccc",
              borderRadius: "md",
              height: "400px",
              width: "100%",
              overflow: "hidden", // Hide any overflow
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
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : image ? (
                <img
                  src={`data:image/png;base64,${image}`}
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
        </Col>
      </Row>
    </Container>
  );
};

export default App;
