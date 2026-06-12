"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { JuliaChat } from "@/components/JuliaChat";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const CONTACT = [
  {
    label: "Email",
    value: "Julia.Valentina.Lizarazu@gmail.com",
    href: "mailto:Julia.Valentina.Lizarazu@gmail.com",
    icon: "ti-mail",
    color: "#A78BFA",
  },
  {
    label: "Telefono",
    value: "(11) 6160-2160",
    href: "tel:+541161602160",
    icon: "ti-phone",
    color: "#34D399",
  },
  {
    label: "Ubicacion",
    value: "Olivos, Vicente Lopez, Bs.As.",
    href: "https://www.google.com/maps/search/Olivos,+Vicente+Lopez,+Buenos+Aires",
    icon: "ti-map-pin",
    color: "#60A5FA",
  },
  {
    label: "Nacimiento",
    value: "18/05/2005",
    href: "#about",
    icon: "ti-cake",
    color: "#F472B6",
  },
];

const SKILLS = [
  { name: "HTML & CSS", icon: "ti-brand-html5", color: "#F97316", level: 90 },
  { name: "Bootstrap", icon: "ti-brand-bootstrap", color: "#818CF8", level: 85 },
  { name: "SQL", icon: "ti-database", color: "#60A5FA", level: 78 },
  { name: "Java", icon: "ti-coffee", color: "#FBBF24", level: 72 },
  { name: "C# / C++", icon: "ti-code", color: "#A78BFA", level: 70 },
  { name: "Figma", icon: "ti-brand-figma", color: "#F472B6", level: 82 },
  { name: "GitHub", icon: "ti-brand-github", color: "#E2E8F0", level: 80 },
  { name: "Jira / ClickUp", icon: "ti-checklist", color: "#34D399", level: 88 },
  { name: "Premiere / Contenido", icon: "ti-video", color: "#C084FC", level: 74 },
  { name: "Visual Studio Code", icon: "ti-brand-vscode", color: "#60A5FA", level: 86 },
  { name: "Visual Studio", icon: "ti-code-dots", color: "#A78BFA", level: 78 },
];

const EXPERIENCE = [
  {
    period: "2025 - Actualidad",
    role: "Assistant Manager - Proyectos Digitales",
    company: "Gestion tecnica, QA y delivery",
    color: "#A78BFA",
    icon: "ti-rocket",
    points: [
      "Coordinacion y seguimiento de proyectos digitales junto a equipos tecnicos y PMs.",
      "Gestion de tickets, prioridades y avances en Jira y ClickUp.",
      "Testing funcional, aseguramiento de calidad y reporte claro de bugs.",
      "Documentacion de procesos, revision de disenos en Figma y edicion audiovisual en Premiere.",
    ],
  },
  {
    period: "2024 - 2025",
    role: "Community Manager",
    company: "@ladamasco.musica",
    color: "#F472B6",
    icon: "ti-speakerphone",
    points: [
      "Gestion de redes sociales y calendario de contenidos.",
      "Creacion de piezas comunicacionales y acompanamiento de la comunidad online.",
      "Seguimiento del tono de marca y oportunidades de mejora en la comunicacion.",
    ],
  },
  {
    period: "2023 - 2025",
    role: "Asistente Personal",
    company: "RE/MAX",
    color: "#60A5FA",
    icon: "ti-building-community",
    points: [
      "Busqueda de propiedades y soporte a procesos inmobiliarios.",
      "Gestion administrativa, organizacion de informacion y seguimiento de tareas.",
      "Acompanamiento operativo para mejorar tiempos y orden de trabajo.",
    ],
  },
  {
    period: "2022 - 2025",
    role: "Emprendimientos Personales",
    company: "Stanley y frutos secos",
    color: "#34D399",
    icon: "ti-briefcase",
    points: [
      "Venta de productos Stanley desde 2024 y frutos secos desde 2022.",
      "Gestion de relaciones con clientes y proveedores.",
      "Manejo de ventas, inventarios, organizacion y seguimiento de pedidos.",
    ],
  },
];

const EDUCATION = [
  {
    title: "Tecnicatura en Programacion",
    institution: "Universidad Tecnologica Nacional - UTN",
    period: "Marzo 2023 - Julio 2025",
    status: "Graduada",
    icon: "ti-school",
  },
  {
    title: "Secundario con Orientacion en Economia",
    institution: "Instituto Pedro Poveda",
    period: "Finalizado en 2022",
    status: "Finalizado",
    icon: "ti-certificate",
  },
];

const LANGUAGES = [
  {
    title: "Ingles",
    desc: "Formacion en primaria y secundaria en Instituto Pedro Poveda. Actualmente estudiando para la certificacion First.",
    icon: "ti-language",
  },
];

const PROJECTS = [
  {
    tag: "En desarrollo",
    tagColor: "#FBBF24",
    tagBg: "rgba(251,191,36,0.1)",
    title: "App de Gimnasio",
    desc: "Proyecto colaborativo desarrollado junto a companeros de la UTN. Sistema de gestion para gimnasios: turnos, socios y rutinas, con trabajo end-to-end y roles de equipo diferenciados.",
    icons: ["ti-users", "ti-calendar", "ti-barbell"],
    iconColor: "#FBBF24",
  },
  {
    tag: "Experiencia profesional",
    tagColor: "#34D399",
    tagBg: "rgba(52,211,153,0.1)",
    title: "Gestion & QA de Proyectos Digitales",
    desc: "En mi rol actual como Assistant Manager acompano el ciclo completo: requerimientos, revision de disenos en Figma, testing funcional, documentacion y seguimiento de bugs en Jira y ClickUp.",
    icons: ["ti-brand-figma", "ti-bug", "ti-clipboard-check"],
    iconColor: "#34D399",
  },
  {
    tag: "Este portfolio",
    tagColor: "#A78BFA",
    tagBg: "rgba(167,139,250,0.1)",
    title: "Portfolio Web con IA Integrada",
    desc: "Mi web personal con un clon conversacional de IA entrenado con mi perfil real. Diseno Cosmos Dark, animaciones con Framer Motion e integracion conversacional desde el chat.",
    icons: ["ti-robot", "ti-sparkles", "ti-brand-vercel"],
    iconColor: "#A78BFA",
  },
];

function AnimatedBar({ level, color }: { level: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} style={{ height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 2, marginTop: 10 }}>
      <div
        style={{
          height: "100%",
          borderRadius: 2,
          background: `linear-gradient(90deg, #818CF8, ${color})`,
          width: inView ? `${level}%` : "0%",
          transition: "width 1.1s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={className}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: 20,
        backdropFilter: "blur(18px)",
      }}
    >
      {children}
    </motion.div>
  );
}

function ContactCard({ label, value, href, icon, color }: (typeof CONTACT)[0]) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        border: "0.5px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        background: "rgba(255,255,255,0.035)",
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}18`,
          flexShrink: 0,
        }}
      >
        <i className={`ti ${icon}`} style={{ color, fontSize: 18 }} aria-hidden="true" />
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".12em" }}>
          {label}
        </span>
        <span style={{ display: "block", fontSize: 13, color: "var(--text-primary)", overflowWrap: "anywhere" }}>
          {value}
        </span>
      </span>
    </a>
  );
}

function SkillCard({ name, icon, color, level }: (typeof SKILLS)[0]) {
  return (
    <motion.div variants={fadeUp} className="skill-card">
      <div className="skill-icon-wrap" style={{ background: `${color}18` }}>
        <i className={`ti ${icon}`} style={{ color, fontSize: 18 }} aria-hidden="true" />
      </div>
      <p className="skill-name">{name}</p>
      <AnimatedBar level={level} color={color} />
    </motion.div>
  );
}

function ExperienceItem({ item, index }: { item: (typeof EXPERIENCE)[0]; index: number }) {
  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      style={{
        position: "relative",
        paddingLeft: 34,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 6,
          width: 15,
          height: 15,
          borderRadius: "50%",
          background: item.color,
          boxShadow: `0 0 24px ${item.color}80`,
        }}
      />
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "20px 22px",
          backdropFilter: "blur(18px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
          <div>
            <span className="project-tag" style={{ color: item.color, background: `${item.color}18` }}>
              {item.period}
            </span>
            <h3 className="project-title" style={{ marginTop: 12 }}>{item.role}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 12 }}>{item.company}</p>
          </div>
          <div className="project-icon-badge" style={{ background: `${item.color}18`, flexShrink: 0 }}>
            <i className={`ti ${item.icon}`} style={{ color: item.color, fontSize: 16 }} aria-hidden="true" />
          </div>
        </div>
        <ul style={{ display: "grid", gap: 8, paddingLeft: 16, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.65 }}>
          {item.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

function ProjectCard({ tag, tagColor, tagBg, title, desc, icons, iconColor }: (typeof PROJECTS)[0]) {
  return (
    <motion.div variants={fadeUp} className="project-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span className="project-tag" style={{ color: tagColor, background: tagBg }}>
          {tag}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {icons.map((ic) => (
            <div key={ic} className="project-icon-badge" style={{ background: `${iconColor}15` }}>
              <i className={`ti ${ic}`} style={{ color: iconColor, fontSize: 14 }} aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
      <h3 className="project-title">{title}</h3>
      <p className="project-desc">{desc}</p>
    </motion.div>
  );
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        width: ((i * 37) % 20) / 10 + 0.5,
        left: (i * 47) % 100,
        top: (i * 71) % 100,
        duration: (((i * 13) % 30) / 10 + 2).toFixed(1),
        delay: (((i * 17) % 50) / 10).toFixed(1),
      })),
    []
  );

  return (
    <div className="stars-canvas" aria-hidden="true">
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            width: star.width,
            height: star.width,
            left: `${star.left}%`,
            top: `${star.top}%`,
            ["--d" as string]: `${star.duration}s`,
            ["--delay" as string]: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <main className="page-root">
      <Stars />

      <nav className="navbar">
        <span className="nav-logo">Julia Lizarazu</span>
        <ul className="nav-links">
          <li><a href="#about">Sobre mi</a></li>
          <li><a href="#experience">Experiencia</a></li>
          <li><a href="#education">Educacion</a></li>
          <li><a href="#projects">Proyectos</a></li>
        </ul>
        <a
          href="https://www.linkedin.com/in/julia-lizarazu-88369a320/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
        >
          LinkedIn
        </a>
      </nav>

      <div className="split-layout">
        <div className="content-col">
          <motion.section
            className="hero-section"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp}
              className="hero-badges"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  padding: "6px 12px",
                  border: "1px solid rgba(167,139,250,.2)",
                  background: "rgba(168,85,247,.1)",
                  color: "#D8B4FE",
                  fontSize: 12,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                }}
              >
                Tecnica en Programacion - UTN
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  padding: "6px 12px",
                  border: "1px solid rgba(167,139,250,.2)",
                  background: "rgba(99,102,241,.08)",
                  color: "#D8B4FE",
                  fontSize: 12,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  className="eyebrow-dot"
                  style={{
                    width: 7,
                    height: 7,
                    boxShadow: "0 0 16px rgba(167,139,250,.9)",
                  }}
                />
                Disponible para nuevos desafios
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={2} className="display">
              Hola, soy <span className="accent">Julia</span><br />
              <span className="accent">Lizarazu</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={3} className="hero-role">
              Assistant Manager - QA - Desarrollo - Organizacion
            </motion.p>

            <motion.p variants={fadeUp} custom={4} className="hero-desc">
              Programadora graduada de la UTN con foco en tecnologia, gestion y calidad.
              Trabajo cerca de equipos tecnicos para ordenar proyectos digitales, validar
              entregables y convertir ideas en soluciones claras.
            </motion.p>

            <motion.div variants={fadeUp} custom={5} className="hero-ctas">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowContactModal(true)}
              >
                Escribirme
              </button>
              <a href="#experience" className="btn-secondary">
                Ver experiencia
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={6} className="stats-row">
              <div className="stat-item">
                <span className="stat-number">UTN</span>
                <span className="stat-label">Graduada 2025</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-number">QA</span>
                <span className="stat-label">Testing funcional</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-number">PM+</span>
                <span className="stat-label">Gestion digital</span>
              </div>
            </motion.div>
          </motion.section>

          <section id="about" className="page-section">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.p variants={fadeUp} className="section-eyebrow">
                Sobre mi
              </motion.p>
              <GlassCard>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.85, marginBottom: 20 }}>
                  Soy programadora recientemente graduada de la Universidad Tecnologica Nacional (UTN),
                  con una fuerte vocacion por la tecnologia y la organizacion. Actualmente me desempeno
                  como Assistant Manager, donde descubri mi pasion por el ciclo completo del desarrollo
                  de software. Participo activamente en gestion de proyectos, aseguramiento de calidad
                  (QA), documentacion y colaboracion estrecha con equipos tecnicos.
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.85, marginBottom: 22 }}>
                  Busco seguir creciendo en IT, aportando valor en proyectos digitales y desarrollandome
                  en entornos dinamicos y colaborativos donde pueda aplicar tanto mis conocimientos de
                  codigo como mis habilidades blandas.
                </p>
                <motion.div variants={stagger} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                  {CONTACT.map((item) => (
                    <motion.div variants={fadeUp} key={item.label}>
                      <ContactCard {...item} />
                    </motion.div>
                  ))}
                </motion.div>
              </GlassCard>
            </motion.div>
          </section>

          <section id="experience" className="page-section">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.p variants={fadeUp} className="section-eyebrow">
                Experiencia laboral
              </motion.p>
              <div style={{ position: "relative", display: "grid", gap: 18 }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 7,
                    top: 10,
                    bottom: 10,
                    width: 1,
                    background: "linear-gradient(180deg, rgba(167,139,250,.8), rgba(96,165,250,.15))",
                  }}
                />
                {EXPERIENCE.map((item, index) => (
                  <ExperienceItem key={item.role} item={item} index={index} />
                ))}
              </div>
            </motion.div>
          </section>

          <section id="education" className="page-section">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.p variants={fadeUp} className="section-eyebrow">
                Educacion e idiomas
              </motion.p>
              <motion.div variants={stagger} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                {EDUCATION.map((item) => (
                  <GlassCard key={item.title}>
                    <div className="project-icon-badge" style={{ background: "rgba(167,139,250,.15)", marginBottom: 14 }}>
                      <i className={`ti ${item.icon}`} style={{ color: "#A78BFA", fontSize: 16 }} aria-hidden="true" />
                    </div>
                    <h3 className="project-title">{item.title}</h3>
                    <p className="project-desc">{item.institution}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 10 }}>{item.period}</p>
                    <span className="project-tag" style={{ color: "#34D399", background: "rgba(52,211,153,.1)", marginTop: 14 }}>
                      {item.status}
                    </span>
                  </GlassCard>
                ))}
                {LANGUAGES.map((item) => (
                  <GlassCard key={item.title}>
                    <div className="project-icon-badge" style={{ background: "rgba(96,165,250,.15)", marginBottom: 14 }}>
                      <i className={`ti ${item.icon}`} style={{ color: "#60A5FA", fontSize: 16 }} aria-hidden="true" />
                    </div>
                    <h3 className="project-title">{item.title}</h3>
                    <p className="project-desc">{item.desc}</p>
                    <span className="project-tag" style={{ color: "#60A5FA", background: "rgba(96,165,250,.1)", marginTop: 14 }}>
                      First en progreso
                    </span>
                  </GlassCard>
                ))}
              </motion.div>
            </motion.div>
          </section>

          <section id="skills" className="page-section">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.p variants={fadeUp} className="section-eyebrow">
                Stack & herramientas
              </motion.p>
              <motion.div variants={stagger} className="skills-grid">
                {SKILLS.map((s) => (
                  <SkillCard key={s.name} {...s} />
                ))}
              </motion.div>
            </motion.div>
          </section>

          <section id="projects" className="page-section">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.p variants={fadeUp} className="section-eyebrow">
                Proyectos principales
              </motion.p>
              <motion.div variants={stagger} className="projects-list">
                {PROJECTS.map((p) => (
                  <ProjectCard key={p.title} {...p} />
                ))}
              </motion.div>
            </motion.div>
          </section>

          <footer className="flex flex-col gap-3 pt-8 border-t border-purple-500/10 mt-12 text-sm text-slate-400">
            <p>© 2026 Julia Lizarazu.</p>
            <p className="text-slate-500 text-xs">Construido con Next.js, Tailwind CSS y Gemini API ⚡</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <a
                href="https://www.linkedin.com/in/julia-lizarazu-88369a320/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-medium rounded-full bg-purple-500/5 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
              >
                💼 LinkedIn
              </a>
              <a
                href="https://github.com/julializarazu"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-medium rounded-full bg-purple-500/5 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
              >
                💻 GitHub
              </a>
              <a
                href="mailto:Julia.Valentina.Lizarazu@gmail.com"
                className="px-4 py-2 text-xs font-medium rounded-full bg-purple-500/5 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
              >
                ✉️ Email
              </a>
            </div>
          </footer>
        </div>

      </div>

      <JuliaChat />

      <AnimatePresence>
        {showContactModal && (
          <motion.div
            className="contact-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContactModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              background: "rgba(11,14,26,.72)",
              backdropFilter: "blur(14px)",
            }}
          >
            <motion.div
              className="contact-modal-panel"
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: "min(440px, 100%)",
                background: "rgba(255,255,255,.055)",
                border: "0.5px solid rgba(167,139,250,.35)",
                borderRadius: 20,
                padding: 24,
                boxShadow: "0 24px 80px rgba(0,0,0,.45)",
              }}
            >
              <div className="contact-modal-header" style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
                <div>
                  <span className="project-tag" style={{ color: "#A78BFA", background: "rgba(167,139,250,.12)" }}>
                    Contacto
                  </span>
                  <h2 className="project-title" style={{ fontSize: 24, marginTop: 12 }}>
                    Hablemos
                  </h2>
                  <p className="project-desc">
                    Te dejo mis datos para coordinar una charla o avanzar con una oportunidad.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar contacto"
                  onClick={() => setShowContactModal(false)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: "0.5px solid rgba(255,255,255,.12)",
                    background: "rgba(255,255,255,.04)",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <i className="ti ti-x" aria-hidden="true" />
                </button>
              </div>

              <div className="contact-modal-list" style={{ display: "grid", gap: 12 }}>
                <ContactCard
                  label="Email"
                  value="Julia.Valentina.Lizarazu@gmail.com"
                  href="mailto:Julia.Valentina.Lizarazu@gmail.com"
                  icon="ti-mail"
                  color="#A78BFA"
                />
                <ContactCard
                  label="Telefono"
                  value="(11) 6160-2160"
                  href="tel:+541161602160"
                  icon="ti-phone"
                  color="#34D399"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
