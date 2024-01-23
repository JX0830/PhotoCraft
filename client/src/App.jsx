import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
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

  const formik = useFormik({
    initialValues: {
      prompt: "",
      height: 512,
      width: 512,
      guidance_scale: 7.5,
      steps: 20,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      generate(values);
    },
  });

  const generate = async (formValues) => {
    updateLoading(true);
    console.log("hello");
    try {
      const result = await axios.post("http://127.0.0.1:8000/", formValues);
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
        {/* Left Section */}
        <Col sm={6}>
          <h1>Left Section</h1>

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
              <Button type="submit">Generate</Button>
            </Row>
          </Form>
        </Col>

        {/* Right Section */}
        <Col sm={6}>
          <h1>Right Section</h1>
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
