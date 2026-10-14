"""Breaks caught: missing artifacts and links that stop working after extraction."""
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "check_repo.py"


class PackageCheckTests(unittest.TestCase):
    def run_check(self, files):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            base = {
                "README.md": "# Example\n[Demo](index.html)",
                "LICENSE": "MIT License",
                "index.html": '<html lang="th"><main id="main">Example</main></html>',
                "skills/sightcraft/SKILL.md": "---\nname: sightcraft\ndescription: Screenshot to design\n---\nInstructions",
                "skills/sightcraft/references/DESIGN-TEMPLATE.md": "# Design",
                "skills/sightcraft/references/BUILD-PROMPT-TEMPLATE.md": "# Build",
            }
            base.update(files)
            for name, content in base.items():
                target = root / name
                target.parent.mkdir(parents=True, exist_ok=True)
                if content is not None:
                    target.write_text(content, encoding="utf-8")
            return subprocess.run([sys.executable, str(SCRIPT), str(root)], text=True, capture_output=True)

    def test_intact_package_passes(self):
        result = self.run_check({})
        self.assertEqual(result.returncode, 0, result.stderr + result.stdout)

    def test_missing_required_file_fails(self):
        result = self.run_check({"LICENSE": None})
        self.assertEqual(result.returncode, 1)
        self.assertIn("LICENSE", result.stdout)

    def test_broken_markdown_link_fails(self):
        result = self.run_check({"README.md": "[Missing](absent.md)"})
        self.assertEqual(result.returncode, 1)
        self.assertIn("absent.md", result.stdout)

    def test_broken_html_image_fails(self):
        result = self.run_check({"index.html": '<img src="lost.png" alt="Lost">'})
        self.assertEqual(result.returncode, 1)
        self.assertIn("lost.png", result.stdout)

    def test_encoded_thai_filename_passes(self):
        result = self.run_check({"README.md": "[Demo](%E0%B9%84%E0%B8%97%E0%B8%A2%20demo.md)", "ไทย demo.md": "# Demo"})
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_external_and_code_example_links_are_not_fetched(self):
        result = self.run_check({"README.md": "[Remote](https://example.invalid/file)\n```md\n[Template](not-a-real-file.md)\n```\n`[Example](also-absent.md)`"})
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_html_fragment_is_validated(self):
        result = self.run_check({"README.md": "[Missing section](index.html#absent)"})
        self.assertEqual(result.returncode, 1)
        self.assertIn("absent", result.stdout)
        result = self.run_check({"README.md": "[Main](index.html#main)"})
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_paths_outside_package_fail(self):
        result = self.run_check({"README.md": "[Outside](../secret.md)"})
        self.assertEqual(result.returncode, 1)
        self.assertIn("outside", result.stdout.lower())


if __name__ == "__main__":
    unittest.main()
