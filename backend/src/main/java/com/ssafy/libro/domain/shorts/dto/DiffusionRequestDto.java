package com.ssafy.libro.domain.shorts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiffusionRequestDto {
    @Builder.Default
    private String prompt = "(HDR, UHD, 64K), (best quality, masterpiece), anime style, " +
            "universe, milkyway, scenary, landscape, sunrise, clean pastel color tones, wallpaper, " +
            "professional, (hyper detailed, ultra detailed, highly detailed), fantasy world";
    @Builder.Default
    private String negative_prompt = "(EasyNegative, AuroraNegative, ng_deepnegative_v1_75t, " +
            "bad-image-v2-39000, negative_hand-neg, badhandv4), " +
            "(worst quality, bad quality, poor quality, normal quality, low quality:1.5), " +
            "(username, watermark, signature, time signature, timestamp, artist name, copyright name, copyright), " +
            "(bad anatomy, extra digits, fewer digits), (bad fingers, bad hands, bad arms, bad legs, bad body), " +
            "(extra fingers, extra hands, extra arms, extra legs), missing fingers, " +
            "(poorly drawn, poorly drawn hands, poorly drawn face), (bad-artist, bad-artist-anime), " +
            "nsfw, ugly, blurry, jpeg artifacts, text, logo";
    @Builder.Default
    private Integer steps = 20;
    @Builder.Default
    private Double cfg_scale = 9.0;
    @Builder.Default
    private Integer width = 360;
    @Builder.Default
    private Integer height = 640;
    @Builder.Default
    private Double denoising_strength = 0.25;
    @Builder.Default
    private Map<String, String> override_settings = Map.of(
            "sd_model_checkpoint", "animePastelDream_softBakedVae: 4be38c1a17",
            "sd_lora", "more_details",
            "sd_vae", "vaeFtMse840000Ema_v100.pt"
    );
    @Builder.Default
    private Boolean enable_hr = true;
    @Builder.Default
    private Double hr_scale = 2.0;
    @Builder.Default
    private String hr_upscaler = "R-ESRGAN 4x+";
    @Builder.Default
    private Integer hr_second_pass_steps = 8;
    @Builder.Default
    private String sampler_index = "DPM++ SDE Karras";

    public DiffusionRequestDto updatePrompt(String prompt) {
        this.prompt = "(HDR, UHD, 64K), (best quality, masterpiece), anime style, " + prompt +
                ", professional, (hyper detailed, ultra detailed, highly detailed), fantasy world";
        return this;
    }
}
