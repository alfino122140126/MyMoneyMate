from setuptools import setup, find_packages

requires = [
    'pyramid',
    'pyramid_jinja2',
    'pyramid_debugtoolbar',
    'pyramid_tm',
    'SQLAlchemy',
    'transaction',
    'zope.sqlalchemy',
    'waitress',
    'bcrypt',
    'PyJWT',
    'marshmallow',
    'webtest',
    'pytest',
    'pytest-cov',
    'cornice',
]

setup(
    name='myapp',
    version='0.0',
    description='Financial Management Backend',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='',
    author_email='',
    url='',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = myapp:main',
        ],
        'console_scripts': [
            'initialize_db = myapp.scripts.initialize_db:main',
        ],
    },
)