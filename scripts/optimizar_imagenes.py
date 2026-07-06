import os
import sys

def optimizar_imagenes():
    # Ruta del directorio de imágenes
    directorio_base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dir_imagenes = os.path.join(directorio_base, "imagenes")
    
    print(f"Directorio de imágenes: {dir_imagenes}")
    if not os.path.exists(dir_imagenes):
        print("Error: No se encontró la carpeta 'imagenes'")
        return
        
    try:
        from PIL import Image
    except ImportError:
        print("La biblioteca 'Pillow' no está instalada. Intentando instalar...")
        import subprocess
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
            from PIL import Image
            print("Pillow instalada correctamente.")
        except Exception as e:
            print(f"No se pudo instalar Pillow automáticamente: {e}")
            print("Por favor, ejecuta 'pip install Pillow' manualmente y vuelve a correr el script.")
            return

    # Lista de archivos a omitir (favicons y similares)
    excluir = ["favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png"]

    # Extensiones a procesar
    extensiones_compatibles = (".png", ".jpg", ".jpeg")
    
    for filename in os.listdir(dir_imagenes):
        if filename in excluir:
            print(f"Omitiendo (excluido): {filename}")
            continue
            
        filepath = os.path.join(dir_imagenes, filename)
        
        # Procesar solo archivos con extensiones compatibles
        if os.path.isfile(filepath) and filename.lower().endswith(extensiones_compatibles):
            nombre_sin_ext, ext = os.path.splitext(filename)
            nuevo_filename = f"{nombre_sin_ext}.webp"
            nuevo_filepath = os.path.join(dir_imagenes, nuevo_filename)
            
            try:
                tamano_original = os.path.getsize(filepath)
                print(f"Procesando: {filename} ({tamano_original / 1024 / 1024:.2f} MB)...")
                
                with Image.open(filepath) as img:
                    # Guardamos como WebP
                    img.save(nuevo_filepath, "WEBP", quality=80, method=6)
                    
                tamano_nuevo = os.path.getsize(nuevo_filepath)
                ahorro = (1 - (tamano_nuevo / tamano_original)) * 100
                print(f"  -> Creado: {nuevo_filename} ({tamano_nuevo / 1024 / 1024:.2f} MB) - Ahorro: {ahorro:.1f}%")
                
            except Exception as e:
                print(f"  Error procesando {filename}: {e}")

if __name__ == "__main__":
    optimizar_imagenes()
