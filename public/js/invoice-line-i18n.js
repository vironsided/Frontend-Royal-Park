/**
 * Localized display strings for invoice line descriptions (often stored in Russian in DB).
 * Mirrors logic from user/pages/invoice-view.html — extractConsumption + one-line formatter.
 */
(function () {
    'use strict';

    function extractConsumption(description, lang) {
        if (!description) {
            return { label: '—', consumed: '—', serviceKey: '', qty: '', unitKey: '' };
        }

        const source = String(description).trim();
        const openingDebtMatch = source.match(/^(?:Начальный\s+долг|İlkin\s+borc|Opening\s+debt)\s*(?:\(([^)]+)\))?$/i);
        if (openingDebtMatch) {
            const openingLabel = window.i18n?.translate?.('invoice_opening_debt', lang) || 'Opening debt';
            const rawCategory = String(openingDebtMatch[1] || '').trim().toLowerCase();
            let categoryKey = '';
            if (/(utility|коммун|kommunal)/i.test(rawCategory)) categoryKey = 'payments_service_utility';
            else if (/(service|сервис|xidmət|xidmet)/i.test(rawCategory)) categoryKey = 'tariffs_purpose_service';
            else if (/(rent|аренд|icar)/i.test(rawCategory)) categoryKey = 'tariffs_purpose_rent';
            const categoryLabel = categoryKey
                ? (window.i18n?.translate?.(categoryKey, lang) || rawCategory)
                : '';
            const label = categoryLabel ? `${openingLabel} (${categoryLabel})` : openingLabel;
            return { label, consumed: '—', serviceKey: categoryKey, qty: '', unitKey: '' };
        }
        const isSewerageLine = /^(?:meter_sewerage\b|канализац|kanaliz|sewerage)/i.test(source);

        const keyPattern = /^(meter_[a-z_]+)\s+([\d.]+)\s*(.*)$/i;
        const keyMatch = source.match(keyPattern);
        if (keyMatch) {
            const key = keyMatch[1];
            const qty = keyMatch[2];
            const unitRaw = keyMatch[3] ? keyMatch[3].trim() : '';
            const label = window.i18n?.translate?.(key, lang) || key;
            if (key === 'meter_sewerage') {
                return { label, consumed: '—', serviceKey: key, qty: '', unitKey: '' };
            }
            const unit = unitRaw || '';
            return { label, consumed: `${qty} ${unit}`.trim(), serviceKey: key, qty, unitKey: '' };
        }

        const patterns = [
            {
                regex: /^(?:Электричество|Elektrik|Electricity)\s+([\d.]+)\s*(?:кВт·ч|kWh|kVt·s)$/i,
                serviceKey: 'meter_electricity',
                unitKey: 'user_unit_kwh',
            },
            {
                regex: /^(?:Вода|Su|Water)\s+([\d.]+)\s*(?:м³|m³|m3)$/i,
                serviceKey: 'meter_cold_water',
                unitKey: 'user_unit_m3',
            },
            {
                regex: /^(?:Канализация(?:\s*\(авто\))?|Kanalizasiya(?:\s*\(auto\))?|Sewerage(?:\s*\(auto\))?)\s+([\d.]+)\s*(?:м³|m³|m3)$/i,
                serviceKey: 'meter_sewerage',
                unitKey: 'user_unit_m3',
            },
            {
                regex: /^(?:Газ|Qaz|Gas)\s+([\d.]+)\s*(?:м³|m³|m3)$/i,
                serviceKey: 'meter_gas',
                unitKey: 'user_unit_m3',
            },
            {
                regex: /^(?:Горячая\s+вода|İsti\s+su|Hot\s+water)\s+([\d.]+)\s*(?:м³|m³|m3)$/i,
                serviceKey: 'meter_hot_water',
                unitKey: 'user_unit_m3',
            },
        ];

        for (const pattern of patterns) {
            const match = source.match(pattern.regex);
            if (match) {
                const amount = match[1];
                const label = window.i18n?.translate?.(pattern.serviceKey, lang) || source.split(' ')[0];
                if (pattern.serviceKey === 'meter_sewerage' || isSewerageLine) {
                    return { label, consumed: '—', serviceKey: pattern.serviceKey, qty: '', unitKey: '' };
                }
                const unit = window.i18n?.translate?.(pattern.unitKey, lang) || match[0].split(amount)[1].trim();
                return { label, consumed: `${amount} ${unit}`.trim(), serviceKey: pattern.serviceKey, qty: amount, unitKey: pattern.unitKey };
            }
        }

        if (isSewerageLine) {
            const label = window.i18n?.translate?.('meter_sewerage', lang) || 'Канализация';
            return { label, consumed: '—', serviceKey: 'meter_sewerage', qty: '', unitKey: '' };
        }

        const monthlyPurposePatterns = [
            { regex: /^(?:Аренда|İcarə|Rent)\s+([\d.]+)\s*(?:мес\.?|ay|month)$/i, key: 'tariffs_purpose_rent' },
            { regex: /^(?:Сервис|Услуги|Xidmət|Xidmətlər|Service|Services)\s+([\d.]+)\s*(?:мес\.?|ay|month)$/i, key: 'tariffs_purpose_service' },
            { regex: /^(?:Строительство|Tikinti|Construction)\s+([\d.]+)\s*(?:мес\.?|ay|month)$/i, key: 'tariffs_purpose_construction' },
        ];
        for (const p of monthlyPurposePatterns) {
            const m = source.match(p.regex);
            if (m) {
                const qty = m[1];
                const label = window.i18n?.translate?.(p.key, lang) || p.key;
                const unit = window.i18n?.translate?.('readings_unit_month_short', lang) || 'month';
                return { label, consumed: `${qty} ${unit}`.trim(), serviceKey: p.key, qty, unitKey: 'readings_unit_month_short' };
            }
        }

        if (/(стабильн(?:ый|ая)? тариф|sabit tarif|stable tariff)/i.test(source)) {
            let serviceKey = null;
            if (/(газ|qaz|gas)/i.test(source)) serviceKey = 'meter_gas';
            else if (/(горячая\s+вода|isti\s+su|hot\s+water)/i.test(source)) serviceKey = 'meter_hot_water';
            else if (/(вода|su|water)/i.test(source)) serviceKey = 'meter_cold_water';
            else if (/(электрич|elektrik|electric)/i.test(source)) serviceKey = 'meter_electricity';
            else if (/(канализац|kanaliz|sewerage)/i.test(source)) serviceKey = 'meter_sewerage';
            const stableLabel = window.i18n?.translate?.('stable_tariff', lang) || 'Stable tariff';
            const svcLabel = serviceKey ? (window.i18n?.translate?.(serviceKey, lang) || serviceKey) : '';
            const label = serviceKey ? `${stableLabel} (${svcLabel})` : stableLabel;
            return { label, consumed: '—', serviceKey: '', qty: '', unitKey: '' };
        }

        const fallbackSplit = source.match(/^(.+?)\s+([\d.]+)\s*(.*)$/);
        if (fallbackSplit) {
            const label = fallbackSplit[1].trim();
            const qty = fallbackSplit[2].trim();
            const unit = fallbackSplit[3].trim();
            return { label, consumed: `${qty} ${unit}`.trim(), serviceKey: '', qty, unitKey: '' };
        }

        return { label: source, consumed: '—', serviceKey: '', qty: '', unitKey: '' };
    }

    /**
     * Single localized line for tables / advance history breakdown.
     */
    function formatInvoiceLineDescription(description, lang) {
        if (!description) return '—';
        const { label, consumed } = extractConsumption(description, lang);
        if (!consumed || consumed === '—') return label;
        return `${label} ${consumed}`.trim();
    }

    window.invoiceLineI18n = {
        extractConsumption,
        formatInvoiceLineDescription,
    };
})();
