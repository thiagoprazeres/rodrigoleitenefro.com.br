import ssl, certifi, sys, pathlib, whisper

ssl._create_default_https_context = lambda: ssl.create_default_context(cafile=certifi.where())

model = whisper.load_model("small")
out_dir = pathlib.Path("insumos/transcricoes")
out_dir.mkdir(parents=True, exist_ok=True)

arquivos = list(pathlib.Path("insumos/whatsapp-projeto-site").glob("*.opus"))
for arq in sorted(arquivos):
    print(f"\n→ Transcrevendo {arq.name}...")
    result = model.transcribe(str(arq), language="pt")
    saida = out_dir / (arq.stem + ".txt")
    saida.write_text(result["text"].strip(), encoding="utf-8")
    print(f"✓ {saida}")
    print(result["text"].strip())
