"""Check this kit's local inline Markdown/HTML links; never fetch remote URLs."""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

REQUIRED = (
    "README.md", "LICENSE", "index.html", "skills/sightcraft/SKILL.md",
    "skills/sightcraft/references/DESIGN-TEMPLATE.md",
    "skills/sightcraft/references/BUILD-PROMPT-TEMPLATE.md",
)
SKIP = {".git", ".superpowers", "dist", "node_modules", "__pycache__"}


class HTMLLinks(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links = []
        self.ids = set()
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in {"href", "src"} and value:
                self.links.append(value)
            if name == "id" and value:
                self.ids.add(value)


def check(root):
    errors = ["Missing required file: " + name for name in REQUIRED if not (root / name).is_file()]
    count = 0
    for source in sorted(root.rglob("*")):
        if not source.is_file() or SKIP.intersection(source.relative_to(root).parts):
            continue
        if source.suffix.lower() not in {".md", ".html"}:
            continue
        text = source.read_text(encoding="utf-8")
        if source.suffix.lower() == ".md":
            text = re.sub(r"(?ms)^```[^\n]*\n.*?^```[^\n]*$|^~~~[^\n]*\n.*?^~~~[^\n]*$", "", text)
            text = re.sub(r"`[^`\n]*`", "", text)
        links = HTMLLinks(text).links
        if source.suffix.lower() == ".md":
            # shortcut: inline links only, use a Markdown parser if reference-style links are introduced.
            links += re.findall(r"!?\[[^\]\n]*\]\(\s*(<[^>]+>|[^)\s]+)(?:\s+[\"'][^)]*)?\)", text)
        for link in links:
            link = link.strip("<>")
            parsed = urlsplit(link)
            if parsed.scheme or parsed.netloc:
                continue
            if not parsed.path:
                target = source
            elif parsed.path.startswith("/"):
                target = (root / unquote(parsed.path).lstrip("/")).resolve()
            else:
                target = (source.parent / unquote(parsed.path)).resolve()
            count += 1
            label = str(source.relative_to(root)) + ": " + link
            try:
                target.relative_to(root)
            except ValueError:
                errors.append("Link outside package: " + label)
                continue
            if not target.exists():
                errors.append("Missing link target: " + label)
            elif parsed.fragment and target.suffix.lower() == ".html":
                if unquote(parsed.fragment) not in HTMLLinks(target.read_text(encoding="utf-8")).ids:
                    errors.append("Missing HTML fragment: " + label)
    return errors, count


def main():
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    if not root.is_dir():
        print("FAIL: package directory does not exist")
        return 1
    errors, count = check(root)
    for error in errors:
        print("FAIL: " + error)
    if not errors:
        print("PASS: required files and {} local links; remote URLs were not fetched.".format(count))
    return int(bool(errors))


if __name__ == "__main__":
    sys.exit(main())
