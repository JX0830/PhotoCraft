from auth_token import auth_token
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import torch
from pydantic import BaseModel
from torch import autocast
from diffusers import StableDiffusionPipeline, StableDiffusionControlNetPipeline, ControlNetModel, UniPCMultistepScheduler
import numpy as np
from diffusers.utils import load_image
from io import BytesIO
import base64 

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

class FormValues(BaseModel):
    prompt: str
    height: int
    width: int
    guidance_scale : float
    steps : int

@app.post("/")
async def generate(formValues: FormValues): 
    device = "cuda"
    model_id = "CompVis/stable-diffusion-v1-4"
    pipe = StableDiffusionPipeline.from_pretrained(model_id, revision="fp16", torch_dtype=torch.float16, use_auth_token=auth_token)
    pipe.to(device)
    print(formValues)
    with autocast(device): 
        image = pipe(formValues.prompt, guidance_scale=formValues.guidance_scale, height=formValues.height, width=formValues.width, num_inference_steps=formValues.steps, negative_prompt=negative_prompt).images[0]

    image.save("testimage.png")
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())

    return Response(content=imgstr, media_type="image/png")

@app.post("/controlNet")
async def generate(formValues: FormValues): 
    image = load_image(
        "https://hf.co/datasets/huggingface/documentation-images/resolve/main/diffusers/input_image_vermeer.png")
    