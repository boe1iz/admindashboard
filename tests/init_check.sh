#!/bin/bash

FILES=("package.json" "postcss.config.mjs" "next.config.ts" "app/layout.tsx" "app/page.tsx")
MISSING=0

for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Missing: $file"
        MISSING=1
    fi
done

if [ $MISSING -eq 1 ]; then
    echo "Initialization check failed."
    exit 1
else
    echo "Initialization check passed."
    exit 0
fi
