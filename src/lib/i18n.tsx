"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* ============================================================
   byvivelle sells in Baku in Russian and Azerbaijani, and markets
   in English. All three are first-class here — the dictionary is
   typed off the English tree so a missing key is a build error.
   ============================================================ */

export const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "az", label: "AZ", name: "Azərbaycan" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

const en = {
  nav: {
    collections: "Collections",
    process: "Process",
    occasions: "Occasions",
    order: "Order",
    cta: "Order yours",
    menu: "Menu",
    close: "Close",
    language: "Language",
  },

  hero: {
    eyebrow: "Handmade in Baku · Delivered worldwide",
    titleTop: "Stories that",
    titleBottom: "stay with you.",
    lead: "We turn your photographs, your words and your favourite moments into a personal magazine — printed, bound, and made to be kept.",
    ctaPrimary: "See the collections",
    ctaSecondary: "How it works",
    scroll: "Scroll",
    caption: "The Wedding Journal — Emil & Fidan",
  },

  marquee: ["Memories live forever", "A story", "A day", "A lifetime"],

  about: {
    eyebrow: "What is byvivelle",
    title: "A magazine that is entirely yours.",
    body: [
      "We create personal journals from your photographs, your memories and the moments that mattered. Every journal is your story — laid out, typeset and finished like a real glossy magazine.",
      "No templates you have seen before. Your story, your aesthetic, printed on paper chosen to be handled for years.",
    ],
    stats: [
      { value: "4–6", label: "days to make" },
      { value: "26+", label: "photographs" },
      { value: "100%", label: "designed by hand" },
    ],
  },

  collections: {
    eyebrow: "Collections",
    title: "Every edition begins with your story.",
    lead: "Five ways we bind a memory. Open one to look inside.",
    hint: "Tap a cover to open the album",
    open: "Open album",
    viewer: {
      close: "Close album",
      next: "Next page",
      prev: "Previous page",
      page: "Page",
      of: "of",
      order: "Order this edition",
    },
    items: {
      wedding: {
        title: "The Wedding Journal",
        kicker: "Edition 01",
        description:
          "The day, told properly. Vows, the first look, the people who came — set in a cover you will hand to your children.",
        pages: [
          "Cover — Emil & Fidan, 15.08.2026",
          "Foil title, letterpressed",
          "The rings, morning of",
          "Inside spread and keepsake envelope",
        ],
      },
      birthday: {
        title: "Birthday Edition",
        kicker: "Edition 02",
        description:
          "Your day, your story, your magazine. A year of you — reflections, outfits, the people who showed up.",
        pages: [
          "Volume One and Volume Two",
          "Opening spread",
          "The collage page",
          "Fashion feature",
        ],
      },
      love: {
        title: "Love Edition",
        kicker: "Edition 03",
        description:
          "Made with your memories. The first date, the small habits, the laughing-until-you-cry — pressed between covers.",
        pages: [
          "Love Edition spread",
          "Polaroids and handwriting",
          "Our memories, listed",
          "Every photograph you sent",
        ],
      },
      archive: {
        title: "The Bespoke Archive",
        kicker: "Edition 04",
        description:
          "For everything that does not fit a category — a move abroad, a friendship, a decade. We build the format around the story.",
        pages: [
          "Journals made to order",
          "A cover, made for one person",
          "Handwritten pages",
          "Bound and finished",
        ],
      },
      keepsake: {
        title: "The Keepsake Box",
        kicker: "Presentation",
        description:
          "Every journal arrives sealed in a foil-monogrammed envelope and a ribboned box. The unboxing is part of the gift.",
        pages: [
          "Boxed and ribboned",
          "Foil monogram",
          "Approval spread",
          "Ready to give",
        ],
      },
    },
  },

  process: {
    eyebrow: "How it works",
    title: "Four steps, and it is on your table.",
    steps: [
      {
        n: "01",
        title: "Tell us the story",
        body: "Send us a message. We talk through the occasion, the tone, and who it is for.",
      },
      {
        n: "02",
        title: "Send your photographs",
        body: "Minimum 26 photographs — 36 is the sweet spot. Add the notes, jokes and dates you want printed.",
      },
      {
        n: "03",
        title: "We create",
        body: "We design every spread by hand: layout, typography, colour, paper. Your story, your aesthetic.",
      },
      {
        n: "04",
        title: "Approve and receive",
        body: "You get a digital preview, give feedback and approve the design. Ready in 4–6 days.",
      },
    ],
  },

  occasions: {
    eyebrow: "For any moment worth keeping",
    title: "Made for the days you would not want to forget.",
    items: [
      { title: "Birthdays", body: "A year of you, in print." },
      { title: "Love stories", body: "From the first date onward." },
      { title: "Weddings & anniversaries", body: "The day, and every one after." },
      { title: "Travel & adventures", body: "The places that changed you." },
    ],
  },

  craft: {
    eyebrow: "The details",
    title: "Made to be handled.",
    items: [
      {
        title: "Paper chosen for the hand",
        body: "Heavy uncoated stock with a soft tooth — it holds ink deeply and does not glare under lamplight.",
      },
      {
        title: "Foil, pressed not printed",
        body: "Monograms and titles are stamped in rose-gold foil, so they catch light at an angle the way real foil does.",
      },
      {
        title: "Bound to open flat",
        body: "Spreads lie open without fighting you, so a photograph across the gutter stays whole.",
      },
    ],
  },

  order: {
    eyebrow: "Information & orders",
    title: "Start your journal.",
    lead: "Send us a message with the occasion and the date you need it by. We will reply with a quote and a schedule.",
    facts: [
      { label: "Production time", value: "4–6 days" },
      { label: "Delivery in Baku", value: "Included" },
      { label: "Worldwide delivery", value: "from 35 AZN" },
    ],
    cta: "Message us on Instagram",
    ctaSecondary: "Write to us",
    note: "Orders and questions are handled directly in DM.",
  },

  faq: {
    eyebrow: "Questions",
    title: "Before you order.",
    items: [
      {
        q: "How many photographs do I need to send?",
        a: "A minimum of 26. We recommend 36 — it gives us enough range to build spreads with rhythm instead of repeating the same three faces.",
      },
      {
        q: "What quality do the photographs need to be?",
        a: "Originals, straight from the phone or camera. Do not send screenshots or photographs forwarded through messengers — compression shows badly at print size.",
      },
      {
        q: "Can I see it before it is printed?",
        a: "Always. You receive a full digital preview, and nothing goes to print until you approve the design.",
      },
      {
        q: "Can the journal be in Russian or Azerbaijani?",
        a: "Yes — we typeset in Russian, Azerbaijani and English, and we can mix languages within one journal.",
      },
      {
        q: "How long does it take, start to finish?",
        a: "4–6 days from the moment we have your photographs and your story. Tell us your deadline and we will confirm before you pay.",
      },
    ],
  },

  footer: {
    tagline: "Memories live forever",
    collect: "Collect the moments. Keep the memory.",
    nav: "Explore",
    contact: "Contact",
    rights: "All rights reserved.",
    madeIn: "Baku, Azerbaijan",
  },
} as const;

/**
 * `en` is `as const` so its object keys stay exact, but that also pins every
 * string to its own literal type — which would make "Коллекции" a type error
 * against "Collections". Widening the leaves keeps the shape check (a missing
 * or misspelled key still fails) without demanding identical prose.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : { -readonly [K in keyof T]: Widen<T[K]> };

/** Every other language is checked against the English tree. */
type Dict = Widen<typeof en>;

const ru: Dict = {
  nav: {
    collections: "Коллекции",
    process: "Процесс",
    occasions: "Поводы",
    order: "Заказ",
    cta: "Заказать",
    menu: "Меню",
    close: "Закрыть",
    language: "Язык",
  },

  hero: {
    eyebrow: "Ручная работа в Баку · Доставка по всему миру",
    titleTop: "Истории, которые",
    titleBottom: "остаются с вами.",
    lead: "Мы превращаем ваши фотографии, ваши слова и любимые моменты в персональный журнал — напечатанный, переплетённый и созданный, чтобы его хранили.",
    ctaPrimary: "Смотреть коллекции",
    ctaSecondary: "Как это работает",
    scroll: "Листайте",
    caption: "The Wedding Journal — Эмиль и Фидан",
  },

  marquee: ["Воспоминания живут вечно", "История", "День", "Целая жизнь"],

  about: {
    eyebrow: "Что такое byvivelle",
    title: "Журнал, который принадлежит только вам.",
    body: [
      "Мы создаём персональные журналы из ваших фотографий, воспоминаний и особенных моментов. Каждый журнал — это ваша история, оформленная как настоящий глянцевый журнал.",
      "Никаких шаблонов. Ваша история, ваша эстетика, напечатанная на бумаге, которую приятно держать в руках годами.",
    ],
    stats: [
      { value: "4–6", label: "дней на создание" },
      { value: "26+", label: "фотографий" },
      { value: "100%", label: "ручная вёрстка" },
    ],
  },

  collections: {
    eyebrow: "Коллекции",
    title: "Каждое издание начинается с вашей истории.",
    lead: "Пять способов сохранить воспоминание. Откройте любой, чтобы заглянуть внутрь.",
    hint: "Нажмите на обложку, чтобы открыть альбом",
    open: "Открыть альбом",
    viewer: {
      close: "Закрыть альбом",
      next: "Следующая страница",
      prev: "Предыдущая страница",
      page: "Страница",
      of: "из",
      order: "Заказать это издание",
    },
    items: {
      wedding: {
        title: "Свадебный журнал",
        kicker: "Издание 01",
        description:
          "День, рассказанный как следует. Клятвы, первый взгляд, люди, которые пришли — в обложке, которую вы передадите детям.",
        pages: [
          "Обложка — Эмиль и Фидан, 15.08.2026",
          "Тиснёный заголовок фольгой",
          "Кольца, утро дня",
          "Разворот и конверт-сувенир",
        ],
      },
      birthday: {
        title: "Birthday Edition",
        kicker: "Издание 02",
        description:
          "Твой день, твоя история, твой журнал. Целый год о вас — размышления, образы, люди, которые были рядом.",
        pages: [
          "Том первый и том второй",
          "Первый разворот",
          "Страница коллажа",
          "Модный разворот",
        ],
      },
      love: {
        title: "Love Edition",
        kicker: "Издание 03",
        description:
          "Создано из ваших воспоминаний. Первое свидание, маленькие привычки, смех до слёз — между двумя обложками.",
        pages: [
          "Разворот Love Edition",
          "Полароиды и почерк",
          "Наши воспоминания, списком",
          "Каждая присланная фотография",
        ],
      },
      archive: {
        title: "Индивидуальный архив",
        kicker: "Издание 04",
        description:
          "Для всего, что не помещается в категорию — переезд, дружба, целое десятилетие. Мы строим формат вокруг истории.",
        pages: [
          "Журналы на заказ",
          "Обложка для одного человека",
          "Рукописные страницы",
          "Переплёт и финиш",
        ],
      },
      keepsake: {
        title: "Подарочная коробка",
        kicker: "Оформление",
        description:
          "Каждый журнал приезжает в конверте с тиснёной монограммой и в коробке с лентой. Распаковка — часть подарка.",
        pages: [
          "Коробка с лентой",
          "Монограмма фольгой",
          "Разворот на утверждение",
          "Готово к вручению",
        ],
      },
    },
  },

  process: {
    eyebrow: "Как это работает",
    title: "Четыре шага — и он у вас на столе.",
    steps: [
      {
        n: "01",
        title: "Расскажите историю",
        body: "Напишите нам. Обсудим повод, настроение и для кого создаётся журнал.",
      },
      {
        n: "02",
        title: "Отправьте фотографии",
        body: "Минимум 26 фотографий — оптимально 36. Добавьте заметки, шутки и даты, которые хотите напечатать.",
      },
      {
        n: "03",
        title: "Мы создаём",
        body: "Мы верстаем каждый разворот вручную: композиция, типографика, цвет, бумага. Ваша история, ваша эстетика.",
      },
      {
        n: "04",
        title: "Утвердите и получите",
        body: "Вы получаете цифровое превью, даёте обратную связь и утверждаете дизайн. Готово за 4–6 дней.",
      },
    ],
  },

  occasions: {
    eyebrow: "Для любых важных моментов",
    title: "Для дней, которые не хочется забывать.",
    items: [
      { title: "День рождения", body: "Целый год о вас, в печати." },
      { title: "История любви", body: "С первого свидания и дальше." },
      { title: "Свадьба и годовщины", body: "Тот день и каждый следующий." },
      { title: "Путешествия и приключения", body: "Места, которые вас изменили." },
    ],
  },

  craft: {
    eyebrow: "Детали",
    title: "Создано, чтобы держать в руках.",
    items: [
      {
        title: "Бумага, выбранная на ощупь",
        body: "Плотная матовая бумага с мягкой фактурой — глубоко держит краску и не бликует под лампой.",
      },
      {
        title: "Фольга, а не печать",
        body: "Монограммы и заголовки тиснятся розовым золотом, поэтому ловят свет под углом, как настоящая фольга.",
      },
      {
        title: "Переплёт, раскрывающийся ровно",
        body: "Развороты лежат плоско, и фотография через корешок остаётся целой.",
      },
    ],
  },

  order: {
    eyebrow: "Информация и заказ",
    title: "Начните свой журнал.",
    lead: "Напишите нам повод и дату, к которой нужен журнал. Мы ответим со стоимостью и сроками.",
    facts: [
      { label: "Срок изготовления", value: "4–6 дней" },
      { label: "Доставка по Баку", value: "Включена" },
      { label: "Доставка по миру", value: "от 35 AZN" },
    ],
    cta: "Написать в Instagram",
    ctaSecondary: "Написать нам",
    note: "Заказы и вопросы — напрямую в директ.",
  },

  faq: {
    eyebrow: "Вопросы",
    title: "Перед заказом.",
    items: [
      {
        q: "Сколько фотографий нужно прислать?",
        a: "Минимум 26. Рекомендуем 36 — этого хватает, чтобы собрать развороты с ритмом, а не повторять одни и те же три лица.",
      },
      {
        q: "Какого качества должны быть фотографии?",
        a: "Оригиналы прямо с телефона или камеры. Не присылайте скриншоты и фото, пересланные через мессенджеры — сжатие сильно видно в печати.",
      },
      {
        q: "Можно ли увидеть журнал до печати?",
        a: "Обязательно. Вы получаете полное цифровое превью, и ничего не уходит в печать без вашего утверждения.",
      },
      {
        q: "Может ли журнал быть на русском или азербайджанском?",
        a: "Да — мы верстаем на русском, азербайджанском и английском, и можем смешивать языки в одном журнале.",
      },
      {
        q: "Сколько времени занимает весь процесс?",
        a: "4–6 дней с момента, когда у нас есть ваши фотографии и история. Скажите дедлайн — подтвердим до оплаты.",
      },
    ],
  },

  footer: {
    tagline: "Воспоминания живут вечно",
    collect: "Собирайте моменты. Сохраняйте память.",
    nav: "Разделы",
    contact: "Контакты",
    rights: "Все права защищены.",
    madeIn: "Баку, Азербайджан",
  },
};

const az: Dict = {
  nav: {
    collections: "Kolleksiyalar",
    process: "Proses",
    occasions: "Münasibətlər",
    order: "Sifariş",
    cta: "Sifariş et",
    menu: "Menyu",
    close: "Bağla",
    language: "Dil",
  },

  hero: {
    eyebrow: "Bakıda əl işi · Dünya üzrə çatdırılma",
    titleTop: "Sizinlə qalan",
    titleBottom: "hekayələr.",
    lead: "Fotolarınızı, sözlərinizi və ən sevimli anlarınızı fərdi jurnala çeviririk — çap olunmuş, cildlənmiş və saxlanmaq üçün yaradılmış.",
    ctaPrimary: "Kolleksiyalara bax",
    ctaSecondary: "Necə işləyir",
    scroll: "Sürüşdürün",
    caption: "The Wedding Journal — Emil və Fidan",
  },

  marquee: ["Xatirələr əbədi yaşayır", "Bir hekayə", "Bir gün", "Bir ömür"],

  about: {
    eyebrow: "byvivelle nədir",
    title: "Tamamilə sizə aid olan jurnal.",
    body: [
      "Biz sizin fotolarınızdan, xatirələrinizdən və xüsusi anlarınızdan fərdi jurnallar yaradırıq. Hər jurnal — sizin hekayənizdir, əsl parlaq jurnal kimi tərtib olunur.",
      "Əvvəllər gördüyünüz şablonlar yoxdur. Sizin hekayəniz, sizin estetikanız — illərlə əlinizdə saxlamaq üçün seçilmiş kağızda.",
    ],
    stats: [
      { value: "4–6", label: "günə hazır" },
      { value: "26+", label: "fotoşəkil" },
      { value: "100%", label: "əl ilə dizayn" },
    ],
  },

  collections: {
    eyebrow: "Kolleksiyalar",
    title: "Hər nəşr sizin hekayənizlə başlayır.",
    lead: "Xatirəni qorumağın beş yolu. İçinə baxmaq üçün birini açın.",
    hint: "Albomu açmaq üçün üz qabığına toxunun",
    open: "Albomu aç",
    viewer: {
      close: "Albomu bağla",
      next: "Növbəti səhifə",
      prev: "Əvvəlki səhifə",
      page: "Səhifə",
      of: "/",
      order: "Bu nəşri sifariş et",
    },
    items: {
      wedding: {
        title: "Toy Jurnalı",
        kicker: "Nəşr 01",
        description:
          "O gün, layiqincə danışılmış. Andlar, ilk baxış, gələn insanlar — övladlarınıza verəcəyiniz bir cilddə.",
        pages: [
          "Üz qabığı — Emil və Fidan, 15.08.2026",
          "Folqa ilə basılmış başlıq",
          "Üzüklər, səhər saatları",
          "Daxili açılış və xatirə zərfi",
        ],
      },
      birthday: {
        title: "Birthday Edition",
        kicker: "Nəşr 02",
        description:
          "Sənin günün, sənin hekayən, sənin jurnalın. Bir illik sən — düşüncələr, geyimlər, yanında olan insanlar.",
        pages: [
          "Birinci və ikinci cild",
          "Açılış səhifəsi",
          "Kollaj səhifəsi",
          "Moda bölməsi",
        ],
      },
      love: {
        title: "Love Edition",
        kicker: "Nəşr 03",
        description:
          "Xatirələrinizdən yaradılıb. İlk görüş, kiçik vərdişlər, gözdən yaş gələnə qədər gülüş — iki cildin arasında.",
        pages: [
          "Love Edition açılışı",
          "Polaroidlər və əl yazısı",
          "Xatirələrimiz, siyahı ilə",
          "Göndərdiyiniz hər fotoşəkil",
        ],
      },
      archive: {
        title: "Fərdi Arxiv",
        kicker: "Nəşr 04",
        description:
          "Kateqoriyaya sığmayan hər şey üçün — köçmə, dostluq, bütöv bir onillik. Formatı hekayənin ətrafında qururuq.",
        pages: [
          "Sifarişlə hazırlanan jurnallar",
          "Bir nəfər üçün üz qabığı",
          "Əl yazısı səhifələr",
          "Cildlənmiş və tamamlanmış",
        ],
      },
      keepsake: {
        title: "Xatirə Qutusu",
        kicker: "Təqdimat",
        description:
          "Hər jurnal folqa monoqramlı zərfdə və lentli qutuda gəlir. Qutunun açılışı hədiyyənin bir hissəsidir.",
        pages: [
          "Qutu və lent",
          "Folqa monoqram",
          "Təsdiq üçün açılış",
          "Hədiyyəyə hazır",
        ],
      },
    },
  },

  process: {
    eyebrow: "Necə işləyir",
    title: "Dörd addım — və o, masanızdadır.",
    steps: [
      {
        n: "01",
        title: "Hekayəni danışın",
        body: "Bizə yazın. Münasibəti, ovqatı və kimin üçün olduğunu birlikdə müzakirə edirik.",
      },
      {
        n: "02",
        title: "Fotolarınızı göndərin",
        body: "Minimum 26 fotoşəkil — 36 tövsiyə olunur. Çap etmək istədiyiniz qeydləri, zarafatları və tarixləri əlavə edin.",
      },
      {
        n: "03",
        title: "Biz yaradırıq",
        body: "Hər açılışı əl ilə dizayn edirik: quruluş, tipoqrafiya, rəng, kağız. Sizin hekayəniz, sizin estetikanız.",
      },
      {
        n: "04",
        title: "Təsdiqləyin və alın",
        body: "Rəqəmsal ilkin baxışı alırsınız, rəy bildirirsiniz və dizaynı təsdiqləyirsiniz. 4–6 günə hazırdır.",
      },
    ],
  },

  occasions: {
    eyebrow: "İstənilən vacib anlar üçün",
    title: "Unutmaq istəməyəcəyiniz günlər üçün.",
    items: [
      { title: "Doğum günü", body: "Bir illik sən, çapda." },
      { title: "Sevgi hekayəsi", body: "İlk görüşdən etibarən." },
      { title: "Toy və ildönümləri", body: "O gün və ondan sonrakı hər gün." },
      { title: "Səyahətlər və macəralar", body: "Sizi dəyişdirən yerlər." },
    ],
  },

  craft: {
    eyebrow: "Detallar",
    title: "Əldə tutulmaq üçün yaradılıb.",
    items: [
      {
        title: "Toxunuşa görə seçilmiş kağız",
        body: "Yumşaq səthli qalın mat kağız — mürəkkəbi dərin saxlayır və lampa altında parıldamır.",
      },
      {
        title: "Çap deyil, folqa",
        body: "Monoqramlar və başlıqlar qızılgül-qızılı folqa ilə basılır, ona görə də işığı əsl folqa kimi tutur.",
      },
      {
        title: "Düz açılan cild",
        body: "Açılışlar müqavimət göstərmədən düz durur, beləcə cild boyu uzanan fotoşəkil bütöv qalır.",
      },
    ],
  },

  order: {
    eyebrow: "Məlumat və sifariş",
    title: "Jurnalınıza başlayın.",
    lead: "Münasibəti və lazım olduğu tarixi yazın. Qiymət və cədvəllə cavab verəcəyik.",
    facts: [
      { label: "Hazırlanma müddəti", value: "4–6 gün" },
      { label: "Bakı daxili çatdırılma", value: "Daxildir" },
      { label: "Dünya üzrə çatdırılma", value: "35 AZN-dən" },
    ],
    cta: "Instagram-da yazın",
    ctaSecondary: "Bizə yazın",
    note: "Sifariş və suallar birbaşa DM vasitəsilə həll olunur.",
  },

  faq: {
    eyebrow: "Suallar",
    title: "Sifarişdən əvvəl.",
    items: [
      {
        q: "Neçə fotoşəkil göndərməliyəm?",
        a: "Minimum 26. 36 tövsiyə edirik — bu, eyni üç sifəti təkrarlamaq əvəzinə ritmli açılışlar qurmağa imkan verir.",
      },
      {
        q: "Fotoşəkillərin keyfiyyəti necə olmalıdır?",
        a: "Birbaşa telefondan və ya kameradan orijinallar. Skrinşot və messencerlərdən yönləndirilmiş şəkillər göndərməyin — sıxılma çap ölçüsündə çox görünür.",
      },
      {
        q: "Çapdan əvvəl görə bilərəmmi?",
        a: "Həmişə. Tam rəqəmsal ilkin baxış alırsınız və siz dizaynı təsdiqləməyincə heç nə çapa getmir.",
      },
      {
        q: "Jurnal rus və ya Azərbaycan dilində ola bilərmi?",
        a: "Bəli — rus, Azərbaycan və ingilis dillərində tərtib edirik və bir jurnalda dilləri qarışdıra bilərik.",
      },
      {
        q: "Bütün proses nə qədər çəkir?",
        a: "Fotolarınız və hekayəniz bizdə olduğu andan 4–6 gün. Son tarixinizi deyin — ödənişdən əvvəl təsdiqləyək.",
      },
    ],
  },

  footer: {
    tagline: "Xatirələr əbədi yaşayır",
    collect: "Anları toplayın. Xatirələri qoruyun.",
    nav: "Bölmələr",
    contact: "Əlaqə",
    rights: "Bütün hüquqlar qorunur.",
    madeIn: "Bakı, Azərbaycan",
  },
};

const DICTS: Record<Lang, Dict> = { en, ru, az };

const STORAGE_KEY = "byvivelle.lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always render English first so server and client markup agree; a stored
  // preference is applied in an effect, after hydration.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && stored in DICTS) {
        setLangState(stored);
        return;
      }
    } catch {
      // Private mode / blocked storage — fall through to locale sniffing.
    }

    const nav = navigator.language.slice(0, 2).toLowerCase();
    if (nav === "ru" || nav === "az") setLangState(nav);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference simply will not persist; not worth surfacing.
    }
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, t: DICTS[lang] }),
    [lang, setLang],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}

/** Shorthand for the common case of only needing the dictionary. */
export function useT() {
  return useLanguage().t;
}
