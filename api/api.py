from auth_token import auth_token
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import torch
from pydantic import BaseModel
from torch import autocast
from diffusers import StableDiffusionPipeline
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

device = "cuda"
model_id = "CompVis/stable-diffusion-v1-4"
pipe = StableDiffusionPipeline.from_pretrained(model_id, revision="fp16", torch_dtype=torch.float16, use_auth_token=auth_token)
pipe.to(device)

class FormValues(BaseModel):
    prompt: str
    height: int | None = None
    width: int | None = None

@app.post("/")
async def generate(formValue: FormValues): 
    print(formValue)
    with autocast(device): 
        image = pipe(formValue.prompt, guidance_scale=8.5,height= 512,width= 768).images[0]

    image.save("testimage.png")
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())

    return Response(content=imgstr, media_type="image/png")