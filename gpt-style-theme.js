/**
 * A ChatGPT-Inspired Theme for TypingMind
 *
 * This script themes the TypingMind interface to be visually similar to the
 * classic ChatGPT style. It's designed for users who prefer that familiar,
 * clean aesthetic, adjusting fonts, colors, and layout for a more
 * comfortable user experience.
 * * Supports both light and dark modes - automatically follows TypingMind's theme setting.
 */
(function () {
    'use strict';

    /**
     * ----------------------------
     * 1) Configuration & Selectors
     * ----------------------------
     */
    const CONFIG = {
        colors: {
            light: {
                background: '#F9F9F9',
                text: '#000',
                border: '#ccc',
                input: { background: '#f4f4f4', text: 'rgb(13, 13, 13)', placeholder: 'rgb(142, 142, 142)' },
                button: { primary: 'rgb(13, 13, 13)', hover: 'rgba(13, 13, 13, 0.8)' },
                thought: { text: '#0066CC' },
                inlineCode: { background: '#e8e8e8', border: '#ddd', text: '#111' },
                sidebar: { text: 'rgb(13, 13, 13)', heading: 'rgb(143, 143, 143)', hover: '#E3E3E3', searchBg: '#fff', searchPlaceholder: 'rgba(0,0,0,0.6)' },
                codeBlock: { headerBg: '#F9F9F9' },
                scrollbar: { track: '#f1f1f1', thumb: '#c1c1c1', thumbHover: '#a1a1a1' },
                menu: { background: 'white', text: 'black' },
                hoverOverlay: 'rgba(0,0,0,0.1)'
            },
            dark: {
                background: '#212121',
                text: '#ececec',
                border: '#444',
                input: { background: '#303030', text: '#ececec', placeholder: 'rgba(255,255,255,0.5)' },
                button: { primary: '#ececec', hover: 'rgba(236, 236, 236, 0.8)' },
                thought: { text: '#6cb6ff' },
                inlineCode: { background: '#2f2f2f', border: '#444', text: '#ececec' },
                sidebar: { text: '#ececec', heading: 'rgb(143, 143, 143)', hover: '#2f2f2f', searchBg: '#303030', searchPlaceholder: 'rgba(255,255,255,0.5)' },
                codeBlock: { headerBg: '#2f2f2f' },
                scrollbar: { track: '#2f2f2f', thumb: '#555', thumbHover: '#666' },
                menu: { background: '#2f2f2f', text: '#ececec' },
                hoverOverlay: 'rgba(255,255,255,0.1)'
            }
        },
        fonts: { primary: 'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"', code: 'ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace', weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700 }, thought: { size: '12px', lineHeight: '20px', weight: 400 }, sidebar: { size: '14px', lineHeight: '20px', weight: 400, family: 'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"' } },
        spacing: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
        borderRadius: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
    };
    const SELECTORS = {
        CODE_BLOCKS: 'pre code',
        CODE_BLOCK_CONTAINER: 'pre:has(> div.relative):not(details pre)',
        RESULT_BLOCKS: 'details pre',
        USER_MESSAGE_BLOCK: 'div[data-element-id="user-message"]',
        CHAT_SPACE: '[data-element-id="chat-space-middle-part"]',
        AI_RESPONSE_BLOCK: '[data-element-id="ai-response"]',
        THOUGHT_DETAILS_SPECIFIC: 'details:has(summary span:first-child span)',
        THOUGHT_SUMMARY_TEXT_SPAN: 'summary span:first-child span',
        AI_RESPONSE_CONTENT_NODES: `${'[data-element-id="ai-response"]'} > *:not(details):not([data-element-id="additional-actions-of-response-container"])`,
        SIDEBAR: { WORKSPACE: '[data-element-id="workspace-bar"]', BACKGROUND: '[data-element-id="side-bar-background"]', BEGINNING: '[data-element-id="sidebar-beginning-part"]', MIDDLE: '[data-element-id="sidebar-middle-part"]', SEARCH: '[data-element-id="search-chats-bar"]', NEW_CHAT: '[data-element-id="new-chat-button-in-side-bar"]' }
    };

    /**
     * ----------------------------
     * 2) Utility Functions
     * ----------------------------
     */
    const Utils = {
        debounce(fn, delay) { let timeout; return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => fn(...args), delay); }; },
        safe(fn, context = 'unknown') { try { return fn(); } catch (e) { console.error(`Error in ${context}:`, e); return null; } },
        escapeHtml(str) { if (typeof str !== 'string') return ''; return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
    };

    /**
     * ----------------------------
     * 3) Sidebar Styling & Behavior
     * ----------------------------
     */
    function applySidebarStyles() {
        if (document.getElementById('typingmindSidebarFixMerged')) return;
        const sidebarStyle = document.createElement('style'); sidebarStyle.id = 'typingmindSidebarFixMerged'; sidebarStyle.type = 'text/css';
        const light = CONFIG.colors.light;
        const dark = CONFIG.colors.dark;
        
        // Generate styles for both light and dark modes
        const generateSidebarStyles = (colors, prefix) => [
            `${prefix} ${SELECTORS.SIDEBAR.WORKSPACE}, ${prefix} ${SELECTORS.SIDEBAR.BACKGROUND}, ${prefix} ${SELECTORS.SIDEBAR.BEGINNING}, ${prefix} ${SELECTORS.SIDEBAR.MIDDLE} { background-color: ${colors.background} !important; }`,
            `${prefix} ${SELECTORS.SIDEBAR.NEW_CHAT} { background-color: ${colors.sidebar.hover} !important; color: ${colors.text} !important; font-weight: ${CONFIG.fonts.weights.semibold} !important; }`,
            `${prefix} ${SELECTORS.SIDEBAR.NEW_CHAT} * { color: ${colors.text} !important; }`,
            `${prefix} ${SELECTORS.SIDEBAR.SEARCH} { background-color: ${colors.sidebar.searchBg} !important; color: ${colors.text} !important; border: 1px solid ${colors.border} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; }`,
            `${prefix} ${SELECTORS.SIDEBAR.SEARCH}[placeholder]::placeholder, ${prefix} ${SELECTORS.SIDEBAR.SEARCH}::-webkit-input-placeholder, ${prefix} ${SELECTORS.SIDEBAR.SEARCH}::-moz-placeholder, ${prefix} ${SELECTORS.SIDEBAR.SEARCH}:-ms-input-placeholder { color: ${colors.sidebar.searchPlaceholder} !important; opacity: 1 !important; -webkit-text-fill-color: ${colors.sidebar.searchPlaceholder} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; }`,
            `${prefix} ${SELECTORS.SIDEBAR.WORKSPACE} *:not(svg):not(path)[class*="text-white"], ${prefix} ${SELECTORS.SIDEBAR.WORKSPACE} *:not(svg):not(path)[class*="text-white/"], ${prefix} ${SELECTORS.SIDEBAR.WORKSPACE} *:not(svg):not(path)[class*="text-gray-"], ${prefix} ${SELECTORS.SIDEBAR.WORKSPACE} *:not(svg):not(path)[class*="dark:text-white"], ${prefix} ${SELECTORS.SIDEBAR.BACKGROUND} *:not(svg):not(path)[class*="text-white"], ${prefix} ${SELECTORS.SIDEBAR.BACKGROUND} *:not(svg):not(path)[class*="text-white/"], ${prefix} ${SELECTORS.SIDEBAR.BACKGROUND} *:not(svg):not(path)[class*="text-gray-"], ${prefix} ${SELECTORS.SIDEBAR.BACKGROUND} *:not(svg):not(path)[class*="dark:text-white"] { color: ${colors.text} !important; opacity: 1 !important; --tw-text-opacity: 1 !important; }`,
            `${prefix} [data-element-id="custom-chat-item"] button > div:nth-child(2), ${prefix} [data-element-id="selected-chat-item"] button > div:nth-child(2) { gap: 2px !important; }`,
            `${prefix} [data-element-id="custom-chat-item"]:hover, ${prefix} [data-element-id="selected-chat-item"] { background-color: ${colors.sidebar.hover} !important; }`,
            `${prefix} [data-element-id="custom-chat-item"] span, ${prefix} [data-element-id="selected-chat-item"] span { color: ${colors.sidebar.text} !important; font-family: ${CONFIG.fonts.sidebar.family} !important; font-size: ${CONFIG.fonts.sidebar.size} !important; line-height: ${CONFIG.fonts.sidebar.lineHeight} !important; font-weight: ${CONFIG.fonts.sidebar.weight} !important; }`,
            `${prefix} [data-element-id="custom-chat-item"] button[aria-label="Delete Chat"], ${prefix} [data-element-id="custom-chat-item"] button[aria-label="Favorite Chat"], ${prefix} [data-element-id="custom-chat-item"] button[aria-label="Chat settings"], ${prefix} [data-element-id="selected-chat-item"] button[aria-label="Delete Chat"], ${prefix} [data-element-id="selected-chat-item"] button[aria-label="Favorite Chat"], ${prefix} [data-element-id="selected-chat-item"] button[aria-label="Chat settings"] { display: none !important; }`,
            `${prefix} [data-element-id="custom-chat-item"]:hover button[aria-label="Delete Chat"], ${prefix} [data-element-id="custom-chat-item"]:hover button[aria-label="Favorite Chat"], ${prefix} [data-element-id="custom-chat-item"]:hover button[aria-label="Chat settings"], ${prefix} [data-element-id="selected-chat-item"]:hover button[aria-label="Delete Chat"], ${prefix} [data-element-id="selected-chat-item"]:hover button[aria-label="Favorite Chat"], ${prefix} [data-element-id="selected-chat-item"]:hover button[aria-label="Chat settings"], ${prefix} [data-element-id="custom-chat-item"] button[aria-expanded="true"], ${prefix} [data-element-id="selected-chat-item"] button[aria-expanded="true"] { display: inline-block !important; }`,
            `${prefix} #headlessui-portal-root { display: block !important; visibility: visible !important; pointer-events: auto !important; }`,
            `${prefix} #headlessui-portal-root [role="menu"] { display: block !important; visibility: visible !important; background-color: ${colors.menu.background} !important; color: ${colors.menu.text} !important; pointer-events: auto !important; }`,
            `${prefix} #headlessui-portal-root [role="menuitem"] { display: flex !important; visibility: visible !important; pointer-events: auto !important; font-weight: ${CONFIG.fonts.weights.normal} !important; color: ${colors.menu.text} !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] { background-color: ${colors.background} !important; border: 1px solid ${colors.border} !important; color: ${colors.text} !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] input[type="search"] { background-color: ${colors.sidebar.searchBg} !important; border: 1px solid ${colors.border} !important; color: ${colors.text} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] input[type="checkbox"] { appearance: none !important; width: 16px !important; height: 16px !important; border: 1px solid ${colors.border} !important; border-radius: 3px !important; background-color: ${colors.sidebar.searchBg} !important; position: relative !important; cursor: pointer !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] input[type="checkbox"]:checked { background-color: #2563eb !important; border-color: #2563eb !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] input[type="checkbox"]:checked::after { content: '' !important; position: absolute !important; left: 5px !important; top: 2px !important; width: 4px !important; height: 8px !important; border: solid white !important; border-width: 0 2px 2px 0 !important; transform: rotate(45deg) !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] label, ${prefix} [data-element-id="tag-search-panel"] p, ${prefix} [data-element-id="tag-search-panel"] span, ${prefix} [data-element-id="tag-search-panel"] button { color: ${colors.text} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar { width: 8px !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-track { background: ${colors.scrollbar.track} !important; border-radius: 4px !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb { background: ${colors.scrollbar.thumb} !important; border-radius: 4px !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb:hover { background: ${colors.scrollbar.thumbHover} !important; }`,
            `${prefix} [data-element-id="tag-search-panel"] .overflow-auto { scrollbar-width: thin !important; scrollbar-color: ${colors.scrollbar.thumb} ${colors.scrollbar.track} !important; }`,
            `${prefix} [data-element-id="chat-folder"] textarea, ${prefix} [data-element-id="custom-chat-item"] textarea, ${prefix} [data-element-id="selected-chat-item"] textarea, ${prefix} [data-element-id="side-bar-background"] textarea { background-color: ${colors.sidebar.searchBg} !important; color: ${colors.text} !important; border: 1px solid ${colors.border} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; }`,
            `${prefix} [data-element-id="chat-folder"] textarea:focus, ${prefix} [data-element-id="custom-chat-item"] textarea:focus, ${prefix} [data-element-id="selected-chat-item"] textarea:focus, ${prefix} [data-element-id="side-bar-background"] textarea:focus { background-color: ${colors.sidebar.searchBg} !important; color: ${colors.text} !important; border-color: #2563eb !important; box-shadow: 0 0 0 2px rgba(37,99,235,0.2) !important; }`,
            `${prefix} [data-element-id="workspace-bar"] button span.hover\\:bg-white\\/20:hover, ${prefix} [data-element-id="workspace-bar"] button:hover span.text-white\\/70, ${prefix} [data-element-id="workspace-profile-button"]:hover { background-color: ${colors.hoverOverlay} !important; }`
        ];

        const lightStyles = generateSidebarStyles(light, 'html:not(.dark)');
        const darkStyles = generateSidebarStyles(dark, 'html.dark');
        
        sidebarStyle.innerHTML = [...lightStyles, ...darkStyles].join('\n');
        
        // Ensure circular avatar icons remain visible on light sidebar:
        // keep icon color white when the avatar uses a dark circular background
        sidebarStyle.innerHTML += `\nhtml:not(.dark) ${SELECTORS.SIDEBAR.WORKSPACE} .rounded-full[class*="text-white"], html:not(.dark) ${SELECTORS.SIDEBAR.BACKGROUND} .rounded-full[class*="text-white"] { color: #fff !important; }`;
        sidebarStyle.innerHTML += `\nhtml:not(.dark) ${SELECTORS.SIDEBAR.WORKSPACE} .bg-\\[\\#0d0d0d\\].text-white, html:not(.dark) ${SELECTORS.SIDEBAR.BACKGROUND} .bg-\\[\\#0d0d0d\\].text-white { color: #fff !important; }`;
        sidebarStyle.innerHTML += `\nhtml.dark ${SELECTORS.SIDEBAR.WORKSPACE} .rounded-full[class*="text-white"], html.dark ${SELECTORS.SIDEBAR.BACKGROUND} .rounded-full[class*="text-white"] { color: #fff !important; }`;
        sidebarStyle.innerHTML += `\nhtml.dark ${SELECTORS.SIDEBAR.WORKSPACE} .bg-\\[\\#0d0d0d\\].text-white, html.dark ${SELECTORS.SIDEBAR.BACKGROUND} .bg-\\[\\#0d0d0d\\].text-white { color: #fff !important; }`;
        
        document.head.appendChild(sidebarStyle);
        new MutationObserver(() => { if (!document.getElementById('typingmindSidebarFixMerged')) { document.head.appendChild(sidebarStyle); } }).observe(document.body, { childList: true, subtree: true });
        console.log('TypingMind Sidebar Mods loaded.');
    }
    function fixSearchPlaceholder() {
        const input = document.querySelector(SELECTORS.SIDEBAR.SEARCH); if (input && !input.placeholder) { input.setAttribute('placeholder', 'Search chats'); }
    }
    document.addEventListener('DOMContentLoaded', () => { applySidebarStyles(); fixSearchPlaceholder(); });
    if (!document.getElementById('typingmindSidebarFixMerged')) { applySidebarStyles(); fixSearchPlaceholder(); }

    /**
     * ----------------------------
     * 4) Main Chat & Input Styles
     * ----------------------------
     */
    const mainStyle = document.createElement('style');
    const light = CONFIG.colors.light;
    const dark = CONFIG.colors.dark;
    
    mainStyle.textContent = `
      /* ===== LIGHT MODE ===== */
      html:not(.dark) [data-element-id="chat-space-middle-part"] .prose.max-w-full *:not( pre, pre *, code, code *, .flex.items-start.justify-center.flex-col.gap-2 *, .text-xs.text-gray-500.truncate, .italic.truncate.hover\\:underline, h1, h2, h3, h4, h5, h6, strong, b ),
      html:not(.dark) [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div { font-family: ${CONFIG.fonts.primary} !important; font-size: 16px !important; line-height: 24px !important; color: ${light.text} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; }
      html:not(.dark) [data-element-id="chat-space-middle-part"] .prose.max-w-full, html:not(.dark) [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] { font-family: ${CONFIG.fonts.primary} !important; font-size: 16px !important; line-height: 24px !important; color: ${light.text} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; text-rendering: optimizeLegibility !important; letter-spacing: -0.005em !important; }
      html:not(.dark) [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] { margin-left: auto !important; margin-right: 0 !important; display: block !important; max-width: 70% !important; border-radius: ${CONFIG.borderRadius.large} !important; background-color: ${light.input.background} !important; color: ${light.text} !important; padding: ${CONFIG.spacing.small} !important; margin-bottom: ${CONFIG.spacing.small} !important; }
      html:not(.dark) [data-element-id="chat-space-middle-part"] [data-element-id="user-message"], html:not(.dark) [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div { background-color: ${light.input.background} !important; }
      html:not(.dark) ${SELECTORS.CODE_BLOCK_CONTAINER} { background-color: ${light.background} !important; border: 1px solid ${light.border} !important; border-radius: ${CONFIG.borderRadius.small} !important; margin: 0.5em 0 !important; max-height: none !important; }
      html:not(.dark) ${SELECTORS.CODE_BLOCK_CONTAINER} > div.relative > div.sticky { position: sticky !important; top: 0 !important; z-index: 10 !important; background-color: ${light.codeBlock.headerBg} !important; border-radius: 0.5rem 0.5rem 0 0 !important; border-bottom: 1px solid ${light.border} !important; }
      html:not(.dark) ${SELECTORS.CODE_BLOCK_CONTAINER} code { font-family: ${CONFIG.fonts.code} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; font-size: 13px !important; line-height: 20px !important; }
      html:not(.dark) ${SELECTORS.AI_RESPONSE_BLOCK} ${SELECTORS.RESULT_BLOCKS} { background-color: #000 !important; color: #fff !important; border: none !important; padding: 8px !important; border-radius: 4px !important; white-space: pre-wrap !important; word-wrap: break-word !important; overflow-x: hidden !important; font-family: ${CONFIG.fonts.code} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; }
      html:not(.dark) [data-element-id="chat-space-middle-part"] .prose.max-w-full li::marker { color: ${light.text} !important; font-weight: ${CONFIG.fonts.weights.bold} !important; }
      html:not(.dark) [data-element-id="chat-space-middle-part"] .prose.max-w-full h1 { font-size: 2em !important; line-height: 1.3 !important; margin: 0.5em 0 !important; font-weight: ${CONFIG.fonts.weights.bold} !important; color: ${light.text} !important; }
      html:not(.dark) [data-element-id="chat-space-middle-part"] .prose.max-w-full h2 { font-size: 1.5em !important; line-height: 1.3 !important; margin: 0.5em 0 !important; font-weight: ${CONFIG.fonts.weights.semibold} !important; color: ${light.text} !important; }
      html:not(.dark) [data-element-id="chat-space-middle-part"] .prose.max-w-full h3 { font-size: 1.25em !important; line-height: 1.3 !important; margin: 0.5em 0 !important; font-weight: ${CONFIG.fonts.weights.semibold} !important; color: ${light.text} !important; }
      html:not(.dark) ${SELECTORS.THOUGHT_DETAILS_SPECIFIC} > div, html:not(.dark) ${SELECTORS.THOUGHT_DETAILS_SPECIFIC} > div * { color: ${light.thought.text} !important; font-size: ${CONFIG.fonts.thought.size} !important; font-style: italic !important; line-height: ${CONFIG.fonts.thought.lineHeight} !important; font-weight: ${CONFIG.fonts.thought.weight} !important; }
      
      /* ===== DARK MODE ===== */
      html.dark [data-element-id="chat-space-middle-part"] .prose.max-w-full *:not( pre, pre *, code, code *, .flex.items-start.justify-center.flex-col.gap-2 *, .text-xs.text-gray-500.truncate, .italic.truncate.hover\\:underline, h1, h2, h3, h4, h5, h6, strong, b ),
      html.dark [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div { font-family: ${CONFIG.fonts.primary} !important; font-size: 16px !important; line-height: 24px !important; color: ${dark.text} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; }
      html.dark [data-element-id="chat-space-middle-part"] .prose.max-w-full, html.dark [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] { font-family: ${CONFIG.fonts.primary} !important; font-size: 16px !important; line-height: 24px !important; color: ${dark.text} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; text-rendering: optimizeLegibility !important; letter-spacing: -0.005em !important; }
      html.dark [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] { margin-left: auto !important; margin-right: 0 !important; display: block !important; max-width: 70% !important; border-radius: ${CONFIG.borderRadius.large} !important; background-color: ${dark.input.background} !important; color: ${dark.text} !important; padding: ${CONFIG.spacing.small} !important; margin-bottom: ${CONFIG.spacing.small} !important; }
      html.dark [data-element-id="chat-space-middle-part"] [data-element-id="user-message"], html.dark [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div { background-color: ${dark.input.background} !important; }
      html.dark ${SELECTORS.CODE_BLOCK_CONTAINER} { background-color: ${dark.background} !important; border: 1px solid ${dark.border} !important; border-radius: ${CONFIG.borderRadius.small} !important; margin: 0.5em 0 !important; max-height: none !important; }
      html.dark ${SELECTORS.CODE_BLOCK_CONTAINER} > div.relative > div.sticky { position: sticky !important; top: 0 !important; z-index: 10 !important; background-color: ${dark.codeBlock.headerBg} !important; border-radius: 0.5rem 0.5rem 0 0 !important; border-bottom: 1px solid ${dark.border} !important; }
      html.dark ${SELECTORS.CODE_BLOCK_CONTAINER} code { font-family: ${CONFIG.fonts.code} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; font-size: 13px !important; line-height: 20px !important; }
      html.dark ${SELECTORS.AI_RESPONSE_BLOCK} ${SELECTORS.RESULT_BLOCKS} { background-color: #000 !important; color: #fff !important; border: none !important; padding: 8px !important; border-radius: 4px !important; white-space: pre-wrap !important; word-wrap: break-word !important; overflow-x: hidden !important; font-family: ${CONFIG.fonts.code} !important; font-weight: ${CONFIG.fonts.weights.normal} !important; }
      html.dark [data-element-id="chat-space-middle-part"] .prose.max-w-full li::marker { color: ${dark.text} !important; font-weight: ${CONFIG.fonts.weights.bold} !important; }
      html.dark [data-element-id="chat-space-middle-part"] .prose.max-w-full h1 { font-size: 2em !important; line-height: 1.3 !important; margin: 0.5em 0 !important; font-weight: ${CONFIG.fonts.weights.bold} !important; color: ${dark.text} !important; }
      html.dark [data-element-id="chat-space-middle-part"] .prose.max-w-full h2 { font-size: 1.5em !important; line-height: 1.3 !important; margin: 0.5em 0 !important; font-weight: ${CONFIG.fonts.weights.semibold} !important; color: ${dark.text} !important; }
      html.dark [data-element-id="chat-space-middle-part"] .prose.max-w-full h3 { font-size: 1.25em !important; line-height: 1.3 !important; margin: 0.5em 0 !important; font-weight: ${CONFIG.fonts.weights.semibold} !important; color: ${dark.text} !important; }
      html.dark ${SELECTORS.THOUGHT_DETAILS_SPECIFIC} > div, html.dark ${SELECTORS.THOUGHT_DETAILS_SPECIFIC} > div * { color: ${dark.thought.text} !important; font-size: ${CONFIG.fonts.thought.size} !important; font-style: italic !important; line-height: ${CONFIG.fonts.thought.lineHeight} !important; font-weight: ${CONFIG.fonts.thought.weight} !important; }
      
      /* ===== SHARED (both modes) ===== */
      /* 結構優化：完美隱藏空白聊天區域中央的 TypingMind 標誌與歡迎標語 */
      .dynamic-chat-content-container > div:not(.post-message-content):not([data-element-id]) {
          display: none !important;
      }

      [data-element-id="chat-space-middle-part"] .text-xs.text-gray-500.truncate,
