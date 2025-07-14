"""
Setup script for MealMate backend
"""

import os
import subprocess
import sys
from pathlib import Path


def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False


def setup_backend():
    """Setup the backend environment"""
    print("🚀 Setting up MealMate Backend...")
    
    # Check if Python is available
    try:
        python_version = subprocess.run([sys.executable, "--version"], capture_output=True, text=True)
        print(f"✅ Python found: {python_version.stdout.strip()}")
    except Exception as e:
        print(f"❌ Python not found: {e}")
        return False
    
    # Create virtual environment
    if not os.path.exists("venv"):
        if not run_command(f"{sys.executable} -m venv venv", "Creating virtual environment"):
            return False
    else:
        print("✅ Virtual environment already exists")
    
    # Determine activation script
    if os.name == 'nt':  # Windows
        activate_script = "venv\\Scripts\\activate"
        pip_command = "venv\\Scripts\\pip"
        python_command = "venv\\Scripts\\python"
    else:  # Unix/Linux/MacOS
        activate_script = "source venv/bin/activate"
        pip_command = "venv/bin/pip"
        python_command = "venv/bin/python"
    
    # Install dependencies
    if not run_command(f"{pip_command} install --upgrade pip", "Upgrading pip"):
        return False
    
    if not run_command(f"{pip_command} install -r requirements.txt", "Installing dependencies"):
        return False
    
    # Create necessary directories
    directories = ["logs", "uploads"]
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Created directory: {directory}")
    
    # Check if .env file exists
    if not os.path.exists(".env"):
        print("⚠️  .env file not found. Please copy .env.example to .env and configure it.")
    else:
        print("✅ .env file found")
    
    print("\n🎉 Backend setup completed!")
    print("\n📋 Next steps:")
    print("1. Activate virtual environment:")
    if os.name == 'nt':
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("2. Load the dataset:")
    print(f"   {python_command} -m app.scripts.load_dataset")
    print("3. Start the server:")
    print(f"   {python_command} main.py")
    print("   or")
    print(f"   {python_command} -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    
    return True


if __name__ == "__main__":
    setup_backend()
