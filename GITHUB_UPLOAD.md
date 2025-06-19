# Jak nahrát AI Text Assistant na GitHub

## Krok 1: Vytvořte nový repozitář na GitHub

1. Přejděte na https://github.com
2. Klikněte na "New repository" (zelené tlačítko)
3. Vyplňte:
   - Repository name: `ai-text-assistant-zav-cz`
   - Description: `AI-powered browser extension for automatic Czech typing exercises on zav.cz`
   - Zvolte "Public" nebo "Private" podle preference
   - NEZAŠKRTÁVEJTE "Add a README file" (už máme vlastní)
4. Klikněte "Create repository"

## Krok 2: Nastavte Git v terminálu

Otevřete terminál/příkazovou řádku ve složce s projektem a spusťte:

```bash
# Inicializace Git repozitáře
git init

# Přidání všech souborů
git add .

# První commit
git commit -m "Initial commit: AI Text Assistant for zav.cz typing exercises"

# Přidání vzdáleného repozitáře (nahraďte YOUR_USERNAME svým GitHub jménem)
git remote add origin https://github.com/YOUR_USERNAME/ai-text-assistant-zav-cz.git

# Nahrání na GitHub
git push -u origin main
```

## Krok 3: Ověření

Po nahrání navštivte váš GitHub repozitář a zkontrolujte, že všechny soubory jsou tam.

## Struktura projektu, která se nahraje:

```
ai-text-assistant-zav-cz/
├── client/                 # React frontend aplikace
├── server/                 # Express backend server
├── extension/              # Browser extension soubory
├── shared/                 # Sdílené typy a schéma
├── README.md              # Dokumentace projektu
├── INSTALLATION.md        # Návod k instalaci
├── package.json           # Node.js dependencies
├── drizzle.config.ts      # Databázová konfigurace
└── .gitignore            # Soubory k ignorování

```

## Důležité poznámky:

- **API klíče se nenahrají** (jsou v .gitignore)
- **node_modules se nenahrají** (příliš velké)
- **Databázové soubory se nenahrají** (citlivá data)

## Pokud máte problém s autentizací:

Možná budete muset nastavit vaše GitHub přihlašovací údaje:

```bash
git config --global user.name "Vaše Jméno"
git config --global user.email "vas@email.com"
```

Nebo použít Personal Access Token místo hesla.

## Po nahrání můžete:

1. **Sdílet projekt** s ostatními
2. **Spolupracovat** na vývoji
3. **Sledovat změny** a verze
4. **Použít GitHub Pages** pro dokumentaci
5. **Přidat Issues** pro bug reporty a feature requesty