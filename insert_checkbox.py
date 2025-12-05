import sys

# Ler o arquivo
with open('src/app/publicar/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Ler o snippet
with open('fipe_checkbox_snippet.txt', 'r', encoding='utf-8') as f:
    snippet = f.read()

# Encontrar a linha onde inserir (após a descrição, linha ~350)
new_lines = []
inserted = False
for i, line in enumerate(lines):
    new_lines.append(line)
    # Procurar pela linha que fecha o div da descrição e está antes de </section>
    if not inserted and i > 340 and '</div>' in line and i < 360:
        # Verificar se a próxima linha não vazia é </section>
        next_non_empty = None
        for j in range(i+1, min(i+5, len(lines))):
            if lines[j].strip():
                next_non_empty = lines[j].strip()
                break
        if next_non_empty and '</section>' in next_non_empty:
            new_lines.append(snippet)
            inserted = True

# Salvar o arquivo
with open('src/app/publicar/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Checkbox FIPE adicionado com sucesso!")
