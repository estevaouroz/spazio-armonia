"""Recalcula o hash do <script> inline do public/index.html e atualiza a
Content-Security-Policy no netlify.toml. Rodar sempre que esse script mudar:

    python3 scripts/csp-hash.py
"""
import base64, hashlib, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'public/index.html').read_text(encoding='utf-8')
toml_path = root / 'netlify.toml'

inline = re.search(r'<script>(.*?)</script>', html, re.S).group(1)
digest = 'sha256-' + base64.b64encode(hashlib.sha256(inline.encode('utf-8')).digest()).decode()

toml = toml_path.read_text(encoding='utf-8')
updated = re.sub(r"'sha256-[A-Za-z0-9+/=]+'", f"'{digest}'", toml)
toml_path.write_text(updated, encoding='utf-8')
print(digest, '(já estava certo)' if updated == toml else '→ netlify.toml atualizado')
