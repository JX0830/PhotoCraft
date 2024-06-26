from auth_token import auth_token
from fastapi import FastAPI, Response, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import torch
from pydantic import BaseModel
from torch import autocast
from diffusers import StableDiffusionPipeline, StableDiffusionXLPipeline, ControlNetModel, StableDiffusionControlNetPipeline, UniPCMultistepScheduler, StableDiffusionXLControlNetPipeline, AutoencoderKL
import numpy as np
from diffusers.utils import load_image, make_image_grid
from io import BytesIO
import base64
from datetime import datetime
from PIL import Image
import cv2
from pathlib import Path
from controlnet_aux import OpenposeDetector
from transformers import pipeline
import pandas as pd

app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)
negative_prompt = '''nsfw, deformed, mutated, mutilated, distorted, disfigured extra limbs, missing limbs, floating limbs, disconnected body parts,
                    missing arms, missing legs, missing fingers, amputated, amputation, extra arms, third arm, extra legs,too many fingers, fused fingers,
                    low quality, low resolution, pixelated, jpeg artifacts, blurry, unclear, out of focus, depth of field, bad anatomy, wrong anatomy
                    bad proportions, disproportionate  '''
model_id = "spitfire4794/photo"
class FormValues(BaseModel):
    prompt: str
    height: int
    width: int
    guidance_scale: float
    steps: int
    controlNetOption: str
    model_id: int

@app.post("/")
async def generate(formValues: FormValues): 
    print(formValues)
    device = "cuda"
    if (formValues.model_id == 1):
        model_id="SG161222/Realistic_Vision_V5.1_noVAE"
        pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
    else:
        model_id="SG161222/RealVisXL_V4.0"
        pipe = StableDiffusionXLPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
    pipe.to(device)
    print(model_id)
    # pipe = StableDiffusionPipeline.from_pretrained("dreamlike-art/dreamlike-photoreal-2.0", revision="fp16", torch_dtype=torch.float16, use_auth_token=auth_token)
    with autocast(device): 
        output = pipe(formValues.prompt, guidance_scale=formValues.guidance_scale, height=formValues.height, width=formValues.width, num_inference_steps=formValues.steps, negative_prompt=negative_prompt).images[0]

    save_path = "output_images/"+datetime.now().strftime("%Y-%m-%d_%H-%M-%S")+".png"
    output.save(save_path)
    buffer = BytesIO()
    output.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())

    return Response(content=imgstr, media_type="image/png")


@app.post("/controlNet")
async def controlNetGenerate(formValues: FormValues): 
    print(formValues)
    image = load_image(
    "controlNet_image\controlNet_2.png"
    )
    if (formValues.model_id == 1):
        controlNet_str="lllyasviel/sd-controlnet-canny"
        if(formValues.controlNetOption=="OpenPose"):
            controlNet_str="fusing/stable-diffusion-v1-5-controlnet-openpose"
        elif(formValues.controlNetOption=="Depth"):
            controlNet_str="lllyasviel/sd-controlnet-depth"
        model_id = "SG161222/Realistic_Vision_V5.1_noVAE"
        controlnet = ControlNetModel.from_pretrained(controlNet_str, torch_dtype=torch.float16)
        pipe = StableDiffusionControlNetPipeline.from_pretrained(
            model_id, use_safetensors=True,controlnet=controlnet, torch_dtype=torch.float16,
        )
    else:
        if(formValues.controlNetOption=="Canny"):
            controlNet_str="diffusers/controlnet-canny-sdxl-1.0-small"
        elif(formValues.controlNetOption=="Depth"):
            controlNet_str="diffusers/controlnet-depth-sdxl-1.0-small"
        vae = AutoencoderKL.from_pretrained("madebyollin/sdxl-vae-fp16-fix", torch_dtype=torch.float16)
        controlnet = ControlNetModel.from_pretrained(controlNet_str, torch_dtype=torch.float16)
        model_id="SG161222/RealVisXL_V4.0"
        pipe = StableDiffusionXLControlNetPipeline.from_pretrained(
        model_id, vae=vae, use_safetensors=True,controlnet=controlnet, torch_dtype=torch.float16,)
    print(model_id)
    pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)
    pipe.enable_model_cpu_offload()
    prompt = formValues.prompt+" ,best quality, extremely detailed"
    #prompt = [t + prompt for t in ["Sandra Oh", "Kim Kardashian", "rihanna", "taylor swift"]]
    #generator = [torch.Generator(device="cpu").manual_seed(2)] # seed number
    output = pipe(
    prompt,
    image = image,
    negative_prompt=negative_prompt,
    num_inference_steps=formValues.steps,
    controlnet_conditioning_scale=0.5
    #generator=generator,
    ).images[0]
    save_path = "output_images/"+datetime.now().strftime("%Y-%m-%d_%H-%M-%S")+".png"
    output.save(save_path)
    buffer = BytesIO()
    output.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())
    return Response(content=imgstr, media_type="image/png")



@app.post("/uploadImage")
async def uploadImage(image: UploadFile = File(...), controlNetOption: str = Form(...)):
    # Access the uploaded image
    contents = await image.read()
    
    # Save the image as a PNG file with a specific filename (e.g., controlNet_1.png)
    file_path = Path("controlNet_image") / f"controlNet_1.png"
    with open(file_path, "wb") as f:
        f.write(contents)

    image = load_image("controlNet_image\controlNet_1.png")

    if(controlNetOption=="Canny"):
        canny_image = np.array(image)

        low_threshold = 100
        high_threshold = 200

        canny_image = cv2.Canny(canny_image, low_threshold, high_threshold)
        canny_image = canny_image[:, :, None]
        canny_image = np.concatenate([canny_image, canny_image, canny_image], axis=2)
        controlNet_image = Image.fromarray(canny_image)

    elif(controlNetOption=="OpenPose"):
        model = OpenposeDetector.from_pretrained("lllyasviel/ControlNet")
        controlNet_image = model(image)
    elif(controlNetOption=="Depth"):
        depth_estimator = pipeline('depth-estimation')
        controlNet_image = depth_estimator(image)['depth']
        
    c_path = "controlNet_image/controlNet_2.png"
    controlNet_image.save(c_path)
    
    buffer = BytesIO()
    controlNet_image.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())
    return Response(content=imgstr, media_type="image/png")


@app.get("/promptStyle")
async def read_data():
    df = pd.read_excel("PromptStyle.xlsx")
    data_dict = df.to_dict(orient="records")
    return JSONResponse(content=data_dict)
