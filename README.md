# desys — سجلّ الديزاين سستمز الخاص بي

مكان واحد أسجّل فيه كل ديزاين سستم (ألوان، خطوط، أشكال، حركة، قواعد المكوّنات)
بصيغة يقرأها الـ AI مباشرة. بعدها في أي مشروع أكتب اسم السستم وبيمشي عليه.

```
desys/
├── systems/            # كل ديزاين سستم في مجلد باسمه
│   ├── aurora/         #   SaaS هادي — Indigo على Slate
│   ├── ledger/         #   كوربوريت كثيف — أزرق غامق على Zinc
│   └── ember/          #   جريء ولعوب — برتقالي + حدود حبر وظلال حادة
│       ├── DESIGN.md   #   المواصفات التي يتبعها الـ AI (المصدر الوحيد للحقيقة)
│       └── tokens.json #   التوكنز: ألوان 50–950، خطوط، radius، ظلال، z-index، حركة
├── template/           # قالب لإنشاء سستم جديد
├── skills/desys/       # Claude Code skill: /desys <name>
├── bin/ lib/           # CLI بدون أي dependencies
└── install.sh          # يركّب الـ CLI والـ skill ويضيف سطر في ~/.claude/CLAUDE.md
```

## التثبيت (مرة واحدة على جهازك)

```bash
git clone https://github.com/Balck0Hat/desys ~/desys
cd ~/desys && ./install.sh
```

السكربت يعمل ثلاث أشياء: يربط أمر `desys` عالمياً، يضع الـ skill في `~/.claude/skills/desys`،
ويضيف قسماً في `~/.claude/CLAUDE.md` يخبر Claude أن السجلّ موجود وكيف يستخدمه.

## الاستخدام مع الـ AI

داخل أي مشروع في Claude Code:

```
/desys aurora
```

أو بالكلام العادي: «استخدم ديزاين سستم ember» أو «use the ledger design system».
Claude سيقوم بـ:

1. تشغيل `desys use <name>` → ينشئ مجلد `design-system/` في المشروع فيه:
   `DESIGN.md`, `tokens.json`, `tailwind.preset.cjs` (v3), `theme.css`, `tailwind.v4.css` (v4)
2. يضيف قسم `## Design System` في `CLAUDE.md` الخاص بالمشروع (فيبقى ملزِماً في كل جلسة لاحقة).
3. يربط Tailwind حسب نسخته، ثم يقرأ `DESIGN.md` ويبني الواجهات عليه.

## أوامر الـ CLI

```bash
desys list                     # عرض السستمز المتوفرة
desys show aurora              # طباعة مواصفات سستم
desys use aurora ./my-app      # تطبيق سستم على مشروع (--no-claude-md لتجاوز CLAUDE.md)
desys build aurora             # معاينة الملفات المولَّدة بدون كتابة
desys new ocean                # سستم جديد من القالب
desys new ocean --from aurora  # نسخة من سستم موجود لتعديلها
desys path                     # مكان السجلّ (DESYS_HOME)
```

## إنشاء ديزاين سستم جديد

1. `desys new <name>` ثم افتح `systems/<name>/`.
2. في `tokens.json`: استبدل الألوان (سكيل 50–950 لكل من primary/secondary/neutral)، الخطوط، الـ radius، الظلال.
   الأسطح (`surfaces`) تقبل مرجعاً مثل `"neutral.900"` أو hex مباشر، ولها نسختان light و dark بنفس المفاتيح.
3. في `DESIGN.md`: حدّد الشخصية، **العنصر الواحد المميّز**، قواعد الألوان والخطوط والشكل والحركة، ووصفات المكوّنات.
   أبقِه تحت 150 سطراً ومحدّداً؛ الـ AI يتبع ما هو مكتوب حرفياً.
4. `npm test` يتحقق من صلاحية التوكنز. ثم commit + push.

يمكنك أيضاً أن تطلب من Claude: «/desys new ocean» ويساعدك في تعبئة الملفين.

## الـ utilities الدلالية المتاحة في كل سستم

| الغرض | الكلاسات |
|---|---|
| ألوان البراند والحالات | `bg-primary-600` `text-secondary-700` `bg-success-50` … (كل سكيل 50–950، و `bg-primary` = 600) |
| الأسطح | `bg-surface` `bg-surface-muted` `bg-surface-elevated` |
| النصوص | `text-fg` `text-fg-secondary` `text-fg-muted` `text-fg-inverse` |
| الحدود والتركيز | `border-edge` `border-edge-strong` `ring-focus` |
| الشكل والعمق | `rounded-sm…2xl` `shadow-sm/md/lg` |
| الطبقات | `z-dropdown` `z-sticky` `z-drawer` `z-modal` `z-toast` `z-tooltip` |
| الخطوط والحركة | `font-sans` `font-display` `duration-fast` `duration` `duration-slow` `ease-out` `ease-in` |

الدارك مود يعمل عبر كلاس `.dark` أو `data-theme="dark"`، أو تلقائياً من النظام إذا لم يُحدَّد شيء.

## ربط Tailwind يدوياً

**v3** — في `tailwind.config.js`:
```js
module.exports = { presets: [require('./design-system/tailwind.preset.cjs')], content: [/* ... */] };
```
وفي ملف CSS الرئيسي قبل `@tailwind base`: `@import './design-system/theme.css';`

**v4** — بدّل `@import "tailwindcss";` بـ `@import "./design-system/tailwind.v4.css";`

## التطوير

```bash
npm test        # node:test — بدون dependencies
```
