#!/bin/bash

# Script to update dashboard theme from light to dark

FILE="app/dashboard/page.tsx"

# Backup the file first
cp "$FILE" "$FILE.backup"

# Main background and surfaces
sed -i '' 's/bg-gradient-to-br from-\[#F8F8F8\] via-white to-\[#F8F8F8\]/bg-[#0B0D12]/g' "$FILE"
sed -i '' 's/bg-white rounded-3xl/bg-[#11141B] rounded-2xl/g' "$FILE"
sed -i '' 's/bg-white rounded-2xl/bg-[#11141B] rounded-2xl/g' "$FILE"
sed -i '' 's/bg-white rounded-xl/bg-[#11141B] rounded-xl/g' "$FILE"

# Specific patterns - gray-900 to dark surface
sed -i '' 's/bg-gray-900 rounded-3xl/bg-[#11141B] rounded-2xl border border-[#1E293B]/g' "$FILE"

# Borders
sed -i '' 's/border-gray-200/border-[#1E293B]/g' "$FILE"
sed -i '' 's/border-2 border-gray-200/border-2 border-[#1E293B]/g' "$FILE"
sed -i '' 's/border-\[#E8E8E8\]/border-[#1E293B]/g' "$FILE"

# Brand colors #A26BFF to #5B8CFF, #8E56EF to #4A7AE8
sed -i '' 's/from-\[#A26BFF\] to-\[#8E56EF\]/from-[#5B8CFF] to-[#4A7AE8]/g' "$FILE"
sed -i '' 's/bg-\[#A26BFF\]/bg-[#5B8CFF]/g' "$FILE"
sed -i '' 's/text-\[#A26BFF\]/text-[#5B8CFF]/g' "$FILE"
sed -i '' 's/border-\[#A26BFF\]/border-[#5B8CFF]/g' "$FILE"
sed -i '' 's/hover:bg-\[#8E56EF\]/hover:bg-[#4A7AE8]/g' "$FILE"
sed -i '' 's/hover:text-\[#8E56EF\]/hover:text-[#4A7AE8]/g' "$FILE"

# Specific brand color in 30% opacity borders
sed -i '' 's/border-\[#A26BFF\]\/30/border-[#1E293B]/g' "$FILE"
sed -i '' 's/border-2 border-\[#A26BFF\]\/30/border-2 border-[#1E293B]/g' "$FILE"

# Text colors
sed -i '' 's/text-\[#111111\]/text-white/g' "$FILE"
sed -i '' 's/text-black/text-white/g' "$FILE"
sed -i '' 's/text-gray-900/text-white/g' "$FILE"
sed -i '' 's/text-\[#8C8C8C\]/text-[#94A3B8]/g' "$FILE"
sed -i '' 's/text-gray-600/text-[#94A3B8]/g' "$FILE"
sed -i '' 's/text-gray-500/text-[#64748B]/g' "$FILE"
sed -i '' 's/text-gray-400/text-[#64748B]/g' "$FILE"
sed -i '' 's/text-gray-700/text-[#94A3B8]/g' "$FILE"

# Border radius updates
sed -i '' 's/rounded-full text-base/rounded-2xl text-base/g' "$FILE"

# Hover backgrounds
sed -i '' 's/hover:bg-gray-50/hover:bg-[#1E293B]/g' "$FILE"
sed -i '' 's/hover:bg-gray-100/hover:bg-[#1E293B]/g' "$FILE"
sed -i '' 's/bg-gray-50/bg-[#1E293B]/g' "$FILE"
sed -i '' 's/bg-gray-100/bg-[#1E293B]/g' "$FILE"

# Input backgrounds
sed -i '' 's/bg-white rounded-2xl/bg-[#0B0D12] rounded-2xl/g' "$FILE"

# Gradient backgrounds - adjust or replace
sed -i '' 's/bg-gradient-to-br from-white to-indigo-50\/30/bg-[#11141B]/g' "$FILE"
sed -i '' 's/bg-gradient-to-br from-white to-blue-50\/30/bg-[#11141B]/g' "$FILE"
sed -i '' 's/bg-gradient-to-br from-white to-green-50\/30/bg-[#11141B]/g' "$FILE"

echo "Theme update complete. Backup saved as $FILE.backup"
