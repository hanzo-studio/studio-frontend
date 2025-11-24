import os
from setuptools import setup, find_packages

setup(
    name="hanzo-studio-frontend",
    version=os.getenv("STUDIO_FRONTEND_VERSION") or "1.30.6",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[],
    python_requires=">=3.9",
    description="Hanzo Studio Web Frontend",
    author="Hanzo AI",
    author_email="dev@hanzo.ai",
    url="https://github.com/hanzoai/studio-frontend",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
)
