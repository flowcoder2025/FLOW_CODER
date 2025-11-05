import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**",
      "prisma/migrations/**",
    ],
  },
  {
    rules: {
      // Critical Issues가 수정되었으므로, 기존 코드의 any는 점진적으로 수정
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
