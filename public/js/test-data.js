// 🇦🇿 Тестовые данные для RoyalPark (Азербайджан)
// Test data with Azerbaijani names and information

const TestData = {
    // 👥 Пользователи / İstifadəçilər / Users
    users: [
        {
            id: 1,
            name: "Əliyev Rəşad Əli oğlu",
            phone: "+994 50 123 45 67",
            email: "rashad.aliyev@mail.az",
            apartment: "A-101",
            building: "Блок A",
            status: "active",
            debt: 0,
            registeredDate: "2023-01-15",
            balance: 150.50
        },
        {
            id: 2,
            name: "Məmmədova Günel Tofiq qızı",
            phone: "+994 51 234 56 78",
            email: "gunel.mammadova@mail.az",
            apartment: "A-205",
            building: "Блок A",
            status: "active",
            debt: 245.00,
            registeredDate: "2023-02-20",
            balance: -245.00
        },
        {
            id: 3,
            name: "Həsənov Elvin Rafiq oğlu",
            phone: "+994 55 345 67 89",
            email: "elvin.hasanov@mail.az",
            apartment: "B-102",
            building: "Блок B",
            status: "active",
            debt: 0,
            registeredDate: "2023-03-10",
            balance: 320.75
        },
        {
            id: 4,
            name: "Quliyeva Səbinə Məhəmməd qızı",
            phone: "+994 70 456 78 90",
            email: "sabina.guliyeva@mail.az",
            apartment: "B-308",
            building: "Блок B",
            status: "inactive",
            debt: 580.50,
            registeredDate: "2022-11-05",
            balance: -580.50
        },
        {
            id: 5,
            name: "Mustafayev Kamran Eldar oğlu",
            phone: "+994 50 567 89 01",
            email: "kamran.mustafayev@mail.az",
            apartment: "C-405",
            building: "Блок C",
            status: "active",
            debt: 125.00,
            registeredDate: "2023-04-18",
            balance: -125.00
        },
        {
            id: 6,
            name: "İsmayılova Leyla Vüqar qızı",
            phone: "+994 51 678 90 12",
            email: "leyla.ismayilova@mail.az",
            apartment: "C-502",
            building: "Блок C",
            status: "active",
            debt: 0,
            registeredDate: "2023-05-22",
            balance: 89.25
        },
        {
            id: 7,
            name: "Rəhimov Tural Ağa oğlu",
            phone: "+994 55 789 01 23",
            email: "tural.rahimov@mail.az",
            apartment: "A-303",
            building: "Блок A",
            status: "active",
            debt: 0,
            registeredDate: "2023-01-30",
            balance: 200.00
        },
        {
            id: 8,
            name: "Hüseynova Nigar Əkbər qızı",
            phone: "+994 70 890 12 34",
            email: "nigar.huseynova@mail.az",
            apartment: "B-215",
            building: "Блок B",
            status: "active",
            debt: 340.25,
            registeredDate: "2022-12-12",
            balance: -340.25
        }
    ],

    // 🏢 Здания / Binalar / Buildings
    buildings: [
        {
            id: 1,
            name: "Блок A",
            address: "28 May küç. 15, Bakı",
            floors: 12,
            apartments: 48,
            residents: 156,
            status: "active",
            yearBuilt: 2020,
            manager: "Əliyev Rəşad"
        },
        {
            id: 2,
            name: "Блок B",
            address: "28 May küç. 17, Bakı",
            floors: 15,
            apartments: 60,
            residents: 198,
            status: "active",
            yearBuilt: 2021,
            manager: "Məmmədov Tofiq"
        },
        {
            id: 3,
            name: "Блок C",
            address: "28 May küç. 19, Bakı",
            floors: 18,
            apartments: 72,
            residents: 234,
            status: "active",
            yearBuilt: 2022,
            manager: "Həsənov Rafiq"
        }
    ],

    // 🏠 Квартиры / Mənzillər / Apartments
    apartments: [
        {
            id: 1,
            number: "A-101",
            building: "Блок A",
            floor: 1,
            rooms: 3,
            area: 85.5,
            owner: "Əliyev Rəşad Əli oğlu",
            residents: 4,
            status: "occupied",
            rentPrice: 0,
            lastPayment: "2024-10-15",
            debt: 0
        },
        {
            id: 2,
            number: "A-205",
            building: "Блок A",
            floor: 2,
            rooms: 2,
            area: 65.0,
            owner: "Məmmədova Günel Tofiq qızı",
            residents: 2,
            status: "occupied",
            rentPrice: 0,
            lastPayment: "2024-08-20",
            debt: 245.00
        },
        {
            id: 3,
            number: "B-102",
            building: "Блок B",
            floor: 1,
            rooms: 4,
            area: 105.0,
            owner: "Həsənov Elvin Rafiq oğlu",
            residents: 5,
            status: "occupied",
            rentPrice: 0,
            lastPayment: "2024-10-18",
            debt: 0
        },
        {
            id: 4,
            number: "B-308",
            building: "Блок B",
            floor: 3,
            rooms: 3,
            area: 78.5,
            owner: "Quliyeva Səbinə Məhəmməd qızı",
            residents: 3,
            status: "occupied",
            rentPrice: 0,
            lastPayment: "2024-06-10",
            debt: 580.50
        },
        {
            id: 5,
            number: "C-405",
            building: "Блок C",
            floor: 4,
            rooms: 2,
            area: 62.0,
            owner: "Mustafayev Kamran Eldar oğlu",
            residents: 2,
            status: "occupied",
            rentPrice: 0,
            lastPayment: "2024-09-15",
            debt: 125.00
        },
        {
            id: 6,
            number: "C-502",
            building: "Блок C",
            floor: 5,
            rooms: 3,
            area: 88.0,
            owner: "İsmayılova Leyla Vüqar qızı",
            residents: 4,
            status: "occupied",
            rentPrice: 0,
            lastPayment: "2024-10-20",
            debt: 0
        }
    ],

    // 💰 Обращения по квитанциям / Borc müraciətləri / Billing complaints
    debts: [
        {
            id: 1,
            userId: 2,
            userName: "Məmmədova Günel Tofiq qızı",
            apartment: "A-205",
            amount: 245.00,
            type: "utility",
            period: "Август-Сентябрь 2024",
            dueDate: "2024-09-30",
            daysOverdue: 20,
            status: "overdue",
            assignedTo: "Məmmədov Tofiq",
            task: "Связаться с жильцом для оплаты",
            notes: "Не отвечает на звонки",
            submittedAt: "2025-11-24T09:32:00",
            invoiceNumber: "INV-2024/000245",
            expectedAmount: 50,
            receivedAmount: 70,
            complaintReason: "Счёт за газ выше обычного",
            residentComment: "Каждый месяц плачу 50₼, показания не менялись.",
            accountant: {
                name: "Məmmədov Tofiq",
                status: "Проверяет начисления",
                viewedAt: "2025-11-24T10:05:00"
            },
            maintenance: {
                name: "Əliyev Vüqar",
                status: "Запланирован выезд для повторного снятия показаний",
                scheduledAt: "2025-11-25T11:00:00"
            },
            stage: "in_progress",
            viewed: true,
            timeline: [
                { date: "2025-11-24T09:32:00", text: "Обращение отправлено жителем", icon: "chat-dots-fill", color: "primary" },
                { date: "2025-11-24T10:05:00", text: "Бухгалтерия проверяет квитанцию", icon: "file-earmark-text-fill", color: "info" }
            ]
        },
        {
            id: 2,
            userId: 4,
            userName: "Quliyeva Səbinə Məhəmməd qızı",
            apartment: "B-308",
            amount: 580.50,
            type: "utility",
            period: "Июнь-Октябрь 2024",
            dueDate: "2024-06-30",
            daysOverdue: 112,
            status: "critical",
            assignedTo: "Əliyev Rəşad",
            task: "Юридическое уведомление отправлено",
            notes: "Планируется личная встреча",
            submittedAt: "2025-11-23T14:12:00",
            invoiceNumber: "INV-2024/000513",
            expectedAmount: 65,
            receivedAmount: 110,
            complaintReason: "Повторное начисление за прошлый период",
            residentComment: "Сумма включает прошлый месяц, хотя он оплачен.",
            accountant: {
                name: "Əliyev Rəşad",
                status: "Ждёт подтверждение платежа",
                viewedAt: "2025-11-23T15:00:00"
            },
            maintenance: {
                name: "Quliyev Tural",
                status: "Снял показания и передал данные",
                scheduledAt: "2025-11-24T09:30:00"
            },
            stage: "escalated",
            viewed: true,
            timeline: [
                { date: "2025-11-23T14:12:00", text: "Житель подал обращение", icon: "chat-dots-fill", color: "primary" },
                { date: "2025-11-23T16:45:00", text: "Сняты новые показания счётчика", icon: "speedometer2", color: "warning" },
                { date: "2025-11-24T09:30:00", text: "Отчёт передан в бухгалтерию", icon: "clipboard-check-fill", color: "success" }
            ]
        },
        {
            id: 3,
            userId: 5,
            userName: "Mustafayev Kamran Eldar oğlu",
            apartment: "C-405",
            amount: 125.00,
            type: "utility",
            period: "Сентябрь 2024",
            dueDate: "2024-09-30",
            daysOverdue: 20,
            status: "overdue",
            assignedTo: "Həsənov Rafiq",
            task: "Отправлено SMS напоминание",
            notes: "Обещал оплатить до конца недели",
            submittedAt: "2025-11-24T08:10:00",
            invoiceNumber: "INV-2024/000377",
            expectedAmount: 45,
            receivedAmount: 65,
            complaintReason: "Дублируется услуга техобслуживания",
            residentComment: "В счёте два раза указали техобслуживание.",
            accountant: {
                name: "Həsənov Rafiq",
                status: "Не открыт",
                viewedAt: null
            },
            maintenance: {
                name: null,
                status: "Не назначен",
                scheduledAt: null
            },
            stage: "new",
            viewed: false,
            timeline: [
                { date: "2025-11-24T08:10:00", text: "Поступило новое обращение", icon: "chat-dots-fill", color: "primary" }
            ]
        },
        {
            id: 4,
            userId: 8,
            userName: "Hüseynova Nigar Əkbər qızı",
            apartment: "B-215",
            amount: 340.25,
            type: "utility",
            period: "Июль-Сентябрь 2024",
            dueDate: "2024-07-31",
            daysOverdue: 81,
            status: "overdue",
            assignedTo: "Məmmədov Tofiq",
            task: "Ожидается оплата частями",
            notes: "Договорились о рассрочке",
            submittedAt: "2025-11-22T18:40:00",
            invoiceNumber: "INV-2024/000412",
            expectedAmount: 80,
            receivedAmount: 120,
            complaintReason: "Счёт выставлен за неоказанную услугу",
            residentComment: "Включили уборку парковки, но её не было.",
            accountant: {
                name: "Məmmədov Tofiq",
                status: "Ожидает подтверждения службы эксплуатации",
                viewedAt: "2025-11-22T19:05:00"
            },
            maintenance: {
                name: "Rəhimov Kamil",
                status: "Подтвердил отсутствие услуги",
                scheduledAt: "2025-11-23T10:00:00"
            },
            stage: "in_progress",
            viewed: true,
            timeline: [
                { date: "2025-11-22T18:40:00", text: "Житель отправил претензию по квитанции", icon: "chat-dots-fill", color: "primary" },
                { date: "2025-11-23T10:00:00", text: "Эксплуатация подтвердила отсутствие услуги", icon: "tools", color: "warning" }
            ]
        },
        {
            id: 5,
            userId: 6,
            userName: "İsmayılova Leyla Vüqar qızı",
            apartment: "C-502",
            amount: 210.10,
            type: "heating",
            period: "Октябрь 2024",
            dueDate: "2024-10-15",
            daysOverdue: 5,
            status: "overdue",
            assignedTo: "Əliyev Rəşad",
            task: "Проверить начисление тепла",
            notes: "Жалуется на неверные показания",
            submittedAt: "2025-11-24T11:20:00",
            invoiceNumber: "INV-2024/000520",
            expectedAmount: 120,
            receivedAmount: 210.1,
            complaintReason: "Начислено тепло несмотря на отключение",
            residentComment: "В квартире было отключено отопление половину месяца.",
            accountant: {
                name: "Əliyev Rəşad",
                status: "Сравнивает показания",
                viewedAt: null
            },
            maintenance: {
                name: "Quliyev Tural",
                status: "Ожидает доступа в квартиру",
                scheduledAt: "2025-11-25T15:30:00"
            },
            stage: "in_progress",
            viewed: false,
            timeline: [
                { date: "2025-11-24T11:20:00", text: "Житель оставил обращение", icon: "chat-dots-fill", color: "primary" }
            ]
        },
        {
            id: 6,
            userId: 7,
            userName: "Rəhimov Tural Ağa oğlu",
            apartment: "A-303",
            amount: 95.40,
            type: "service",
            period: "Октябрь 2024",
            dueDate: "2024-10-10",
            daysOverdue: 15,
            status: "overdue",
            assignedTo: "Həsənov Rafiq",
            task: "Подтвердить отсутствие уборки подъезда",
            notes: "Жалоба на качество услуги",
            submittedAt: "2025-11-23T08:50:00",
            invoiceNumber: "INV-2024/000421",
            expectedAmount: 60,
            receivedAmount: 95.40,
            complaintReason: "Списана услуга без фактического выполнения",
            residentComment: "Уборки не было, но сумму начислили.",
            accountant: {
                name: "Həsənov Rafiq",
                status: "Связался со службой эксплуатации",
                viewedAt: "2025-11-23T09:10:00"
            },
            maintenance: {
                name: "Rəhimov Kamil",
                status: "Отправлен инспектор",
                scheduledAt: "2025-11-24T12:00:00"
            },
            stage: "escalated",
            viewed: true,
            timeline: [
                { date: "2025-11-23T08:50:00", text: "Поступило обращение по уборке", icon: "chat-dots-fill", color: "primary" },
                { date: "2025-11-23T09:15:00", text: "Служба эксплуатации уведомлена", icon: "bell-fill", color: "info" }
            ]
        },
        {
            id: 7,
            userId: 1,
            userName: "Əliyev Rəşad Əli oğlu",
            apartment: "A-101",
            amount: 180.00,
            type: "utility",
            period: "Октябрь 2024",
            dueDate: "2024-10-05",
            daysOverdue: 18,
            status: "overdue",
            assignedTo: "Məmmədov Tofiq",
            task: "Сверить счетчики воды",
            notes: "Сомневается в корректности показаний",
            submittedAt: "2025-11-21T17:45:00",
            invoiceNumber: "INV-2024/000398",
            expectedAmount: 95,
            receivedAmount: 180,
            complaintReason: "Показания воды удвоены",
            residentComment: "Вода расходуется стабильно, но сумма выросла вдвое.",
            accountant: {
                name: "Məmmədov Tofiq",
                status: "Ждёт отчёт от техслужбы",
                viewedAt: "2025-11-22T09:30:00"
            },
            maintenance: {
                name: "Əliyev Vüqar",
                status: "Назначен повторный опрос жильца",
                scheduledAt: "2025-11-24T10:00:00"
            },
            stage: "in_progress",
            viewed: true,
            timeline: [
                { date: "2025-11-21T17:45:00", text: "Житель сообщил о двойном начислении", icon: "chat-dots-fill", color: "primary" },
                { date: "2025-11-22T09:30:00", text: "Бухгалтерия запросила проверку счетчиков", icon: "clipboard-data", color: "info" }
            ]
        }
    ],

    // 🔧 Заявки на ремонт / Təmir sorğuları / Repair Requests
    repairRequests: [
        {
            id: 1,
            userId: 2,
            userName: "Məmmədova Günel Tofiq qızı",
            apartment: "A-205",
            issue: "Течь в трубе на кухне",
            category: "plumbing",
            priority: "high",
            status: "in_progress",
            createdDate: "2024-10-18",
            dueDate: "2024-10-20",
            assignedTo: "Əliyev Vüqar (Сантехник)",
            assignedDate: "2024-10-18",
            currentTask: "Замена трубы и проверка соединений",
            progress: 60,
            estimatedCost: 85.00,
            notes: "Материалы заказаны, работа начата"
        },
        {
            id: 2,
            userId: 1,
            userName: "Əliyev Rəşad Əli oğlu",
            apartment: "A-101",
            issue: "Не работает домофон",
            category: "electrical",
            priority: "medium",
            status: "pending",
            createdDate: "2024-10-19",
            dueDate: "2024-10-22",
            assignedTo: "Mustafayev Elşən (Электрик)",
            assignedDate: "2024-10-19",
            currentTask: "Диагностика электрической цепи",
            progress: 0,
            estimatedCost: 45.00,
            notes: "Ожидание прибытия мастера"
        },
        {
            id: 3,
            userId: 3,
            userName: "Həsənov Elvin Rafiq oğlu",
            apartment: "B-102",
            issue: "Шум в системе отопления",
            category: "heating",
            priority: "medium",
            status: "in_progress",
            createdDate: "2024-10-17",
            dueDate: "2024-10-21",
            assignedTo: "Quliyev Tural (Техник)",
            assignedDate: "2024-10-17",
            currentTask: "Продувка системы отопления",
            progress: 40,
            estimatedCost: 60.00,
            notes: "Первичная проверка завершена"
        },
        {
            id: 4,
            userId: 6,
            userName: "İsmayılova Leyla Vüqar qızı",
            apartment: "C-502",
            issue: "Треснуло окно в спальне",
            category: "windows",
            priority: "high",
            status: "pending",
            createdDate: "2024-10-20",
            dueDate: "2024-10-23",
            assignedTo: "Rəhimov Kamil (Мастер)",
            assignedDate: "2024-10-20",
            currentTask: "Замер и заказ нового стекла",
            progress: 10,
            estimatedCost: 120.00,
            notes: "Срочный заказ стекла"
        },
        {
            id: 5,
            userId: 7,
            userName: "Rəhimov Tural Ağa oğlu",
            apartment: "A-303",
            issue: "Протечка потолка в ванной",
            category: "plumbing",
            priority: "critical",
            status: "in_progress",
            createdDate: "2024-10-19",
            dueDate: "2024-10-20",
            assignedTo: "Əliyev Vüqar (Сантехник)",
            assignedDate: "2024-10-19",
            currentTask: "Поиск источника протечки с верхнего этажа",
            progress: 30,
            estimatedCost: 150.00,
            notes: "Критическая ситуация, работа в приоритете"
        },
        {
            id: 6,
            userId: 5,
            userName: "Mustafayev Kamran Eldar oğlu",
            apartment: "C-405",
            issue: "Не закрывается дверь подъезда",
            category: "common_area",
            priority: "low",
            status: "new",
            createdDate: "2024-10-20",
            dueDate: "2024-10-25",
            assignedTo: null,
            assignedDate: null,
            currentTask: "Ожидает назначения мастера",
            progress: 0,
            estimatedCost: 30.00,
            notes: "Нужна регулировка петель"
        },
        {
            id: 7,
            userName: "Общая заявка",
            apartment: "Блок B - подъезд 2",
            issue: "Не работает лифт",
            category: "elevator",
            priority: "critical",
            status: "in_progress",
            createdDate: "2024-10-18",
            dueDate: "2024-10-19",
            assignedTo: "İsmayılov Rəşad (Лифтовщик)",
            assignedDate: "2024-10-18",
            currentTask: "Замена двигателя лифта",
            progress: 70,
            estimatedCost: 450.00,
            notes: "Запчасти доставлены, идет установка"
        },
        {
            id: 8,
            userId: 4,
            userName: "Quliyeva Səbinə Məhəmməd qızı",
            apartment: "B-308",
            issue: "Слабый напор воды",
            category: "plumbing",
            priority: "medium",
            status: "pending",
            createdDate: "2024-10-19",
            dueDate: "2024-10-24",
            assignedTo: "Əliyev Vüqar (Сантехник)",
            assignedDate: "2024-10-20",
            currentTask: "Проверка насосной станции",
            progress: 5,
            estimatedCost: 40.00,
            notes: "Назначено на завтра"
        }
    ],

    // 💳 Платежи / Ödənişlər / Payments
    payments: [
        {
            id: 1,
            userId: 1,
            userName: "Əliyev Rəşad Əli oğlu",
            apartment: "A-101",
            amount: 120.50,
            type: "utility",
            method: "bank_transfer",
            status: "completed",
            date: "2024-10-15",
            period: "Октябрь 2024",
            description: "Коммунальные услуги"
        },
        {
            id: 2,
            userId: 3,
            userName: "Həsənov Elvin Rafiq oğlu",
            apartment: "B-102",
            amount: 145.75,
            type: "utility",
            method: "cash",
            status: "completed",
            date: "2024-10-18",
            period: "Октябрь 2024",
            description: "Коммунальные услуги"
        },
        {
            id: 3,
            userId: 6,
            userName: "İsmayılova Leyla Vüqar qızı",
            apartment: "C-502",
            amount: 89.25,
            type: "utility",
            method: "online",
            status: "completed",
            date: "2024-10-20",
            period: "Октябрь 2024",
            description: "Коммунальные услуги"
        },
        {
            id: 4,
            userId: 7,
            userName: "Rəhimov Tural Ağa oğlu",
            apartment: "A-303",
            amount: 110.00,
            type: "utility",
            method: "bank_transfer",
            status: "completed",
            date: "2024-10-17",
            period: "Октябрь 2024",
            description: "Коммунальные услуги"
        }
    ],

    // 📄 Счета / Hesablar / Invoices
    invoices: [
        {
            id: 1,
            userId: 1,
            userName: "Əliyev Rəşad Əli oğlu",
            apartment: "A-101",
            amount: 120.50,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "paid",
            paidDate: "2024-10-15",
            items: [
                { name: "Электричество", amount: 45.50 },
                { name: "Вода", amount: 25.00 },
                { name: "Газ", amount: 30.00 },
                { name: "Уборка", amount: 20.00 }
            ]
        },
        {
            id: 2,
            userId: 2,
            userName: "Məmmədova Günel Tofiq qızı",
            apartment: "A-205",
            amount: 95.00,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "unpaid",
            paidDate: null,
            items: [
                { name: "Электричество", amount: 35.00 },
                { name: "Вода", amount: 20.00 },
                { name: "Газ", amount: 25.00 },
                { name: "Уборка", amount: 15.00 }
            ]
        },
        {
            id: 3,
            userId: 3,
            userName: "Həsənov Elvin Rafiq oğlu",
            apartment: "B-102",
            amount: 145.75,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "paid",
            paidDate: "2024-10-18",
            items: [
                { name: "Электричество", amount: 55.75 },
                { name: "Вода", amount: 30.00 },
                { name: "Газ", amount: 40.00 },
                { name: "Уборка", amount: 20.00 }
            ]
        },
        // Еще 9 счетов для достижения 12 (badge показывает 12)
        {
            id: 4,
            userId: 4,
            userName: "Quliyeva Səbinə Məhəmməd qızı",
            apartment: "B-308",
            amount: 115.50,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "overdue",
            paidDate: null,
            items: [
                { name: "Электричество", amount: 42.50 },
                { name: "Вода", amount: 28.00 },
                { name: "Газ", amount: 30.00 },
                { name: "Уборка", amount: 15.00 }
            ]
        },
        {
            id: 5,
            userId: 5,
            userName: "Mustafayev Kamran Eldar oğlu",
            apartment: "C-405",
            amount: 85.00,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "unpaid",
            paidDate: null,
            items: [
                { name: "Электричество", amount: 32.00 },
                { name: "Вода", amount: 18.00 },
                { name: "Газ", amount: 22.00 },
                { name: "Уборка", amount: 13.00 }
            ]
        },
        {
            id: 6,
            userId: 6,
            userName: "İsmayılova Leyla Vüqar qızı",
            apartment: "C-502",
            amount: 89.25,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "paid",
            paidDate: "2024-10-20",
            items: [
                { name: "Электричество", amount: 35.25 },
                { name: "Вода", amount: 19.00 },
                { name: "Газ", amount: 23.00 },
                { name: "Уборка", amount: 12.00 }
            ]
        },
        {
            id: 7,
            userId: 7,
            userName: "Rəhimov Tural Ağa oğlu",
            apartment: "A-303",
            amount: 110.00,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "paid",
            paidDate: "2024-10-17",
            items: [
                { name: "Электричество", amount: 40.00 },
                { name: "Вода", amount: 25.00 },
                { name: "Газ", amount: 28.00 },
                { name: "Уборка", amount: 17.00 }
            ]
        },
        {
            id: 8,
            userId: 8,
            userName: "Hüseynova Nigar Əkbər qızı",
            apartment: "B-215",
            amount: 98.25,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "unpaid",
            paidDate: null,
            items: [
                { name: "Электричество", amount: 38.25 },
                { name: "Вода", amount: 21.00 },
                { name: "Газ", amount: 26.00 },
                { name: "Уборка", amount: 13.00 }
            ]
        },
        {
            id: 9,
            userName: "Əhmədov Fuad Zakir oğlu",
            apartment: "A-408",
            amount: 132.50,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "unpaid",
            paidDate: null,
            items: [
                { name: "Электричество", amount: 50.50 },
                { name: "Вода", amount: 28.00 },
                { name: "Газ", amount: 34.00 },
                { name: "Уборка", amount: 20.00 }
            ]
        },
        {
            id: 10,
            userName: "Bayramova Könül Elşən qızı",
            apartment: "B-512",
            amount: 105.75,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "unpaid",
            paidDate: null,
            items: [
                { name: "Электричество", amount: 42.75 },
                { name: "Вода", amount: 23.00 },
                { name: "Газ", amount: 28.00 },
                { name: "Уборка", amount: 12.00 }
            ]
        },
        {
            id: 11,
            userName: "Cəfərov Orxan Əli oğlu",
            apartment: "C-218",
            amount: 118.00,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "unpaid",
            paidDate: null,
            items: [
                { name: "Электричество", amount: 45.00 },
                { name: "Вода", amount: 26.00 },
                { name: "Газ", amount: 31.00 },
                { name: "Уборка", amount: 16.00 }
            ]
        },
        {
            id: 12,
            userName: "Sadıqova Aynur Rəşid qızı",
            apartment: "A-610",
            amount: 92.50,
            period: "Октябрь 2024",
            issueDate: "2024-10-01",
            dueDate: "2024-10-15",
            status: "unpaid",
            paidDate: null,
            items: [
                { name: "Электричество", amount: 36.50 },
                { name: "Вода", amount: 20.00 },
                { name: "Газ", amount: 24.00 },
                { name: "Уборка", amount: 12.00 }
            ]
        }
    ],

    // ⚡ Счетчики / Sayğaclar / Meters
    meters: [
        {
            id: 1,
            apartment: "A-101",
            owner: "Əliyev Rəşad Əli oğlu",
            type: "electricity",
            meterNumber: "EL-2024-0101",
            lastReading: 15432,
            currentReading: 15578,
            readingDate: "2024-10-15",
            consumption: 146,
            status: "normal"
        },
        {
            id: 2,
            apartment: "A-101",
            owner: "Əliyev Rəşad Əli oğlu",
            type: "water",
            meterNumber: "WA-2024-0101",
            lastReading: 2345,
            currentReading: 2370,
            readingDate: "2024-10-15",
            consumption: 25,
            status: "normal"
        },
        {
            id: 3,
            apartment: "A-101",
            owner: "Əliyev Rəşad Əli oğlu",
            type: "gas",
            meterNumber: "GA-2024-0101",
            lastReading: 8765,
            currentReading: 8795,
            readingDate: "2024-10-15",
            consumption: 30,
            status: "normal"
        }
    ],

    // 👷 Персонал / İşçilər / Staff
    staff: [
        {
            id: 1,
            name: "Əliyev Vüqar Rafiq oğlu",
            position: "Сантехник",
            phone: "+994 50 111 22 33",
            email: "vugar.aliyev@royalpark.az",
            building: "Все блоки",
            hireDate: "2022-03-15",
            salary: 800,
            status: "active",
            activeRequests: 3,
            completedRequests: 124,
            rating: 4.8
        },
        {
            id: 2,
            name: "Mustafayev Elşən Tofiq oğlu",
            position: "Электрик",
            phone: "+994 51 222 33 44",
            email: "elshan.mustafayev@royalpark.az",
            building: "Блок A, B",
            hireDate: "2022-05-20",
            salary: 750,
            status: "active",
            activeRequests: 1,
            completedRequests: 98,
            rating: 4.6
        },
        {
            id: 3,
            name: "Quliyev Tural Kamran oğlu",
            position: "Техник",
            phone: "+994 55 333 44 55",
            email: "tural.quliyev@royalpark.az",
            building: "Блок C",
            hireDate: "2022-08-10",
            salary: 700,
            status: "active",
            activeRequests: 2,
            completedRequests: 87,
            rating: 4.7
        },
        {
            id: 4,
            name: "Rəhimov Kamil Eldar oğlu",
            position: "Мастер",
            phone: "+994 70 444 55 66",
            email: "kamil.rahimov@royalpark.az",
            building: "Все блоки",
            hireDate: "2023-01-05",
            salary: 850,
            status: "active",
            activeRequests: 1,
            completedRequests: 65,
            rating: 4.9
        },
        {
            id: 5,
            name: "İsmayılov Rəşad Vüqar oğlu",
            position: "Лифтовщик",
            phone: "+994 50 555 66 77",
            email: "rashad.ismayilov@royalpark.az",
            building: "Блок B",
            hireDate: "2021-11-20",
            salary: 900,
            status: "active",
            activeRequests: 1,
            completedRequests: 156,
            rating: 4.7
        },
        {
            id: 6,
            name: "Məmmədov Tofiq Əli oğlu",
            position: "Менеджер здания",
            phone: "+994 51 666 77 88",
            email: "tofiq.mammadov@royalpark.az",
            building: "Блок B",
            hireDate: "2020-06-01",
            salary: 1200,
            status: "active",
            activeRequests: 0,
            completedRequests: 245,
            rating: 4.9
        },
        {
            id: 7,
            name: "Həsənov Rafiq Elvin oğlu",
            position: "Менеджер здания",
            phone: "+994 55 777 88 99",
            email: "rafiq.hasanov@royalpark.az",
            building: "Блок C",
            hireDate: "2021-02-15",
            salary: 1200,
            status: "active",
            activeRequests: 0,
            completedRequests: 198,
            rating: 4.8
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestData;
}












