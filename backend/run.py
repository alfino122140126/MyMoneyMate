from dotenv import load_dotenv
import os

# Load .env ke os.environ
load_dotenv()

# Impor fungsi main() kita yang meng-return WSGI app
from src import main

# Bangun app
app = main({}, **{})

if __name__ == "__main__":
    # Jalankan dengan Gunicorn
    from gunicorn.app.base import BaseApplication
    port = int(os.environ.get("PORT", 6543))
    BaseApplication(app, {"bind": f"0.0.0.0:{port}"}).run()
