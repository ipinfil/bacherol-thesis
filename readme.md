# Klasifikácia obrázkov ovocia a zeleniny

V momentálnom stave aplikácia funguje prostredníctvom FastAPI serveru, pomocou ktorého je možné vykonávať klasifikáciu obrázkov, ktoré sa nachádzajú v tele POST requestu.

## Inštalácia
- tvorba a aktivácia virtuálneho prostredia `python3 -m venv venv`, `source venv/bin/activate`
- inštalácia knižníc `pip install -r requirements.txt`
- spustenie FastAPI serveru `uvicorn api.server:app`

## Používanie
Na klasifikáciu obrázkov pomocou modelu je potrebné posielať POST requesty na `/predict` adresu serveru s telom, ktorého kľúč `file` obsahuje obrázok na klasifikáciu. Z odpovede vieme prečítať percentuálnu distribúciu k jednotlivým triedam.