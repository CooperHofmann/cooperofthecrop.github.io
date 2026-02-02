(() => {
    'use strict';

    const THEME_VERSION = 'v1';
    const THEME_KEYS = {
        published: `cotc_theme_published_${THEME_VERSION}`,
        draft: `cotc_theme_draft_${THEME_VERSION}`,
        publishedAt: `cotc_theme_published_at_${THEME_VERSION}`,
        draftAt: `cotc_theme_draft_at_${THEME_VERSION}`
    };
    const CHANNEL_NAME = 'cotc_theme_channel';

    const DEFAULT_THEME = {
        id: 'brutalist-classic',
        name: 'Brutalist Classic',
        colors: {
            bg: '#f5f7fb',
            text: '#0c1a2a',
            accent: '#7ec8e3',
            border: '#e5e5e5',
            muted: '#4c5766',
            surface: '#ffffff'
        },
        motion: 'subtle'
    };

    const THEME_PRESETS = [
        DEFAULT_THEME,
        {
            id: 'brutalist-warm',
            name: 'Brutalist Warm',
            colors: {
                bg: '#f9f5f0',
                text: '#231d1a',
                accent: '#d67c5c',
                border: '#d6c8bf',
                muted: '#6f6158',
                surface: '#ffffff'
            },
            motion: 'subtle'
        },
        {
            id: 'cool-editorial',
            name: 'Cool Editorial',
            colors: {
                bg: '#f1f4f8',
                text: '#152235',
                accent: '#6aa6c8',
                border: '#d3d9e1',
                muted: '#516171',
                surface: '#ffffff'
            },
            motion: 'subtle'
        },
        {
            id: 'night-mode',
            name: 'Night Mode',
            colors: {
                bg: '#0d1116',
                text: '#f3f4f6',
                accent: '#7ee0ff',
                border: '#2b333d',
                muted: '#c4c9d1',
                surface: '#161b22'
            },
            motion: 'reduced'
        },
        {
            id: 'clean-minimal',
            name: 'Clean Minimal',
            colors: {
                bg: '#f6f6f4',
                text: '#1d1d1d',
                accent: '#6c6c6c',
                border: '#dcdcdc',
                muted: '#6e6e6e',
                surface: '#ffffff'
            },
            motion: 'subtle'
        }
    ];

    const ColorKeys = ['bg', 'text', 'accent', 'border', 'muted', 'surface'];

    const themeChannel = (() => {
        if (typeof BroadcastChannel !== 'undefined') {
            return new BroadcastChannel(CHANNEL_NAME);
        }
        return null;
    })();

    function getPresetById(id) {
        return THEME_PRESETS.find((preset) => preset.id === id) || DEFAULT_THEME;
    }

    function cloneTheme(theme) {
        return JSON.parse(JSON.stringify(theme));
    }

    function normalizeTheme(theme) {
        if (!theme || typeof theme !== 'object') {
            return cloneTheme(DEFAULT_THEME);
        }
        const base = cloneTheme(DEFAULT_THEME);
        const incoming = cloneTheme(theme);
        base.id = incoming.id || base.id;
        base.name = incoming.name || base.name;
        base.motion = incoming.motion || base.motion;
        base.colors = base.colors || {};
        if (incoming.colors) {
            ColorKeys.forEach((key) => {
                if (incoming.colors[key]) {
                    base.colors[key] = incoming.colors[key];
                }
            });
        }
        return base;
    }

    function toCssVars(theme) {
        return {
            '--bg': theme.colors.bg,
            '--text': theme.colors.text,
            '--accent': theme.colors.accent,
            '--border': theme.colors.border,
            '--muted': theme.colors.muted,
            '--surface': theme.colors.surface,
            '--motion-level': theme.motion || 'subtle'
        };
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    reducedMotionQuery.addEventListener('change', (event) => {
        prefersReducedMotion = event.matches;
    });

    function applyTheme(theme, target = document.documentElement) {
        if (!target) return;
        const normalized = normalizeTheme(theme);
        const motionLevel = prefersReducedMotion ? 'reduced' : (normalized.motion || 'subtle');
        normalized.motion = motionLevel;
        const vars = toCssVars(normalized);
        Object.entries(vars).forEach(([key, value]) => {
            target.style.setProperty(key, value);
        });
        document.documentElement?.setAttribute('data-motion-level', motionLevel);
        document.body?.setAttribute('data-motion-level', motionLevel);
    }

    function storeTheme(key, theme) {
        localStorage.setItem(key, JSON.stringify(normalizeTheme(theme)));
    }

    function loadTheme(key) {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
            return normalizeTheme(JSON.parse(raw));
        } catch (error) {
            console.warn(`Theme parse error for ${key}`, error);
            return null;
        }
    }

    function storeTimestamp(key) {
        localStorage.setItem(key, new Date().toISOString());
    }

    function loadTimestamp(key) {
        return localStorage.getItem(key);
    }

    function isPreviewMode() {
        return new URLSearchParams(window.location.search).get('preview') === '1';
    }

    function broadcastTheme(theme) {
        const normalized = normalizeTheme(theme);
        if (themeChannel) {
            themeChannel.postMessage({ type: 'theme-update', theme: normalized });
        } else {
            const pingKey = `${THEME_KEYS.draft}_ping`;
            localStorage.setItem(pingKey, JSON.stringify({ theme: normalized, ts: Date.now() }));
            setTimeout(() => localStorage.removeItem(pingKey), 1000);
        }
    }

    function requestThemeSync() {
        if (themeChannel) {
            themeChannel.postMessage({ type: 'theme-request' });
        } else {
            const requestKey = `${THEME_KEYS.draft}_request`;
            localStorage.setItem(requestKey, `${Date.now()}`);
            setTimeout(() => localStorage.removeItem(requestKey), 1000);
        }
    }

    function onMessage(handler) {
        if (themeChannel) {
            themeChannel.addEventListener('message', (event) => handler(event.data));
        } else {
            window.addEventListener('storage', (event) => {
                if (event.key === `${THEME_KEYS.draft}_ping` && event.newValue) {
                    try {
                        const payload = JSON.parse(event.newValue);
                        handler({ type: 'theme-update', theme: payload.theme });
                    } catch (error) {
                        console.warn(`Theme storage event parse error for ${event.key}`, error);
                    }
                }
                if (event.key === `${THEME_KEYS.draft}_request` && event.newValue) {
                    handler({ type: 'theme-request' });
                }
            });
        }
    }

    function initPreviewBadge() {
        if (!isPreviewMode()) return;
        if (!document.body) {
            window.addEventListener('DOMContentLoaded', initPreviewBadge, { once: true });
            return;
        }
        if (document.querySelector('.preview-indicator')) return;
        const badge = document.createElement('div');
        badge.className = 'preview-indicator';
        badge.textContent = 'Preview Mode';
        document.body.appendChild(badge);
    }

    function initPreviewListener() {
        if (!isPreviewMode()) return;
        initPreviewBadge();
        const draftTheme = loadTheme(THEME_KEYS.draft) ?? cloneTheme(DEFAULT_THEME);
        if (document.documentElement) {
            applyTheme(draftTheme);
        } else {
            document.addEventListener('DOMContentLoaded', () => applyTheme(draftTheme), { once: true });
        }
        requestThemeSync();
        onMessage((data) => {
            if (data?.type === 'theme-update' && data.theme) {
                applyTheme(data.theme);
            }
        });
    }

    function initPublishedTheme() {
        if (isPreviewMode()) return;
        const published = loadTheme(THEME_KEYS.published) ?? cloneTheme(DEFAULT_THEME);
        if (document.documentElement) {
            applyTheme(published);
        } else {
            document.addEventListener('DOMContentLoaded', () => applyTheme(published), { once: true });
        }
    }

    function initAdminThemeStudio(options = {}) {
        const {
            presetSelect,
            colorInputs,
            motionSelect,
            draftTimestampEl,
            publishedTimestampEl,
            onUpdate
        } = options;

        let draftTheme = loadTheme(THEME_KEYS.draft) || cloneTheme(DEFAULT_THEME);
        let publishedTheme = loadTheme(THEME_KEYS.published) || cloneTheme(DEFAULT_THEME);

        let lastDraftTimestamp = loadTimestamp(THEME_KEYS.draftAt);
        let lastPublishedTimestamp = loadTimestamp(THEME_KEYS.publishedAt);

        function updateTimestamps() {
            if (draftTimestampEl) {
                lastDraftTimestamp = loadTimestamp(THEME_KEYS.draftAt);
                draftTimestampEl.textContent = lastDraftTimestamp || 'Not saved yet';
            }
            if (publishedTimestampEl) {
                lastPublishedTimestamp = loadTimestamp(THEME_KEYS.publishedAt);
                publishedTimestampEl.textContent = lastPublishedTimestamp || 'Not published yet';
            }
        }

        function refreshInputs(theme) {
            if (presetSelect) {
                presetSelect.value = theme.id || DEFAULT_THEME.id;
            }
            if (motionSelect) {
                motionSelect.value = theme.motion || 'subtle';
            }
            if (colorInputs) {
                ColorKeys.forEach((key) => {
                    const input = colorInputs[key];
                    if (input && theme.colors[key]) {
                        input.value = theme.colors[key];
                    }
                });
            }
        }

        function updateThemeFromInputs() {
            draftTheme = normalizeTheme(draftTheme);
            if (motionSelect) {
                draftTheme.motion = motionSelect.value || 'subtle';
            }
            if (colorInputs) {
                ColorKeys.forEach((key) => {
                    const input = colorInputs[key];
                    if (input && input.value) {
                        draftTheme.colors[key] = input.value;
                    }
                });
            }
            applyTheme(draftTheme);
            broadcastTheme(draftTheme);
            if (onUpdate) onUpdate(draftTheme);
        }

        if (presetSelect) {
            presetSelect.addEventListener('change', () => {
                const preset = getPresetById(presetSelect.value);
                draftTheme = cloneTheme(preset);
                refreshInputs(draftTheme);
                updateThemeFromInputs();
            });
        }

        if (motionSelect) {
            motionSelect.addEventListener('change', updateThemeFromInputs);
        }

        if (colorInputs) {
            ColorKeys.forEach((key) => {
                const input = colorInputs[key];
                if (input) {
                    input.addEventListener('input', updateThemeFromInputs);
                }
            });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState !== 'visible') return;
            const nextDraftTimestamp = loadTimestamp(THEME_KEYS.draftAt);
            const nextPublishedTimestamp = loadTimestamp(THEME_KEYS.publishedAt);
            const draftChanged = nextDraftTimestamp && nextDraftTimestamp !== lastDraftTimestamp;
            const publishedChanged = nextPublishedTimestamp && nextPublishedTimestamp !== lastPublishedTimestamp;
            if (draftChanged || publishedChanged) {
                publishedTheme = loadTheme(THEME_KEYS.published) || publishedTheme;
                draftTheme = loadTheme(THEME_KEYS.draft) || draftTheme;
                refreshInputs(draftTheme);
                updateTimestamps();
            }
        });

        updateTimestamps();
        refreshInputs(draftTheme);
        applyTheme(draftTheme);

        onMessage((data) => {
            if (data?.type === 'theme-request') {
                broadcastTheme(draftTheme);
            }
        });

        return {
            getDraftTheme: () => cloneTheme(draftTheme),
            getPublishedTheme: () => cloneTheme(publishedTheme),
            setDraftTheme: (theme) => {
                draftTheme = normalizeTheme(theme);
                refreshInputs(draftTheme);
                updateThemeFromInputs();
            },
            saveDraft: () => {
                storeTheme(THEME_KEYS.draft, draftTheme);
                storeTimestamp(THEME_KEYS.draftAt);
                updateTimestamps();
            },
            publish: () => {
                publishedTheme = cloneTheme(draftTheme);
                storeTheme(THEME_KEYS.published, publishedTheme);
                storeTimestamp(THEME_KEYS.publishedAt);
                updateTimestamps();
            },
            revertDraft: () => {
                draftTheme = cloneTheme(publishedTheme);
                refreshInputs(draftTheme);
                updateThemeFromInputs();
            },
            resetDefault: () => {
                draftTheme = cloneTheme(DEFAULT_THEME);
                refreshInputs(draftTheme);
                updateThemeFromInputs();
            }
        };
    }

    window.COTCTheme = {
        presets: THEME_PRESETS.map(cloneTheme),
        defaultTheme: cloneTheme(DEFAULT_THEME),
        keys: THEME_KEYS,
        applyTheme,
        initPreviewListener,
        initPublishedTheme,
        initAdminThemeStudio
    };
})();
