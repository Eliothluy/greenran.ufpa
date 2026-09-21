/**
 * GreenRAN Tailwind build config.
 * Design tokens live in css/styles.css (:root custom properties); this config
 * mirrors those values for utility generation only.
 * Rebuild: npx tailwindcss@3.4.17 -c tailwind.config.js -i src/input.css -o css/tailwind.css --minify
 */
module.exports = {
    content: ['./index.html'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#1E40AF',
                secondary: '#3B82F6',
                dark: '#0F172A',
                muted: '#6B7280',
            },
            maxWidth: {
                site: '1200px',
            },
            borderRadius: {
                card: '12px',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
