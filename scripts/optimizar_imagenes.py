#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
============================================================================
OPTIMIZADOR DE IMÁGENES A WEBP
============================================================================
Script: optimizar_imagenes.py
Creador: Jorge O. Tripodi
Descripción: Utilidad para automatizar la compresión y redimensionado de
             imágenes en formato WebP de alto rendimiento.
============================================================================
"""

import os
import sys

def optimizar_imagenes():
    """
    Escanea la carpeta de imágenes y optimiza imágenes PNG, JPG y WebP.
    Aplica compresión WebP y redimensionado inteligente.
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

    excluir = ["favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png"]
    total_original = 0
    total_nuevo = 0

    for filename in os.listdir(dir_imagenes):
        if filename in excluir or filename.endswith(".zip") or filename.endswith(".tmp"):
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
                    max_dim = 1200
                    
                    if filename.startswith(("Tripode2", "Tripodi_heraldica")):
                        max_dim = 600
                    elif filename.startswith(("Imagen_2", "Epicentro")):
                        max_dim = 1400

                    if max(w, h) > max_dim:
                        ratio = max_dim / float(max(w, h))
                        nuevas_dims = (int(w * ratio), int(h * ratio))
                        img = img.resize(nuevas_dims, Image.Resampling.LANCZOS)

                    nombre_base, _ = os.path.splitext(filename)
                    nuevo_filepath = os.path.join(dir_imagenes, f"{nombre_base}.webp")
                    tmp_filepath = nuevo_filepath + ".tmp"
                    
                    img.save(tmp_filepath, "WEBP", quality=75, method=6)
                    tam_nuevo = os.path.getsize(tmp_filepath)
                    
                    if tam_nuevo < tam_orig or ext != ".webp":
                        if os.path.exists(nuevo_filepath) and nuevo_filepath != filepath:
                            os.remove(filepath)
                        os.replace(tmp_filepath, nuevo_filepath)
                        total_nuevo += tam_nuevo
                        ahorro = (1 - (tam_nuevo / tam_orig)) * 100
                        print(f"Optimizado: {filename} -> {os.path.basename(nuevo_filepath)} ({tam_orig//1024}KB -> {tam_nuevo//1024}KB, -{ahorro:.1f}%)")
                    else:
                        os.remove(tmp_filepath)
                        total_nuevo += tam_orig
                        print(f"Conservado original: {filename} ({tam_orig//1024}KB)")

            except Exception as e:
                print(f"Error procesando {filename}: {e}")

    print(f"\nResumen: Original: {total_original//1024} KB -> Nuevo: {total_nuevo//1024} KB")

if __name__ == "__main__":
    optimizar_imagenes()

