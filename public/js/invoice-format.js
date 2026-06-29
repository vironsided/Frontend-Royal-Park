(function () {
    'use strict';

    function formatPeriod(data) {
        if (data?.period_dates?.from && data?.period_dates?.to) {
            return data.period_dates.from === data.period_dates.to
                ? data.period_dates.to
                : `${data.period_dates.from} - ${data.period_dates.to}`;
        }
        return `${data.period_year}-${String(data.period_month).padStart(2, '0')}`;
    }

    function statusLabel(status, t) {
        const map = {
            DRAFT: t('invoices_status_draft', 'Черновик'),
            ISSUED: t('invoices_status_issued', 'Выставлен'),
            PARTIAL: t('invoices_status_partial', 'Частично оплачен'),
            PAID: t('invoices_status_paid', 'Оплачен'),
            OVERPAID: t('invoices_status_overpaid', 'Переплата'),
            CANCELED: t('invoices_status_canceled', 'Отменён'),
        };
        return map[status] || status;
    }

    function extractConsumption(description, t) {
        if (!description) return { label: '—', consumed: '—' };
        const source = String(description).trim();
        const openingDebtMatch = source.match(/^(?:Начальный\s+долг|İlkin\s+borc|Opening\s+debt)\s*(?:\(([^)]+)\))?$/i);
        if (openingDebtMatch) {
            const openingLabel = t('invoice_opening_debt', 'Opening debt');
            const rawCategory = String(openingDebtMatch[1] || '').trim().toLowerCase();
            let categoryKey = '';
            if (/(utility|коммун|kommunal)/i.test(rawCategory)) categoryKey = 'payments_service_utility';
            else if (/(service|сервис|xidmət|xidmet)/i.test(rawCategory)) categoryKey = 'tariffs_purpose_service';
            else if (/(rent|аренд|icar)/i.test(rawCategory)) categoryKey = 'tariffs_purpose_rent';
            const categoryLabel = categoryKey ? t(categoryKey, rawCategory) : '';
            return { label: categoryLabel ? `${openingLabel} (${categoryLabel})` : openingLabel, consumed: '—' };
        }
        const isSewerageLine = /^(?:meter_sewerage\b|канализац|kanaliz|sewerage)/i.test(source);
        const keyMatch = source.match(/^(meter_[a-z_]+)\s+([\d.]+)\s*(.*)$/i);
        if (keyMatch) {
            const key = keyMatch[1];
            const qty = keyMatch[2];
            const unit = (keyMatch[3] || '').trim();
            const translatedLabel = t(key, key);
            if (key === 'meter_sewerage') return { label: translatedLabel, consumed: '—' };
            return { label: translatedLabel, consumed: `${qty}${unit ? ' ' + unit : ''}`.trim() };
        }
        const patterns = [
            { regex: /^(?:Электричество|Elektrik|Electricity)\s+([\d.]+)\s*(?:кВт·ч|kWh)$/i, key: 'meter_electricity', unit: 'kWh', unitKey: 'user_unit_kwh' },
            { regex: /^(?:Вода|Su|Water)\s+([\d.]+)\s*(?:м³|m³|m3)$/i, key: 'meter_cold_water', unit: 'm³', unitKey: 'user_unit_m3' },
            { regex: /^(?:Горячая\s+вода|İsti\s+su|Hot\s+water)\s+([\d.]+)\s*(?:м³|m³|m3)$/i, key: 'meter_hot_water', unit: 'm³', unitKey: 'user_unit_m3' },
            { regex: /^(?:Канализация(?:\s*\(авто\))?|Kanalizasiya(?:\s*\(auto\))?|Sewerage(?:\s*\(auto\))?)\s+([\d.]+)\s*(?:м³|m³|m3)$/i, key: 'meter_sewerage', unit: 'm³', unitKey: 'user_unit_m3' },
            { regex: /^(?:Газ|Qaz|Gas)\s+([\d.]+)\s*(?:м³|m³|m3)$/i, key: 'meter_gas', unit: 'm³', unitKey: 'user_unit_m3' },
        ];
        for (const p of patterns) {
            const m = source.match(p.regex);
            if (m) {
                const translatedLabel = t(p.key, p.key);
                if (p.key === 'meter_sewerage' || isSewerageLine) return { label: translatedLabel, consumed: '—' };
                return { label: translatedLabel, consumed: `${m[1]} ${t(p.unitKey, p.unit)}` };
            }
        }
        if (isSewerageLine) return { label: t('meter_sewerage', 'Sewerage'), consumed: '—' };
        const monthlyPurposePatterns = [
            { regex: /^(?:Аренда|İcarə|Rent)\s+([\d.]+)\s*(?:мес\.?|ay|month)$/i, key: 'tariffs_purpose_rent' },
            { regex: /^(?:Сервис|Услуги|Xidmət|Xidmətlər|Service|Services)\s+([\d.]+)\s*(?:мес\.?|ay|month)$/i, key: 'tariffs_purpose_service' },
            { regex: /^(?:Строительство|Tikinti|Construction)\s+([\d.]+)\s*(?:мес\.?|ay|month)$/i, key: 'tariffs_purpose_construction' },
        ];
        for (const p of monthlyPurposePatterns) {
            const m = source.match(p.regex);
            if (m) {
                const qty = m[1];
                const unit = t('readings_unit_month_short', 'month');
                return { label: `${t(p.key, p.key)} ${qty} ${unit}`, consumed: '—' };
            }
        }
        if (/(стабильн(?:ый|ая)? тариф|sabit tarif|stable tariff)/i.test(source)) {
            let serviceKey = null;
            if (/(газ|qaz|gas)/i.test(source)) serviceKey = 'meter_gas';
            else if (/(горячая\s+вода|isti\s+su|hot\s+water)/i.test(source)) serviceKey = 'meter_hot_water';
            else if (/(вода|su|water)/i.test(source)) serviceKey = 'meter_cold_water';
            else if (/(электрич|elektrik|electric)/i.test(source)) serviceKey = 'meter_electricity';
            else if (/(канализац|kanaliz|sewerage)/i.test(source)) serviceKey = 'meter_sewerage';
            const stableTariffLabel = t('stable_tariff', 'Stable tariff');
            if (serviceKey) return { label: `${stableTariffLabel} (${t(serviceKey, serviceKey)})`, consumed: '—' };
            return { label: stableTariffLabel, consumed: '—' };
        }
        return { label: source, consumed: '—' };
    }

    window.InvoiceFormat = { extractConsumption, formatPeriod, statusLabel };
})();
