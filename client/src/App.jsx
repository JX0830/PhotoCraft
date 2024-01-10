import {
  ChakraProvider,
  Heading,
  Container,
  Text,
  Input,
  Button,
  Wrap,
  Stack,
  Image,
  SkeletonCircle,
  SkeletonText,
  FormLabel 
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";

const validationSchema = Yup.object({
  prompt: Yup.string().required("Prompt is required"),
  height: Yup.number().required("Height is required"),
  width: Yup.number().required("Width is required"),
});

const App = () => {
  const [image, updateImage] = useState();
  const [loading, updateLoading] = useState();

  const formik = useFormik({
    initialValues: {
      prompt: "",
      height: 512,
      width: 512,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      generate(values);
    },
  });

  const generate = async (formValues) => {
    updateLoading(true);
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
    <ChakraProvider>
      <Container>
        <Heading>Stable Diffusion</Heading>
        <br />
      </Container>
      <Container display="flex" justifyContent="space-between" maxW="1200px" padding={0}>
        {/* Left Section */}
        <div style={{ flex: "1", padding: 0 }}>
          <Heading>Left Section</Heading>
          <form onSubmit={formik.handleSubmit}>
            <Wrap marginBottom={"10px"}>
              <FormLabel htmlFor="prompt">Prompt:</FormLabel>
              <Input
                type="text"
                id="prompt"
                name="prompt"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.prompt}
                width={"350px"}
              />
              <Button type="submit" colorScheme={"yellow"}>
                Generate
              </Button>
            </Wrap>
  
            {formik.touched.prompt && formik.errors.prompt ? (
              <Text color="red">{formik.errors.prompt}</Text>
            ) : null}
          </form>
        </div>
  
        {/* Right Section */}
        <div style={{ flex: "1" }}>
          <Heading>Right Section</Heading>
          {loading ? (
            <Stack>
              <SkeletonCircle />
              <SkeletonText />
            </Stack>
          ) : image ? (
            <Image src={`data:image/png;base64,${image}`} boxShadow="lg" />
          ) : null}
        </div>
      </Container>
    </ChakraProvider>
  );
};

export default App;
