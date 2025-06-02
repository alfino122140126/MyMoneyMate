from pyramid.paster import get_app, setup_logging
from waitress import serve
import os

if __name__ == '__main__':
    config_uri = os.environ.get('PYRAMID_CONFIG', 'development.ini')
    setup_logging(config_uri)
    app = get_app(config_uri)
    # Pastikan host 0.0.0.0 agar bisa diakses dari luar container
    serve(app, host='0.0.0.0', port=6543)