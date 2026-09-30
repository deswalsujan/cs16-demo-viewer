"""Builds the single-file viewer from src/.

Usage:  python3 build.py
Writes: index.html          (full page, for GitHub Pages or any static host)
        dist/artifact.html  (same page without the <html>/<head> wrapper, for claude.ai artifacts)
"""
import os

here = os.path.dirname(os.path.abspath(__file__))
src = lambda name: open(os.path.join(here, 'src', name), encoding='utf-8').read()

parser = src('demo.js')
bsp = src('bsp.js').replace('export function', 'function')
view3d = src('view3d.part.js')
# player models and sound live in their own files, placed just before the simple player figures
models = src('stock.js') + '\n' + src('mdl.js') + '\n' + src('players3d.js') + '\n' + src('audio.js') + '\n'
view3d = view3d.replace('/*MODELS*/\n', models)
for name, code in (('demo.js', parser), ('bsp.js', bsp), ('models', models)):
    assert '</script' not in code, name + ' must not contain a closing script tag'

version = open(os.path.join(here, 'VERSION'), encoding='utf-8').read().strip()
page = (src('template.html')
        .replace('__VERSION__', version)
        .replace('/*PARSER*/', parser)
        .replace('/*BSP*/', bsp)
        .replace('/*VIEW3D*/', view3d))

os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
open(os.path.join(here, 'dist', 'artifact.html'), 'w', encoding='utf-8').write(page)

full = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        # Keeps the GitHub Pages test copy out of search results. Remove this line when the viewer
        # moves to sujandeswal.com, where it is fine for it to be indexed.
        '<meta name="robots" content="noindex">\n'
        '<meta name="description" content="Play Counter-Strike 1.6 HLTV demos in your browser: 2D radar, 3D replay, kill timeline and a wallbang finder.">\n'
        '<style>body{margin:0}</style>\n</head>\n<body>\n' + page + '\n</body>\n</html>\n')
open(os.path.join(here, 'index.html'), 'w', encoding='utf-8').write(full)
print('built index.html and dist/artifact.html')
