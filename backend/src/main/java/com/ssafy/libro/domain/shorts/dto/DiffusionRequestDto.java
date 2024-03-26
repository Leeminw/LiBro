package com.ssafy.libro.domain.shorts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiffusionRequestDto {
    private String prompt = "(HDR, UHD, 64K), (best quality, masterpiece), anime style, universe, milkyway, scenary, landscape, sunrise, clean pastel color tones, wallpaper, professional, (hyper detailed, ultra detailed, highly detailed), fantasy world";
    private String negativePrompt = "(EasyNegative, AuroraNegative, ng_deepnegative_v1_75t, bad-image-v2-39000, negative_hand-neg, badhandv4), (worst quality, bad quality, poor quality, normal quality, low quality:1.5), (username, watermark, signature, time signature, timestamp, artist name, copyright name, copyright), (bad anatomy, extra digits, fewer digits), (bad fingers, bad hands, bad arms, bad legs, bad body), (extra fingers, extra hands, extra arms, extra legs), missing fingers, (poorly drawn, poorly drawn hands, poorly drawn face), (bad-artist, bad-artist-anime), nsfw, ugly, blurry, jpeg artifacts, text, logo";
    private List<String> styles; // null 허용
    private Integer seed = -1;
    private Integer subseed = -1;
    private Integer subseedStrength = 0;
    private Integer seedResizeFromH = -1;
    private Integer seedResizeFromW = -1;
    private String samplerName; // null 허용
    private Integer batchSize = 1;
    private Integer nIter = 1;
    private Integer steps = 20;
    private Double cfgScale = 9.0;
    private Integer width = 360;
    private Integer height = 640;
    private Boolean restoreFaces = true;
    private Boolean tiling; // null 허용
    private Boolean doNotSaveSamples = false;
    private Boolean doNotSaveGrid = false;
    private Double eta; // null 허용
    private Double denoisingStrength = 0.25;
    private Double sMinUncond; // null 허용
    private Double sChurn; // null 허용
    private Double sTmax; // null 허용
    private Double sTmin; // null 허용
    private Double sNoise; // null 허용
    private Map<String, Object> overrideSettings = Map.of(
            "sd_model_checkpoint", "animePastelDream_softBakedVae",
            "sd_lora", "more_details: 3b8aa1d351ef",
            "sd_vae", "vaeFtMse840000Ema_v100.pt"
    );
    private Boolean overrideSettingsRestoreAfterwards = true;
    private String refinerCheckpoint; // null 허용
    private Integer refinerSwitchAt; // null 허용
    private Boolean disableExtraNetworks = false;
    private Map<String, Object> comments; // null 허용
    private Boolean enableHr = true;
    private Integer firstphaseWidth = 0;
    private Integer firstphaseHeight = 0;
    private Double hrScale = 2.0;
    private String hrUpscaler = "R-ESRGAN 4x+";
    private Integer hrSecondPassSteps = 8;
    private Integer hrResizeX = 0;
    private Integer hrResizeY = 0;
    private String hrCheckpointName; // null 허용
    private String hrSamplerName; // null 허용
    private String hrPrompt = "";
    private String hrNegativePrompt = "";
    private String samplerIndex = "DPM++ SDE Karras";
    private String scriptName; // null 허용
    private List<String> scriptArgs = List.of(); // 빈 리스트로 초기화
    private Boolean sendImages = true;
    private Boolean saveImages = false;
    private Map<String, Object> alwaysonScripts = Map.of(); // 빈 맵으로 초기화

    public DiffusionRequestDto updatePrompt(String prompt) {
        this.prompt = "(HDR, UHD, 64K), (best quality, masterpiece), anime style, " + prompt +
                ", professional, (hyper detailed, ultra detailed, highly detailed), fantasy world, " +
                "<lora:more_details:1><lora:more_details:1><lora:more_details:1><lora:more_details:1>";
        return this;
    }
}
