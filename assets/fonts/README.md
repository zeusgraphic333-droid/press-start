# Ident fonts (subset)

The Erebus Studios ident only shows a few words (EREBUS · STUDIOS · the credit name · PRESS START · the
percentage), so its two faces are subset to those letters to keep the page light:

```sh
python3 -m fontTools.subset node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2 \
  --text="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,·-–—'’&" \
  --flavor=woff2 --layout-features='kern' --output-file=assets/fonts/archivo-ident.woff2
python3 -m fontTools.subset node_modules/@fontsource/italiana/files/italiana-latin-400-normal.woff2 \
  --text="EREBUSerebus " --flavor=woff2 --layout-features='kern' --output-file=assets/fonts/italiana-ident.woff2
```

Archivo keeps both variation axes (wght 100–900, wdth 62–125%). Licences: SIL Open Font License 1.1 (both).
