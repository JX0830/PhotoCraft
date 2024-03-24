import React from "react";
import image1 from "./Guides/image1.png";
import image2 from "./Guides/image2.png";
import image3 from "./Guides/image3.png";
import image4 from "./Guides/image4.png";
import guidanceScale from "./Guides/guidanceScale.png";
import steps from "./Guides/steps.png";
import controlnetDisabled from "./Guides/controlnetDisabled.png";
import controlnet from "./Guides/controlnet.png";
import dropdown from "./Guides/dropdown.png";
import controlNet_Canny from "./Guides/controlNet_Canny.png";
import controlNet_Depth from "./Guides/controlNet_Depth.png";
import controlNet_OpenPose from "./Guides/controlNet_OpenPose.png";
import generate from "./Guides/generate.png";
import output from "./Guides/output.png";
import pipelines from "./Guides/pipelines.png";
import { Container } from "react-bootstrap";
const QuickGuide = () => {
  return (
    <Container>
      <div className="pl-2">
        {" "}
        {/* Add pl-2 class for left padding */}
        <h1 className="text-center">QUICK GUIDE</h1>
        <div>
          PhotoCraft offers a user-friendly experience where users can simply
          input a prompt and press "Generate." However, for those seeking a more
          enhanced experience, the following steps are recommended:
        </div>
        <br />
        <div>
          1. (OPTIONAL) Select a Stable Diffusion pipeline
          <br />
          Stable Diffusion Pipeline: This pipeline uses models trained on
          512x512 images. It's suitable for users with lower VRAM, particularly
          those with less than 10 VRAMs.
          <br />
          Stable Diffusion XL pipline: This pipeline employs models trained on
          1024x1024 images, allowing for the generation of high-resolution
          images. Requires more VRAM, specifically 16 VRAMs. However, more VRAMs
          could lead to better performance.
          <img
            alt=""
            src={pipelines}
            style={{ width: "1000px", height: "auto" }}
          />
        </div>
        <div>
          2. (OPTIONAL) Select an image, and the chosen one will be outlined
          with a blue border.
        </div>
        <img alt="" src={image1} style={{ width: "1000px", height: "auto" }} />
        <div>3. (OPTIONAL) Select a Style</div>
        <img alt="" src={image2} style={{ width: "1000px", height: "auto" }} />
        <div>
          4. The chosen style will be showcased in the prompt textbox, and you
          can continue composing the prompt with each new element separated by a
          comma (,).
        </div>
        <img alt="" src={image3} style={{ width: "700px", height: "auto" }} />
        <div>
          5. (OPTIONAL) You can adjust the importance of each element by adding
          a plus sign (+) to increase its weight or a minus sign (-) to reduce
          it. If it is a sentence, you can enclose the entire sentence or
          specific words within parentheses to indicate their weight is for
          emphasis.
        </div>
        <img alt="" src={image4} style={{ width: "700px", height: "auto" }} />
        <div>
          <p>
            6. (OPTIONAL) The range of guidance scales spans from 1 to 30. These
            scales influence how the model interprets and adheres to the given
            prompt, determining the level of strictness with which it follows
            instructions.
          </p>
          <ul>
            <li>
              At guidance scale 1, the AI has significant creative freedom,
              allowing it to interpret the prompt more freely.
            </li>
            <li>
              With guidance scales above 15, the AI adheres more strictly to the
              provided prompt, potentially resulting in images closely aligned
              with the user's specifications but potentially lacking in artistic
              flair.
            </li>
            <li>
              The default guidance scale value is 7, offering a middle ground
              that balances the AI's creativity with the user's directives.
            </li>
          </ul>
        </div>
        <img
          alt=""
          src={guidanceScale}
          style={{ width: "400px", height: "auto" }}
        />
        <div>
          7. (OPTIONAL) Sampling steps define the number of refinements applied
          to random noise for image transformation. Higher sampling steps result
          in longer processing times per image, requiring increased processing
          power and potentially more VRAM from the GPU. Generally, higher steps
          yield higher image quality; however, there's a critical threshold
          where further steps may degrade rather than enhance image quality. The
          default setting for this application is 50 steps.
        </div>
        <img alt="" src={steps} style={{ width: "400px", height: "auto" }} />
        <div>
          8. ControlNet is a neural network integrated into Stable Diffusion to
          govern image generation by incorporating additional conditions. It
          enables the specification of human poses, the replication of
          composition from other images, and the generation of similar images.
        </div>
        <br />
        <div>
          Toggle the activation of ControlNet by clicking on the term
          "ControlNet".
        </div>{" "}
        <div>
          The image selected in step 1 is automatically chosen as the input
          image for ControlNet. Users can also upload their own images by
          clicking "Choose File".
        </div>
        <img
          alt=""
          src={controlnetDisabled}
          style={{ width: "400px", height: "auto", textAlign: "top" }}
        />
        <img
          alt=""
          src={controlnet}
          style={{ width: "400px", height: "auto" }}
        />
        <div>
          User can choose different ControlNets by clicking the dropdown button,
          and the ControlNet image will be generated according to the selected
          ControlNet.
        </div>
        <img alt="" src={dropdown} style={{ width: "200px", height: "auto" }} />
        <div>
          The images below showcase different ControlNet outputs, namely
          OpenPose, Canny, and Depth, respectively:
        </div>
        <img
          alt=""
          src={controlNet_OpenPose}
          style={{ width: "300px", height: "auto" }}
        />{" "}
        <img
          alt=""
          src={controlNet_Canny}
          style={{ width: "300px", height: "auto" }}
        />{" "}
        <img
          alt=""
          src={controlNet_Depth}
          style={{ width: "300px", height: "auto" }}
        />
        <div>
          9. To proceed with image generation, click the "Generate" button
          located at the bottom of the page.
        </div>
        <img alt="" src={generate} style={{ width: "400px", height: "auto" }} />
        <div>
          10. The generated image will be displayed in the output banner.
        </div>
        <img alt="" src={output} style={{ width: "400px", height: "auto" }} />
      </div>
    </Container>
  );
};

export default QuickGuide;
