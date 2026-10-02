#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
============================================================================
RESTAURACIÓN Y REGENERACIÓN DE IMÁGENES EN ALTA RESOLUCIÓN (FULL HD / 2K)
============================================================================
Script: restaurar_alta_resolucion.py
Creador: Jorge O. Tripodi
Descripción: Extrae los originales sin pérdida desde el historial de Git,
             redimensiona con topes modernos (2560px para separadores,
             2048px para mapas y 1920px para fotos) y recompila en WebP
             con calidad del 85-90% para garantizar máxima nitidez visual.
============================================================================
"""

import os
import subprocess
import io
from PIL import Image

def restaurar_y_optimizar():
    """
    Restaura las imágenes originales de alta resolución desde Git
    y genera versiones WebP de alta fidelidad y miniaturas.
    """
    directorio_base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dir_imagenes = os.path.join(directorio_base, "imagenes")
    dir_thumbs = os.path.join(dir_imagenes, "thumbs")
    os.makedirs(dir_thumbs, exist_ok=True)

    print("Extrayendo lista de objetos originales desde Git commit 0282764...")
    arbol_git = subprocess.check_output(
        ['git', 'ls-tree', '-r', '0282764', 'imagenes'],
        stderr=subprocess.STDOUT
    )

    lineas = arbol_git.decode('utf-8', errors='replace').splitlines()
    imagenes_a_restaurar = []

    for linea in lineas:
        partes = linea.split('\t')
        if len(partes) != 2:
            continue
        meta, ruta = partes[0].split(), partes[1].strip('"')
        hash_blob = meta[2]

        # Filtrar solo imágenes principales (excluir favicon y apple-touch-icon)
        ruta_min = ruta.lower()
        if (ruta_min.endswith(('.png', '.jpg', '.jpeg')) and 
            'favicon' not in ruta_min and 'apple' not in ruta_min):
            nombre_archivo = os.path.basename(ruta)
            # Manejo del nombre con caracteres especiales si viniese escapado
            if 'Migraci' in nombre_archivo:
                nombre_archivo = 'Migración_grecia_italia.png'
            imagenes_a_restaurar.append((hash_blob, nombre_archivo))

    print(f"Total de imágenes originales a procesar: {len(imagenes_a_restaurar)}")

    for hash_blob, nombre_archivo in imagenes_a_restaurar:
        nombre_base, _ = os.path.splitext(nombre_archivo)
        print(f"\nProcesando: {nombre_archivo} ({hash_blob[:7]})...")

        # Extraer bytes desde Git cat-file
        datos_blob = subprocess.check_output(['git', 'cat-file', '-p', hash_blob])
        tam_original_kb = len(datos_blob) // 1024

        with Image.open(io.BytesIO(datos_blob)) as img:
            ancho_orig, alto_orig = img.size
            print(f"  Resolución original: {ancho_orig}x{alto_orig} px ({tam_original_kb} KB)")

            # Definir dimensiones y calidad según el tipo de elemento visual
            if nombre_base in ("Imagen_2", "Imagen_3", "Imagen_4"):
                # Banners panorámicos y separadores de sección (ancho completo)
                tope_max = 2560
                calidad_webp = 88
            elif nombre_base in ("Diaspora_italiana", "Epicentro_calabres_y_su_irradiacion",
                                "Migración_grecia_italia", "Reconquista_calabria_y_sicilia_imperio_bizantino",
                                "tripodi_mundo", "Hesiodo_gana_tripode"):
                # Mapas históricos, infografías y diagramas con textos
                tope_max = 2560
                calidad_webp = 88
            elif nombre_base.startswith("Tripodi_heraldica"):
                # Escudos heráldicos familiares
                tope_max = 1024
                calidad_webp = 90
            elif nombre_base == "Tripode2":
                # Imagen destacada de portada (Hero)
                tope_max = 1400
                calidad_webp = 88
            else:
                # Fotografías arqueológicas y piezas de museo para Lightbox
                tope_max = 2048
                calidad_webp = 86

            # Redimensionar solo si excede el tope configurado
            dim_maxima = max(ancho_orig, alto_orig)
            if dim_maxima > tope_max:
                factor = tope_max / float(dim_maxima)
                nuevas_dims = (int(ancho_orig * factor), int(alto_orig * factor))
                img_hd = img.resize(nuevas_dims, Image.Resampling.LANCZOS)
            else:
                img_hd = img.copy()

            # Guardar versión WebP de alta definición
            ruta_hd = os.path.join(dir_imagenes, f"{nombre_base}.webp")
            # Preservar canal alfa (transparencia) si existe
            if img_hd.mode in ('RGBA', 'LA') or (img_hd.mode == 'P' and 'transparency' in img_hd.info):
                img_hd.save(ruta_hd, "WEBP", quality=calidad_webp, method=6)
            else:
                img_hd_rgb = img_hd.convert('RGB')
                img_hd_rgb.save(ruta_hd, "WEBP", quality=calidad_webp, method=6)

            tam_hd_kb = os.path.getsize(ruta_hd) // 1024
            ancho_final, alto_final = img_hd.size
            print(f"  -> HD WebP: {ancho_final}x{alto_final} px ({tam_hd_kb} KB)")

            # Generar miniatura optimizada en thumbs (400px de tope para buena nitidez)
            tope_thumb = 400
            if dim_maxima > tope_thumb:
                factor_t = tope_thumb / float(dim_maxima)
                dims_thumb = (int(ancho_orig * factor_t), int(alto_orig * factor_t))
                img_thumb = img.resize(dims_thumb, Image.Resampling.LANCZOS)
            else:
                img_thumb = img.copy()

            ruta_thumb = os.path.join(dir_thumbs, f"{nombre_base}.webp")
            if img_thumb.mode in ('RGBA', 'LA') or (img_thumb.mode == 'P' and 'transparency' in img_thumb.info):
                img_thumb.save(ruta_thumb, "WEBP", quality=80, method=5)
            else:
                img_thumb_rgb = img_thumb.convert('RGB')
                img_thumb_rgb.save(ruta_thumb, "WEBP", quality=80, method=5)

            tam_thumb_kb = os.path.getsize(ruta_thumb) // 1024
            print(f"  -> Miniatura: {img_thumb.size[0]}x{img_thumb.size[1]} px ({tam_thumb_kb} KB)")

    print("\n¡Restauración y regeneración de alta fidelidad completada exitosamente!")

if __name__ == "__main__":
    restaurar_y_optimizar()
