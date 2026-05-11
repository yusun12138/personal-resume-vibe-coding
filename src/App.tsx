import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './App.css'

/* ===== ANIMATION VARIANTS ===== */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const fadeScale = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

/* ===== SVG ICONS ===== */
function IconAI() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
      <path d="M8 14s-4 2-4 6h16c0-4-4-6-4-6" />
      <circle cx="9" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      <path d="M4 4l2 2M20 4l-2 2" />
      <path d="M12 2V0M7 3L5.5 1.5M17 3l1.5-1.5" />
    </svg>
  )
}

function IconData() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-6 4 3 5-7" />
      <circle cx="7" cy="16" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
      <circle cx="11" cy="10" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
      <circle cx="15" cy="13" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
      <circle cx="20" cy="6" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  )
}

function IconCode() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" opacity="0.5" />
    </svg>
  )
}

/* ===== STARFIELD COMPONENT ===== */
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = 0
    let h = 0

    interface Star { x: number; y: number; z: number; pz: number }
    const stars: Star[] = []
    const COUNT = 300

    function resize() {
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight
    }

    function init() {
      resize()
      for (let i = 0; i < COUNT; i++) {
        stars.push({
          x: (Math.random() - 0.5) * w * 2,
          y: (Math.random() - 0.5) * h * 2,
          z: Math.random() * 1000,
          pz: 0,
        })
        stars[i].pz = stars[i].z
      }
    }

    function draw() {
      ctx!.fillStyle = 'rgba(5, 5, 8, 0.15)'
      ctx!.fillRect(0, 0, w, h)

      for (const star of stars) {
        star.pz = star.z
        star.z -= 0.3
        if (star.z < 1) {
          star.x = (Math.random() - 0.5) * w * 2
          star.y = (Math.random() - 0.5) * h * 2
          star.z = 1000
          star.pz = 1000
        }
        const sx = (star.x / star.z) * (w / 4) + w / 2
        const sy = (star.y / star.z) * (h / 4) + h / 2
        const px = (star.x / star.pz) * (w / 4) + w / 2
        const py = (star.y / star.pz) * (h / 4) + h / 2
        const brightness = Math.max(0, 1 - star.z / 1000)
        const size = Math.max(0.2, (1 - star.z / 1000) * 2)

        ctx!.beginPath()
        ctx!.moveTo(px, py)
        ctx!.lineTo(sx, sy)
        ctx!.strokeStyle = `rgba(120, 160, 255, ${brightness * 0.6})`
        ctx!.lineWidth = size
        ctx!.stroke()
        ctx!.beginPath()
        ctx!.arc(sx, sy, size * 0.8, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(180, 200, 255, ${brightness * 0.9})`
        ctx!.fill()
      }
      animId = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="starfield" />
}

/* ===== DATA ===== */
const signals = [
  {
    Icon: IconAI,
    iconClass: 'signal-icon-ai',
    title: 'AIGC 产品落地',
    text: '深耕大模型应用层，具备从 0 到 1 搭建 AI Agent 工作流及 Prompt 工程实战经验。在好未来主导 Wiki 题库与 AI Blog 自动化管线，AI 内容贡献官网近 50% 流量。',
  },
  {
    Icon: IconData,
    iconClass: 'signal-icon-data',
    title: '数据驱动增长',
    text: '擅长通过 SQL / A/B Test 挖掘增长点。在百度文心平台推动主动经营规模提升 83%，覆盖 40w+ 用户；在国美实现用户次日留存提升 5%。',
  },
  {
    Icon: IconCode,
    iconClass: 'signal-icon-tech',
    title: '技术复合背景',
    text: '本硕软件工程专业，熟悉研发全流程。兼具"技术 + 运营 + 数据"的复合产品思维，能高效连接算法侧与业务侧。',
  },
]

const experiences = [
  {
    company: 'SHEIN',
    dept: 'C 端产品组',
    role: 'C 端产品经理实习生',
    date: '2026.04 - 至今',
    desc: '负责全球化 C 端体验和 AI 工具提效方向。主导交易域多语言翻译补全与自动质检 Skill 建设，同步筹备 ABTest 自动化数据分析项目。',
    tags: ['多语言质检', 'Claude Code', 'ABTest 自动化', '全球化体验'],
  },
  {
    company: '好未来',
    dept: '海外产品组',
    role: 'AI 产品实习生',
    date: '2025.09 - 2026.03',
    desc: '负责海外分校官网 Wiki 题库从 0 到 1 建设和 AI Blog 自动化内容矩阵项目，推广至 5 国分校。',
    tags: ['AI 内容', 'SEO 增长', 'Prompt Engineering', 'WordPress'],
  },
  {
    company: '百度',
    dept: '文心智能体平台',
    role: 'AI 产品实习生',
    date: '2025.03 - 2025.08',
    desc: '搭建可视化数据看板，0 到 1 设计任务引导体系和成长中心，功能覆盖 40w+ 用户和 100w+ 智能体。',
    tags: ['Agent Builder', 'A/B Test', '用户分层', '数据看板'],
  },
  {
    company: '国美',
    dept: '通通 AI 社交',
    role: '产品运营实习生',
    date: '2024.11 - 2025.02',
    desc: '主导 AI 数字宠物伴侣两期产品迭代，实现宠物模块有效 DAU 增长 20%，次日留存率达 35%。',
    tags: ['AI 社交', '数据体系', '项目管理', '用户留存'],
  },
]

interface StarProject {
  company: string
  dotClass: string
  role: string
  projects: {
    title: string
    subtitle: string
    status?: 'active' | 'prep'
    s: string
    t: string
    a: string[]
    r: string[]
    metrics?: { value: string; label: string }[]
  }[]
}

const starProjects: StarProject[] = [
  {
    company: 'SHEIN',
    dotClass: 'star-company-dot-shein',
    role: 'C 端产品组 · C 端产品经理实习生 · 2026.04 - 至今',
    projects: [
      {
        title: '多语言翻译补全与自动质检 Skill',
        subtitle: '全球化体验 · AI 工具提效',
        status: 'active',
        s: 'SHEIN 全球化业务中，APP 端和交易域中间层存在大量多语言文案缺失、占位符错误、HTML 标签损坏、英文源文质量不稳定等问题，严重影响不同语种用户的 C 端体验与上线效率。人工翻译和质检效率低、覆盖面不足。',
        t: '设计并搭建一条端到端的多语言自动补全与质检流水线，覆盖 EN 源文质检、空白格翻译、格式回填、规则检查、自动修复和上传格式转换全流程，最大限度减少人工介入。',
        a: [
          '基于 Claude Code Skill + Dify 工作流 + Python 脚本，搭建 EN 质检→空白格识别→批量翻译→JSONL 中间层→Merge 回填→Lint 质检→自动修复→格式转换的完整流水线',
          '沉淀 15 条质检规则，覆盖空值、占位符不一致（{0}/%s/%1$s）、HTML 标签不配对/属性丢失、括号格式、目标语种文字占比、长度异常、菜单大小写、未本地化英文等问题',
          '设计审计日志机制，每个单元格生成一条 PASS/FAIL/SKIP 记录，通过 PASS+FAIL+SKIP=TOTAL 校验保证流程可追溯',
          '实现断点续跑和 JSONL 持久化，支持大批量文件的稳定执行',
        ],
        r: [
          'APP 端完成 1,131 个 Key × 36 语种的补全，自动补全 7,798 个 Value，通过率 99.7%，全程约 40 分钟',
          '在更大批次中支撑约 27 万个翻译格的补全和质检',
          '自动修正 3,216 / 3,225 个质量问题，自动修正率 99.7%',
        ],
        metrics: [
          { value: '99.7%', label: '通过率' },
          { value: '27万', label: '翻译格' },
          { value: '36', label: '语种覆盖' },
          { value: '15', label: '质检规则' },
        ],
      },
      {
        title: 'ABTest 自动化数据分析',
        subtitle: '数据提效 · 全链路自动化',
        status: 'prep',
        s: 'ABTest 实验结果分析高度依赖人工：运营需要手动从平台爬取数据，手动制作图表，再人工撰写分析报告，整个过程耗时长、易出错、难以标准化。',
        t: '搭建一套从数据采集到图表生成到分析报告产出的全链路自动化方案，让运营可以一键获取标准化的实验分析报告。',
        a: [
          '设计数据爬取模块，从 ABTest 实验平台自动抓取实验数据',
          '搭建图表自动生成引擎，根据实验类型自动选择合适的可视化方式',
          '利用 AI 自动产出结构化分析报告，包含实验结论、置信度判断和策略建议',
        ],
        r: [
          '项目筹备中，预计大幅缩短运营分析周期',
        ],
      },
    ],
  },
  {
    company: '好未来',
    dotClass: 'star-company-dot-tal',
    role: '海外产品组 · AI 产品实习生 · 2025.09 - 2026.03',
    projects: [
      {
        title: '海外分校官网 Wiki 题库',
        subtitle: '从 0 到 1 搭建 · SEO 流量承接',
        s: '美国竞赛季期间，AMC8/10/12 等数学竞赛题目存在高搜索需求，但分校官网缺少结构化的题库页面来承接这部分自然流量，大量潜在用户流失到竞品站点。',
        t: '从 0 到 1 建设美国分校官网 Wiki 题库模块，完成后端资源管理平台、前端 SEO 展示页及 AI 自动化工作流的设计，确立以 SEO 为核心的流量获取策略。',
        a: [
          '基于竞品调研，主导完成后端资源管理平台和前端 SEO 展示页的产品设计，确保 AMC 竞赛资源的结构化展示',
          '利用 LLM 搭建自动化内容处理管线，实现上传题目文件的自动解析、去重校验及长度控制',
          '自动生成符合 Google SEO 规范的题目详情页 TDK（Title, Description, Keywords），大幅降低人工运营成本',
          '在页面中加入 IM 入口与广告转化模块，形成流量→留资的闭环',
        ],
        r: [
          '成功上线并覆盖 AMC 竞赛历史全量题目，实现内容生产全自动化',
          '作为官网核心自然流量来源之一，占比约 20%',
          '显著提升了页面收录率与长尾词排名',
          '题库模式成功推广至 5 国分校',
        ],
        metrics: [
          { value: '20%', label: '流量占比' },
          { value: '5 国', label: '推广范围' },
          { value: '100%', label: '自动化率' },
        ],
      },
      {
        title: 'AI Blog 自动化内容矩阵',
        subtitle: '5 国推广 · AIGC 获客验证',
        s: '海外分校 Blog 内容完全依赖人工生产，单篇耗时 60 分钟以上，且难以稳定适配多国家 Google SEO 规则。内容产出效率低，无法支撑快速增长的获客需求。',
        t: '从 0 到 1 搭建端到端的 AIGC 内容生产流程，覆盖美、加、英、法、日 5 国分校，实现从选题到发布的全自动化，并通过转化机制设计验证"AI+SEO"获客模式。',
        a: [
          '主导 5 国分校的 Blog 生成和 Prompt 编写，通过两周一版本的敏捷迭代，持续优化 Prompt 以适配各国语言风格、SEO 规范及业务语气',
          '建立动态 Keywords 库与文章类型库，有效降低内容重复度',
          '打通 AI 生成端与 WordPress 管理后台，实现从选题、生成、配图到草稿箱上传的全自动化',
          '设计"钩子"机制，利用 AI 生成带有引导性的插图与文案，精准吸引用户留资订阅',
        ],
        r: [
          '项目成功推广至 5 个国家分校',
          '美国分校 Blog 日均自然流量突破 3w+，占官网总流量 40%',
          '单篇 Blog 人工编辑时间从 60+ min 降至 10 min 内',
          '有效验证了"AI+SEO"的获客模式',
        ],
        metrics: [
          { value: '3w+', label: '日均流量' },
          { value: '40%', label: '官网占比' },
          { value: '6x', label: '效率提升' },
        ],
      },
    ],
  },
  {
    company: '百度',
    dotClass: 'star-company-dot-baidu',
    role: '文心智能体平台 AgentBuilder · AI 产品实习生 · 2025.03 - 2025.08',
    projects: [
      {
        title: '文心智能体平台成长中心',
        subtitle: '开发者增长 · 数据驱动迭代',
        s: '文心智能体平台"主动经营指标"持续低迷，开发者活跃度与留存不足。通过数据分析发现大量用户存在知识库缺失、调优错误等问题，且缺乏场景化的开发引导，搭建门槛高导致用户流失。',
        t: '从 0 到 1 设计成长中心和任务引导体系，优化用户等级权益和评分标准，通过分层运营策略推动开发者主动经营智能体，提升平台活跃度与留存。',
        a: [
          '搭建可视化数据看板，通过漏斗模型分析用户和智能体维度的多项数据，识别主动经营低迷的可能原因',
          '结合分层问卷与竞品分析，定位到"缺乏场景化开发引导"这一关键痛点',
          '0 到 1 设计任务引导体系，优化成长中心模块，搭建 O 端礼物配置后台与引导配置后台，并接入抽奖系统',
          '设计 A/B Test 方案验证分层引导策略的有效性，输出 PRD 并协同开发上线',
          '制定优质智能体分发 SOP 及"开发宝典"，建立平台内容质量与流量分发的联动机制',
          '基于用户画像（领域/活跃度/等级）制定分层触达策略，策划站内信、节日活动及激励体系',
        ],
        r: [
          '功能覆盖全平台 40w+ 用户及 100w+ 智能体',
          '拉动主动经营规模提升 83%（远超大盘 DAU 涨幅）',
          '推动 L0-L6 各等级用户平均跃迁率提升 5%',
          '显著提升了平台开发者的活跃度与留存',
        ],
        metrics: [
          { value: '83%', label: '经营提升' },
          { value: '40w+', label: '用户覆盖' },
          { value: '100w+', label: '智能体' },
          { value: '5%', label: '跃迁率↑' },
        ],
      },
    ],
  },
  {
    company: '国美',
    dotClass: 'star-company-dot-gome',
    role: '通通 AI 社交 · 产品运营实习生 · 2024.11 - 2025.02',
    projects: [
      {
        title: 'AI 数字宠物伴侣',
        subtitle: '陪伴式智能 AI · 产品迭代与数据体系',
        s: '通通 AI 社交产品的宠物功能模块用户时长和留存率表现不理想，现有功能定位为"简单互动"，缺乏持续使用的驱动力。竞品调研发现"陪伴式智能 AI"方向具有更高的用户粘性潜力。',
        t: '主导宠物功能从"简单互动"向"陪伴式智能 AI"转型的两期产品迭代，建立数据监控体系，确保策略调整有据可依，并保证项目高质量交付。',
        a: [
          '基于用户时长与留存率的数据洞察，结合竞品调研，确定功能转型方向，输出完整 PRD 与交互逻辑',
          '实现宠物聊天、生活贴士等陪伴功能的落地',
          '确立以"宠物模块有效 DAU"为北极星指标，拆解二级关联指标',
          '协同产研团队完成全链路埋点设计，搭建数据监控看板，实现从发现问题到策略优化的数据闭环',
          '建立跨部门协作机制，制定里程碑计划与甘特图，通过每日站会与进度看板管理风险',
        ],
        r: [
          '新功能成功上线并服务 10w+ 用户',
          '实现宠物模块有效 DAU 增长 20%',
          '次日留存率达 35%，七日留存率超 21%（高于行业平均水平）',
          '验证了陪伴式 AI 方向的正确性',
        ],
        metrics: [
          { value: '20%', label: 'DAU 增长' },
          { value: '35%', label: '次日留存' },
          { value: '21%', label: '七日留存' },
          { value: '10w+', label: '服务用户' },
        ],
      },
    ],
  },
]

const education = [
  {
    degree: '硕士',
    degreeClass: 'edu-degree-master',
    school: '北京交通大学',
    major: '软件工程',
    date: '2024.09 - 至今',
    details: [
      { text: '主修课程：软件工程、需求分析与软件设计、Python、深度学习' },
    ],
  },
  {
    degree: '学士',
    degreeClass: 'edu-degree-bachelor',
    school: '大连东软信息学院',
    major: '软件工程',
    date: '2020.09 - 2024.07',
    details: [
      { text: '绩点 3.9，年级排名 4/400', highlight: true },
      { text: '主修课程：软件工程、Java、JavaScript、JavaWeb、Android、SQL' },
    ],
  },
]

const awards = {
  scholarships: [
    '辽宁省政府奖学金（1/400）',
    '校级一等奖学金（3/400）',
    '三好学生、优秀学生干部、优秀团员',
    '学习优胜奖、十佳科技创新奖等 10 余项',
  ],
  competitions: [
    '全国大学生计算机应用技能大赛 Java / C / WPS 组 — 国赛初赛全国前 10%',
    '高教杯全国大学生数学建模大赛 — 省级二等奖',
    '辽宁省财务大数据分析大赛 — 省级一等奖',
    '青年社会工作服务项目设计大赛 — 省级一等奖',
    '累计 15 项省级及以上竞赛获奖',
  ],
}

const skills = [
  { title: '产品能力', items: ['用户场景分析', '需求拆解', 'PRD', '原型设计', '竞品分析', 'A/B Test', '数据复盘'] },
  { title: 'AI 产品', items: ['Agent 设计', 'Prompt Engineering', 'AI 工作流', 'Dify', 'Claude Code', 'Codex'] },
  { title: '技术理解', items: ['Python', 'SQL', 'JavaScript', 'Java', 'JSONL', 'Excel 自动化'] },
  { title: '综合素质', items: ['跨部门协作', '项目管理', 'PRD 产出', '数据看板搭建', '全流程闭环'] },
]

const contactInfo = [
  { label: 'Email', value: '16642600428@163.com' },
  { label: '求职方向', value: 'C 端产品 / AI 产品 / 增长产品' },
  { label: '当前状态', value: '北京交通大学软件工程硕士在读' },
  { label: '电话', value: '166-4260-0428' },
]

/* ===== PARALLAX HERO ===== */
function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section className="hero-section" id="hero" ref={ref}>
      <motion.div className="hero-orb hero-orb-1" style={{ y: orbY }} />
      <motion.div className="hero-orb hero-orb-2" style={{ y: orbY }} />
      <motion.div className="hero-orb hero-orb-3" style={{ y: orbY }} />

      <motion.div initial="hidden" animate="visible" variants={stagger} style={{ y: textY, position: 'relative', zIndex: 2 }}>
        <motion.div variants={fadeUp} className="hero-eyebrow">
          <span className="status-dot" />
          Open to Work · AI 产品经理
        </motion.div>
        <motion.div variants={fadeUp} style={{ position: 'relative' }}>
          <h1 className="hero-name">孙瑜</h1>
          <span className="hero-name-glow" aria-hidden="true">孙瑜</span>
        </motion.div>
        <motion.p variants={fadeUp} className="hero-title">
          <span className="gradient-text">AI 产品经理</span> · 北京交通大学软件工程硕士<span className="cursor-blink">|</span>
        </motion.p>
        <motion.p variants={fadeUp} className="hero-desc">
          本硕软件工程背景，拥有 SHEIN、好未来、百度、国美四段实习经历。擅长将产品判断、技术理解与 AI 工具实践结合，用 Claude Code、Codex、Dify 等工具把问题快速推进为可验证的产品方案。
        </motion.p>
        <motion.div variants={fadeUp} className="hero-actions">
          <a className="btn-primary" href="#projects">查看项目 ↓</a>
          <a className="btn-secondary" href="mailto:16642600428@163.com">联系我 →</a>
        </motion.div>
      </motion.div>

      <motion.div className="hero-stats" initial="hidden" animate="visible" variants={stagger} style={{ position: 'relative', zIndex: 2 }}>
        {[
          { value: '4', label: '段大厂实习' },
          { value: '1 年+', label: '产品实习经验' },
          { value: '40w+', label: '用户覆盖' },
          { value: '15+', label: '省级以上奖项' },
        ].map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="hero-stat">
            <span className="hero-stat-value">{s.value}</span>
            <span className="hero-stat-label">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ===== STAR PROJECT CARD ===== */
function StarProjectCard({ project }: { project: StarProject['projects'][number] }) {
  return (
    <motion.div variants={fadeScale} className="star-card glow-card">
      {project.status && (
        <div className={`star-status-badge ${project.status === 'active' ? 'star-status-active' : 'star-status-prep'}`}>
          <span className="status-dot" style={project.status === 'prep' ? { background: 'var(--accent-orange)', boxShadow: '0 0 12px var(--accent-orange)' } : undefined} />
          {project.status === 'active' ? '进行中' : '筹备中'}
        </div>
      )}
      <h3 className="star-card-title">{project.title}</h3>
      <p className="star-card-subtitle">{project.subtitle}</p>

      <div className="star-grid">
        <div className="star-cell">
          <div className="star-cell-label star-cell-label-s">Situation 背景</div>
          <div className="star-cell-text">{project.s}</div>
        </div>
        <div className="star-cell">
          <div className="star-cell-label star-cell-label-t">Task 任务</div>
          <div className="star-cell-text">{project.t}</div>
        </div>
        <div className="star-cell">
          <div className="star-cell-label star-cell-label-a">Action 行动</div>
          <div className="star-cell-text">
            <ul>{project.a.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <div className="star-cell">
          <div className="star-cell-label star-cell-label-r">Result 成果</div>
          <div className="star-cell-text">
            <ul>{project.r.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </div>

      {project.metrics && (
        <div className="star-metrics-bar">
          {project.metrics.map((m) => (
            <div key={m.label} className="star-metric">
              <span className="star-metric-value">{m.value}</span>
              <span className="star-metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ===== APP ===== */
function App() {
  return (
    <div className="site-shell">
      <Starfield />
      <div className="grid-overlay" />

      <header className="topbar">
        <a className="brand" href="#hero">
          <span className="brand-mark">SY</span>
          <span className="brand-text">孙瑜 Portfolio</span>
        </a>
        <nav className="nav">
          <a href="#signals">能力</a>
          <a href="#experience">经历</a>
          <a href="#projects">项目</a>
          <a href="#education">教育</a>
          <a href="#awards">荣誉</a>
          <a href="#contact">联系</a>
        </nav>
      </header>

      <main>
        <HeroSection />
        <div className="section-divider" />

        {/* ===== SIGNALS ===== */}
        <section className="section" id="signals">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.p variants={fadeUp} className="section-label">Core Strengths</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">技术 × 产品 × AI，三重复合能力</motion.h2>
            <motion.p variants={fadeUp} className="section-desc">不只是写 PRD 的产品经理，也是能理解代码、搭建 AI 工作流、用数据驱动决策的实干型选手。</motion.p>
          </motion.div>
          <motion.div className="signal-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {signals.map((s) => (
              <motion.div key={s.title} variants={fadeScale} className="signal-card glow-card">
                <div className={`signal-icon ${s.iconClass}`}><s.Icon /></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="section-divider" />

        {/* ===== EXPERIENCE TIMELINE ===== */}
        <section className="section" id="experience">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.p variants={fadeUp} className="section-label">Experience</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">从 AI 内容增长到 C 端全球化</motion.h2>
            <motion.p variants={fadeUp} className="section-desc">四段实习横跨 AI 产品、C 端产品、增长产品和产品运营，每段都和 AI 提效或用户增长相关。</motion.p>
          </motion.div>
          <motion.div className="timeline" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={stagger}>
            {experiences.map((exp) => (
              <motion.div key={exp.company} variants={fadeUp} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-header">
                  <span className="timeline-company">{exp.company}</span>
                  <span className="timeline-role">{exp.dept} · {exp.role}</span>
                  <span className="timeline-date">{exp.date}</span>
                </div>
                <p className="timeline-desc">{exp.desc}</p>
                <div className="timeline-tags">
                  {exp.tags.map((tag) => <span key={tag} className="timeline-tag">{tag}</span>)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="section-divider" />

        {/* ===== STAR PROJECTS ===== */}
        <section className="section" id="projects">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.p variants={fadeUp} className="section-label">Project Details · STAR</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">每个项目的完整故事</motion.h2>
            <motion.p variants={fadeUp} className="section-desc">用 Situation / Task / Action / Result 结构，展示我如何定义问题、组织流程、推动协作，并用数据证明结果。</motion.p>
          </motion.div>

          <div className="star-projects">
            {starProjects.map((group) => (
              <motion.div
                key={group.company}
                className="star-company-group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                variants={stagger}
              >
                <motion.div variants={fadeUp} className="star-company-header">
                  <div className={`star-company-dot ${group.dotClass}`} />
                  <span className="star-company-name">{group.company}</span>
                  <span className="star-company-role">{group.role}</span>
                </motion.div>
                {group.projects.map((proj) => (
                  <StarProjectCard key={proj.title} project={proj} />
                ))}
              </motion.div>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* ===== EDUCATION ===== */}
        <section className="section" id="education">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.p variants={fadeUp} className="section-label">Education</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">教育背景</motion.h2>
          </motion.div>
          <motion.div className="edu-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {education.map((edu) => (
              <motion.div key={edu.school} variants={fadeScale} className="edu-card glow-card">
                <span className={`edu-degree ${edu.degreeClass}`}>{edu.degree}</span>
                <h3>{edu.school}</h3>
                <p className="edu-major">{edu.major}</p>
                <p className="edu-date">{edu.date}</p>
                <div className="edu-details">
                  {edu.details.map((d) => (
                    <p key={d.text} className={`edu-detail ${d.highlight ? 'edu-highlight' : ''}`}>{d.text}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="section-divider" />

        {/* ===== SKILLS ===== */}
        <section className="section" id="skills">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.p variants={fadeUp} className="section-label">Skills</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">技能与工具</motion.h2>
          </motion.div>
          <motion.div className="skills-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {skills.map((group) => (
              <motion.div key={group.title} variants={fadeScale} className="skill-group glow-card">
                <div className="skill-group-title">{group.title}</div>
                <div className="skill-tags">
                  {group.items.map((item) => <span key={item} className="skill-tag">{item}</span>)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="section-divider" />

        {/* ===== AWARDS ===== */}
        <section className="section" id="awards">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.p variants={fadeUp} className="section-label">Honors</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">荣誉奖项</motion.h2>
          </motion.div>
          <motion.div className="awards-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.div variants={fadeScale} className="award-category glow-card">
              <div className="award-category-title">🏆 奖学金与行政获奖</div>
              <div className="award-list">
                {awards.scholarships.map((a) => <div key={a} className="award-item">{a}</div>)}
              </div>
            </motion.div>
            <motion.div variants={fadeScale} className="award-category glow-card">
              <div className="award-category-title">🥇 竞赛获奖</div>
              <div className="award-list">
                {awards.competitions.map((a) => <div key={a} className="award-item">{a}</div>)}
              </div>
            </motion.div>
          </motion.div>
        </section>

        <div className="section-divider" />

        {/* ===== CONTACT ===== */}
        <section className="contact-section" id="contact">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.p variants={fadeUp} className="section-label">Contact</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">期待与你交流</motion.h2>
            <motion.p variants={fadeUp} className="section-desc">如果你对我的经历感兴趣，或者有 AI 产品、增长产品相关的机会，欢迎联系我。</motion.p>
          </motion.div>
          <motion.div className="contact-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.div variants={fadeScale} className="contact-card glow-card">
              {contactInfo.map((item) => (
                <div key={item.label} className="contact-item">
                  <span className="contact-label">{item.label}</span>
                  <span className="contact-value">{item.value}</span>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeScale} className="contact-cta glow-card">
              <h3>发送邮件</h3>
              <p>期待你的消息，我会尽快回复。</p>
              <a className="btn-primary" href="mailto:16642600428@163.com">16642600428@163.com</a>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 孙瑜 · Built with React + Vite + Framer Motion</p>
      </footer>
    </div>
  )
}

export default App
