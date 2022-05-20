#/bin/bash
node install typescript@latest
node update

# because fuck you google-tts
sed -i '1 s/./\/\/&/' node_modules/google-tts-api/dist/getAudioUrl.d.ts
tsc --build tsconfig.json