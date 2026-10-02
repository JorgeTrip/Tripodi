#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
============================================================================
OPTIMIZADOR DE IMÁGENES A WEBP (ALTA FIDELIDAD Y RENDIMIENTO)
============================================================================
Script: optimizar_imagenes.py
Creador: Jorge O. Tripodi
Descripción: Utilidad para automatizar la compresión y redimensionado de
             imágenes en formato WebP de alto rendimiento, manteniendo
             resolución Full HD / 2K para visualización nítida en pantallas
             modernas y visores lightbox.
============================================================================
"""

import os
import sys

def optimizar_imagenes():
    """
    Escanea la carpeta de imágenes y optimiza imágenes PNG, JPG y WebP.
    Aplica compresión WebP de alta fidelidad y genera miniaturas para galería.
    """
    directorio_base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dir_imagenes = os.path.join(directorio_base, "imagenes")
    
    print(f"Buscando imágenes en: {dir_imagenes}")
    if not os.path.exists(dir_imagenes):
        print("Error: No se encontró la carpeta 'imagenes'.")
        return
        
    try:
        from PIL import Image
    except ImportError:
        print("La biblioteca 'Pillow' no está instalada.")
        import subprocess
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
            from PIL import Image
        except Exception as e:
            print(f"Error al instalar Pillow: {e}")
            return

    dir_thumbs = os.path.join(dir_imagenes, "thumbs")
    os.makedirs(dir_thumbs, exist_ok=True)

    excluir = ["favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png"]
    total_original = 0
    total_nuevo = 0

    for filename in sorted(os.listdir(dir_imagenes)):
        if filename in excluir or filename.endswith((".zip", ".tmp", ".afphoto")):
            continue
            
        filepath = os.path.join(dir_imagenes, filename)
        if not os.path.isfile(filepath):
            continue

        ext = filename.lower()
        if ext.endswith((".png", ".jpg", ".jpeg", ".webp")):
            try:
                tam_orig = os.path.getsize(filepath)
                total_original += tam_orig
                
                with Image.open(filepath) as img:
                    w, h = img.size
                    nombre_base, _ = os.path.splitext(filename)

                    # Topes de dimensión según el rol visual del recurso
                    if nombre_base in ("Imagen_2", "Imagen_3", "Imagen_4",
                                       "Diaspora_italiana", "Epicentro_calabres_y_su_irradiacion",
                                       "tripodi_mundo", "Hesiodo_gana_tripode"):
                        tope_max = 2560
                        qual = 88
                    elif nombre_base.startswith("Tripodi_heraldica"):
                        tope_max = 1024
                        qual = 90
                    elif nombre_base == "Tripode2":
                        tope_max = 1400
                        qual = 88
                    else:
                        tope_max = 2048
                        qual = 86

                    if max(w, h) > tope_max:
                        ratio = tope_max / float(max(w, h))
                        nuevas_dims = (int(w * ratio), int(h * ratio))
                        img_hd = img.resize(nuevas_dims, Image.Resampling.LANCZOS)
                    else:
                        img_hd = img.copy()

                    nuevo_filepath = os.path.join(dir_imagenes, f"{nombre_base}.webp")
                    tmp_filepath = nuevo_filepath + ".tmp"
                    
                    if img_hd.mode in ('RGBA', 'LA') or (img_hd.mode == 'P' and 'transparency' in img_hd.info):
                        img_hd.save(tmp_filepath, "WEBP", quality=qual, method=6)
                    else:
                        img_hd.convert('RGB').save(tmp_filepath, "WEBP", quality=qual, method=6)

                    tam_nuevo = os.path.getsize(tmp_filepath)
                    if tam_nuevo < tam_orig or ext != ".webp":
                        if os.path.exists(nuevo_filepath) and nuevo_filepath != filepath:
                            os.remove(filepath)
                        os.replace(tmp_filepath, nuevo_filepath)
                        total_nuevo += tam_nuevo
                        print(f"Optimizado: {filename} -> {os.path.basename(nuevo_filepath)} ({tam_orig//1024}KB -> {tam_nuevo//1024}KB)")
                    else:
                        os.remove(tmp_filepath)
                        total_nuevo += tam_orig

                    # Generar miniatura en thumbs (400px para nitidez en pantallas Retina móviles)
                    thumb_filepath = os.path.join(dir_thumbs, f"{nombre_base}.webp")
                    if max(w, h) > 400:
                        ratio_thumb = 400 / float(max(w, h))
                        dims_thumb = (int(w * ratio_thumb), int(h * ratio_thumb))
                        img_thumb = img.resize(dims_thumb, Image.Resampling.LANCZOS)
                    else:
                        img_thumb = img.copy()

                    if img_thumb.mode in ('RGBA', 'LA') or (img_thumb.mode == 'P' and 'transparency' in img_thumb.info):
                        img_thumb.save(thumb_filepath, "WEBP", quality=80, method=5)
                    else:
                        img_thumb.convert('RGB').save(thumb_filepath, "WEBP", quality=80, method=5)

            except Exception as e:
                print(f"Error procesando {filename}: {e}")

    print(f"\nResumen: Original: {total_original//1024} KB -> Nuevo: {total_nuevo//1024} KB")

if __name__ == "__main__":
    optimizar_imagenes()
