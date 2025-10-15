#!/usr/bin/env python3
import re

# Read the file
with open('app/dashboard/page.tsx', 'r') as f:
    content = f.content()

# Color mappings
replacements = [
    # Backgrounds
    (r'bg-white\b', 'bg-[#11141B]'),
    (r'bg-gray-50\b', 'bg-[#1E293B]'),
    (r'bg-gray-100\b', 'bg-[#1E293B]'),

    # Text colors
    (r'text-gray-900\b', 'text-white'),
    (r'text-gray-800\b', 'text-white'),
    (r'text-gray-700\b', 'text-[#94A3B8]'),
    (r'text-gray-600\b', 'text-[#94A3B8]'),
    (r'text-gray-500\b', 'text-[#64748B]'),
    (r'text-gray-400\b', 'text-[#64748B]'),
    (r'text-\[#111111\]', 'text-white'),
    (r'text-\[#8C8C8C\]', 'text-[#94A3B8]'),
    (r'text-black\b', 'text-white'),

    # Borders
    (r'border-gray-200\b', 'border-[#1E293B]'),
    (r'border-gray-300\b', 'border-[#1E293B]'),
    (r'border-\[#E8E8E8\]', 'border-[#1E293B]'),

    # Brand colors
    (r'from-\[#A26BFF\]', 'from-[#5B8CFF]'),
    (r'to-\[#8E56EF\]', 'to-[#4A7AE8]'),
    (r'bg-\[#A26BFF\]', 'bg-[#5B8CFF]'),
    (r'text-\[#A26BFF\]', 'text-[#5B8CFF]'),
    (r'border-\[#A26BFF\]', 'border-[#5B8CFF]'),
    (r'hover:bg-\[#8E56EF\]', 'hover:bg-[#4A7AE8]'),
    (r'hover:text-\[#8E56EF\]', 'hover:text-[#4A7AE8]'),
    (r'hover:from-\[#8E56EF\]', 'hover:from-[#4A7AE8]'),
    (r'hover:to-\[#7D4FDE\]', 'hover:to-[#4A7AE8]'),
    (r'hover:to-\[#7D45DE\]', 'hover:to-[#4A7AE8]'),

    # Border radius - update rounded-full to rounded-2xl for buttons
    (r'rounded-full text-base', 'rounded-2xl text-base'),
    (r'rounded-full text-lg', 'rounded-2xl text-lg'),
    (r'rounded-full font-bold', 'rounded-2xl font-bold'),
    (r'rounded-3xl', 'rounded-2xl'),

    # Hover states
    (r'hover:bg-gray-50\b', 'hover:bg-[#1E293B]'),
    (r'hover:bg-gray-100\b', 'hover:bg-[#1E293B]'),
    (r'hover:border-gray-300', 'hover:border-[#1E293B]'),
    (r'hover:border-gray-400', 'hover:border-[#1E293B]'),
]

# Apply all replacements
for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content)

# Write back
with open('app/dashboard/page.tsx', 'w') as f:
    f.write(content)

print("Color replacements complete!")
