
const fs = require("fs");
const path = require("path");

const replacements = [
  { regex: /(?<!dark:)\bbg-slate-900\b/g, replace: "bg-slate-50 dark:bg-slate-900" },
  { regex: /(?<!dark:)\bbg-\[#1e293b\]/g, replace: "bg-white dark:bg-[#1e293b]" },
  { regex: /(?<!dark:)\bbg-\[#0f172a\]/g, replace: "bg-slate-100 dark:bg-[#0f172a]" },
  { regex: /(?<!dark:)\bbg-slate-800\b/g, replace: "bg-slate-100 dark:bg-slate-800" },
  { regex: /(?<!dark:)\bbg-slate-700\b/g, replace: "bg-slate-200 dark:bg-slate-700" },
  { regex: /(?<!dark:)\bbg-slate-800\/50\b/g, replace: "bg-slate-100 dark:bg-slate-800/50" },
  { regex: /(?<!dark:)\bbg-slate-700\/50\b/g, replace: "bg-slate-200 dark:bg-slate-700/50" },
  { regex: /(?<!dark:)\btext-white\b/g, replace: "text-slate-900 dark:text-white" },
  { regex: /(?<!dark:)\btext-slate-100\b/g, replace: "text-slate-800 dark:text-slate-100" },
  { regex: /(?<!dark:)\btext-slate-300\b/g, replace: "text-slate-700 dark:text-slate-300" },
  { regex: /(?<!dark:)\btext-slate-400\b/g, replace: "text-slate-500 dark:text-slate-400" },
  { regex: /(?<!dark:)\border-slate-800\b/g, replace: "border-slate-200 dark:border-slate-800" },
  { regex: /(?<!dark:)\border-slate-700\b/g, replace: "border-slate-300 dark:border-slate-700" },
  { regex: /(?<!dark:)\border-slate-600\b/g, replace: "border-slate-300 dark:border-slate-600" },
  { regex: /(?<!dark:)\border-slate-800\/50\b/g, replace: "border-slate-200 dark:border-slate-800/50" },
  { regex: /(?<!dark:)\border-slate-700\/50\b/g, replace: "border-slate-200 dark:border-slate-700/50" },
  { regex: /(?<!dark:)\bdivide-slate-700\b/g, replace: "divide-slate-200 dark:divide-slate-700" },
  { regex: /(?<!dark:)\bdivide-slate-700\/50\b/g, replace: "divide-slate-200 dark:divide-slate-700/50" }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      let original = content;
      
      replacements.forEach(rule => {
        content = content.replace(rule.regex, rule.replace);
      });
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("Updated: " + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, "src"));
console.log("Done refactoring styles!");

