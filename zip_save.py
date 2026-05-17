import os
import zipfile

# Current folder where script exists
PROJECT_FOLDER = os.getcwd()

# Output zip name
OUTPUT_ZIP = "SEEU-ADMIN-clean.zip"

# Folders to exclude
EXCLUDE_FOLDERS = {
    ".git",
    ".next",
    "node_modules",
    "__pycache__",
    ".idea",
    ".vscode",
    ".pytest_cache",
    ".turbo",
    "dist",
    "build",
    ".vercel"
}

# Files to exclude
EXCLUDE_FILES = {
    ".env",
    ".env.local",
    ".env.production",
    ".DS_Store"
}


def zip_project(project_folder, output_zip):
    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:

        for root, dirs, files in os.walk(project_folder):

            # Skip excluded folders
            dirs[:] = [d for d in dirs if d not in EXCLUDE_FOLDERS]

            for file in files:

                # Skip excluded files
                if file in EXCLUDE_FILES:
                    continue

                # Skip the generated zip itself
                if file == OUTPUT_ZIP:
                    continue

                file_path = os.path.join(root, file)

                # Relative path inside zip
                arcname = os.path.relpath(file_path, project_folder)

                zipf.write(file_path, arcname)

    print(f"\nZIP created successfully: {output_zip}")


zip_project(PROJECT_FOLDER, OUTPUT_ZIP)