declare module 'spotify-preview-finder' {
    export function getPreview(trackId: string): Promise<string | null>;
}
