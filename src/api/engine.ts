import request from "./request";

interface VoiceGenerateParams {
  text: string;
  voice_name: string;
}

interface VoiceGenerateResult {
  url: string;
}

export function voiceGenerate(params: VoiceGenerateParams): Promise<VoiceGenerateResult> {
  return request.post('/v1/tts/voice.generate', params);
}

interface VideoGenerateParams {
  audio_url: string;
  pose_id: string;
}

interface VideoGenerateResult {
  video_id: string;
  status: string;
}

export function videoGenerate(params: VideoGenerateParams): Promise<VideoGenerateResult> {
  return request.post('/v1/a2v/video.generate', params);
}

export interface VideoListItem {
  video_id: string;
  status: string;
  video_url: string;
  preview_url: string;
}

export function getVideoList(): Promise<VideoListItem[]> {
  return request.get('/v1/a2v/video.list');
}
