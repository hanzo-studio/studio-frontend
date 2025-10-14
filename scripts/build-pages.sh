#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
DIST="./docs/pages"

# Build or reuse Storybook
echo "[build-pages] Setting up Storybook"
rm -rf "$DIST/storybook"
if [ -d "./storybook-static" ] && [ "$(find ./storybook-static -name '*.html' | wc -l)" -gt 0 ]; then
  echo "✅ Reusing downloaded Storybook build"
  cp -r "./storybook-static" "$DIST/storybook"
elsew
  echo "🔨 Building Storybook from source"
  pnpm build-storybook && cp -r "storybook-static" "$DIST/storybook"
fi

echo "[build-pages] Generating Nx dependency graph"
rm -rf "$DIST/nx-graph" && mkdir -p "$DIST/nx-graph"
pnpm nx graph --file="$DIST/nx-graph/index.html"

# Generate or reuse Vitest test reports
echo "[build-pages] Setting up Vitest test reports"
rm -rf "$DIST/vitest-ui" && mkdir -p "$DIST/vitest-ui"
if [ -d "./.gh-pages-cache/vitest-reports" ]; then
  echo "✅ Reusing downloaded Vitest reports"
  cp -r "./.gh-pages-cache/vitest-reports/"* "$DIST/vitest-ui/" 2>/dev/null || echo "⚠️  No vitest reports to copy"
else
  echo "🔨 Generating Vitest reports from source"
  pnpm exec vitest \
    --reporter=json --outputFile.json="$DIST/vitest-ui/results.json" \
    --reporter=html --outputFile.html="$DIST/vitest-ui/index.html" \
    --run
fi

# Set up Playwright test reports if available
echo "[build-pages] Setting up Playwright test reports"
if [ -d "./.gh-pages-cache/playwright-reports" ]; then
  echo "✅ Reusing downloaded Playwright reports"
  mkdir -p "$DIST/playwright-reports"
  cp -r "./.gh-pages-cache/playwright-reports/"* "$DIST/playwright-reports/" 2>/dev/null || echo "⚠️  No playwright reports to copy"
fi

echo "[build-pages] Generating coverage report"
mkdir -p "$DIST/coverage"
if pnpm exec vitest --run --coverage --coverage.reporter=html --coverage.reportsDirectory="$DIST/coverage"; then
  echo "✅ Coverage report completed"
else
  echo "⚠️  Coverage report failed, continuing..."
fi

echo "[build-pages] Generating Knip report"
mkdir -p "$DIST/knip"
rm -f "$DIST/knip/report.md"
if pnpm knip --reporter markdown --no-progress --no-exit-code > "$DIST/knip/report.md" 2>/dev/null && [ -s "$DIST/knip/report.md" ]; then
  echo "✅ Knip report generated at $DIST/knip/report.md"
else
  echo "⚠️  Knip report failed, creating placeholder..."
  cat > "$DIST/knip/report.md" <<'EOF'
# Knip report

> ⚠️ Knip report unavailable.
>
> Generation failed during build. See CI logs for details.
EOF
fi

if cp "${ROOT_DIR}/docs/pages/knip/index.html" "$DIST/knip/index.html" 2>/dev/null; then
  echo "✅ Knip HTML wrapper completed"
else
  echo "⚠️  Knip HTML wrapper missing, continuing..."
fi

echo "[build-pages] Landing page already exists at $DIST/index.html"

echo "[build-pages] Build artifacts ready in $DIST"

echo "[build-pages] Note: For local dev, you can develop the docs/pages/index.html using:
  pnpm exec vite ${DIST}
"
